#!/usr/bin/env node
// Generates one StudyPebble-adjacent blog post per day, appends to
// lib/blog-posts.js, commits and pushes. Driven by launchd:
//   ~/Library/LaunchAgents/com.aleko.daily-studypebble-post.plist
//
// The post follows the editorial voice in AGENT_PROMPT.md (third-person,
// no founder-as-narrator). StudyPebble is mentioned softly at the end
// when natural — not as a pitch in every paragraph.
//
// Topic + archetype + length are rotated deterministically based on day-of-year
// so the same combo doesn't repeat for ~30 days.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const POSTS_FILE = resolve(ROOT, 'lib/blog-posts.js');

// Pull key from ~/.env if not in process env (launchd doesn't inherit shell env).
function loadEnvFromHome() {
  if (process.env.ANTHROPIC_API_KEY) return;
  try {
    const env = readFileSync(`${process.env.HOME}/.env`, 'utf8');
    for (const line of env.split('\n')) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  } catch { /* ignore */ }
}
loadEnvFromHome();

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_KEY) {
  console.error('ANTHROPIC_API_KEY missing — add to ~/.env');
  process.exit(1);
}

// 30 topic seeds — rotation by day-of-year keeps repeats > 30 days apart.
const TOPICS = [
  'why cramming the week before AP exams works for some students and fails others',
  'the gap between knowing AP content and being able to answer FRQs under time pressure',
  'how spaced repetition actually changes long-term retention vs re-reading notes',
  'what AP graders actually look for in DBQ essays (the rubric line items most students miss)',
  'why high schoolers under-prepare for SAT math even when they "know the material"',
  'the underrated value of doing one full timed AP practice exam before the real thing',
  'what changed in the AP exam format for 2026 and how it affects prep strategy',
  'how to triage what to study when there are 10 days left until an AP exam',
  'the difference between studying for SAT R&W vs studying for a class English exam',
  'why most "study hacks" on TikTok are useless for high-stakes exams',
  'the cognitive science behind active recall (and why flashcards aren\'t enough)',
  'how AP class grade and AP exam score correlate — and where they don\'t',
  'why FRQ self-grading is the most overlooked study skill',
  'what to do when you\'re stuck on an AP science free-response with 5 minutes left',
  'the case against highlighting textbooks (and what works instead)',
  'how to decide whether to take both AP Calc AB and BC, or just BC',
  'AP Stats vs AP Calc AB — which actually matters for college admissions',
  'why AP Lang is harder than AP Lit for most students (and how to study for it)',
  'the SAT score plateau — why students stop improving after 1400 and what breaks it',
  'how to use ChatGPT to study without making yourself worse at the actual subject',
  'AP Bio vs AP Chem study load: a realistic comparison',
  'why AP Human Geography is the easiest 5 most students never get',
  'study burnout in junior year — pattern recognition and what helps',
  'how AP Comparative Government is taught vs how it\'s tested',
  'the role of memorization in AP World History (and what to actually memorize)',
  'why mock SAT scores from prep books are misleading',
  'AP Psychology after the 2024 redesign — what the new framework actually changed',
  'when to switch from learning new material to reviewing weak areas before an AP',
  'how to write an AP English thesis statement that doesn\'t sound formulaic',
  'the underrated power of explaining a concept out loud as a study technique',
];

const ARCHETYPES = [
  'cold_fact_lede', 'frame_flip', 'definitional', 'list_promise', 'question',
  'taxonomy', 'counter_intuitive', 'historical_anchor', 'quote_cold_open',
  'scene_setting_third_person', 'myth_debunk', 'rule_of_thumb', 'before_after',
  'analogy', 'numbered_observation', 'contrarian_minority', 'tension',
  'redefinition', 'one_line_hook', 'industry_pattern',
];

// 40% quick takes, 25% explainers, 15% listicles, 10% deep dives, 10% primers.
const LENGTHS = [
  ...Array(4).fill('quick_take'),
  ...Array(3).fill('explainer'),
  ...Array(2).fill('listicle'),
  ...Array(1).fill('deep_dive'),
  ...Array(1).fill('primer'),
];

const LENGTH_SPEC = {
  quick_take: '250-400 words. One clear point, one example, done. No H2 headers.',
  explainer: '600-900 words. Frame a problem, walk through the structure, end with a concrete takeaway. Optional H2 headers.',
  listicle: '500-800 words. Numbered items, each short and specific. No filler.',
  deep_dive: '1200-1800 words. Multi-section with H2 headers. Only when the topic warrants it.',
  primer: '400-600 words. "What X is, why it matters, who should care, what to read next."',
};

function dayOfYear(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / (1000 * 60 * 60 * 24));
}

const SYSTEM_PROMPT = `You are the editor of THE BRIEF, a synthesis-notes publication on alekotools.com. The Brief is NOT a personal blog. The author is invisible.

# RULE 1 (HARD CONSTRAINT — no exceptions): NO FIRST PERSON.

The author NEVER refers to themselves. The pronouns "I", "me", "my", "mine", "myself", "we" (as the author/team), "us", "our" do not appear in the post — not in the title, not in the excerpt, not in the body — except inside quoted dialogue from a third party (e.g., a quoted sentence from a study, a researcher, or an example character).

If you find yourself wanting to write "I" or "we" as the author voice, STOP and rewrite that sentence as third-person observation or as direct address to the reader using "you".

Examples:
- BAD: "I think the AP exam format changed in 2026."
- GOOD: "The AP exam format changed in 2026."
- BAD: "We've all been there — three days before the exam, panicking."
- GOOD: "Three days before the exam, panic kicks in. Most students respond by doubling down on the wrong things."
- BAD: "I built a tool that does this."
- GOOD: "A small tool in this space does this."

# Other voice rules:
- Direct address to reader using "you" is allowed and good.
- Banned openings: "You know that feeling when", "I've been there", "Last year I", "I spent $", "I watched a", "I talked to", "We've all", "In today's".
- No AI-flavor phrases: "in today's fast-paced world", "it's no secret that", "at the end of the day".
- No bootstrap-bro / founder-hustle cliches.
- No fluff intros — get to the point by sentence 2.
- End with a concrete takeaway, not a motivational platitude.

Tool mention rule:
- StudyPebble is allowed ONE soft mention near the end, formatted: "A small tool in this space: [StudyPebble](https://studypebble.com) — adaptive AP/SAT practice with AI grading."
- Do NOT make the post a pitch. The post should be useful even if StudyPebble didn't exist.
- If the topic doesn't naturally invite the mention, skip it entirely.

Output format (strict JSON, no markdown fences, no preamble):
{
  "slug": "kebab-case-slug-max-60-chars",
  "title": "Title in sentence case",
  "excerpt": "One-sentence hook, 140-180 chars. A hook, not a summary.",
  "keywords": ["3-7 search keywords as lowercase strings"],
  "content": "Markdown body. Follow length and intro-archetype rules from the user prompt."
}`;

async function generatePost({ topic, archetype, length }) {
  const userPrompt = `Write one blog post for THE BRIEF.

Topic: ${topic}

Intro archetype to use: ${archetype}
Length: ${length} (${LENGTH_SPEC[length]})

Return ONLY the JSON object described in the system prompt. No markdown fences. No commentary.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude API ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON in response: ${text.slice(0, 200)}`);
  return JSON.parse(jsonMatch[0]);
}

function slugify(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function appendToPostsFile(post) {
  const src = readFileSync(POSTS_FILE, 'utf8');
  const insertAt = src.indexOf('export const BLOG_POSTS = [');
  if (insertAt < 0) throw new Error('Could not locate BLOG_POSTS array');
  const arrStart = src.indexOf('[', insertAt) + 1;

  const newEntry = `
  {
    slug: ${JSON.stringify(post.slug)},
    title: ${JSON.stringify(post.title)},
    excerpt: ${JSON.stringify(post.excerpt)},
    date: ${JSON.stringify(post.date)},
    product: "studypebble",
    keywords: ${JSON.stringify(post.keywords)},
    content: ${JSON.stringify(post.content)},
  },`;

  const updated = src.slice(0, arrStart) + newEntry + src.slice(arrStart);
  writeFileSync(POSTS_FILE, updated, 'utf8');
}

function gitCommitAndPush(slug) {
  try {
    execSync(`git add lib/blog-posts.js`, { cwd: ROOT, stdio: 'pipe' });
    execSync(`git -c commit.gpgsign=false commit -m "brief: ${slug}"`, { cwd: ROOT, stdio: 'pipe' });
    execSync(`git push`, { cwd: ROOT, stdio: 'pipe' });
    return true;
  } catch (e) {
    console.error(`git failed: ${e.message}`);
    return false;
  }
}

// --- Run

const today = new Date();
const doy = dayOfYear(today);
const topic = TOPICS[doy % TOPICS.length];
const archetype = ARCHETYPES[doy % ARCHETYPES.length];
const length = LENGTHS[doy % LENGTHS.length];
const dateStr = today.toISOString().slice(0, 10);

console.log(`[${dateStr}] topic="${topic.slice(0, 60)}..." archetype=${archetype} length=${length}`);

const post = await generatePost({ topic, archetype, length });

if (!post.slug) post.slug = slugify(post.title || topic);
post.date = dateStr;

// Idempotency: skip if a post with the same slug or same date+slug exists.
const existing = readFileSync(POSTS_FILE, 'utf8');
if (existing.includes(`slug: ${JSON.stringify(post.slug)}`)) {
  console.log(`Slug "${post.slug}" already exists. Skipping to avoid duplicate.`);
  process.exit(0);
}

appendToPostsFile(post);
console.log(`Appended: ${post.title}`);

const pushed = gitCommitAndPush(post.slug);
console.log(pushed ? `Pushed. Vercel will redeploy.` : `Wrote file but git push failed.`);
