#!/usr/bin/env node
// One-shot back-catalog rewrite. Pulls every post in lib/blog-posts.js,
// detects first-person/founder-narrator framing, and rewrites the title,
// excerpt, and body in The Brief's third-person editorial voice.
// Preserves slug, date, product, and keywords. Saves incrementally so
// a mid-run failure doesn't lose progress.
//
// Usage:
//   ANTHROPIC_API_KEY=... node scripts/rewrite-to-third-person.mjs
//   (or just: node scripts/rewrite-to-third-person.mjs — it loads ~/.env)

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const POSTS_FILE = resolve(ROOT, 'lib/blog-posts.js');

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
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

// First-person + founder-narrator markers. Any hit = candidate for rewrite.
const FIRST_PERSON_PATTERNS = [
  /\bI['']?(ve|d|m|ll)?\s/i,
  /\bI\s+(was|had|went|spent|watched|talked|built|made|saw|heard|noticed|tried|found|started|kept|got|wrote|asked|told|read|figured|realized|learned|decided|wanted|needed|thought|knew|felt)\b/i,
  /\bMy\s+(friend|mom|dad|sister|brother|teacher|partner|wife|husband|cousin|uncle|aunt|professor|coach|boss|coworker|family|life)\b/i,
  /\bMe\b\s+and\b/i,
  /\bWe['']?ve\s+all\b/i,
  /\bYou know that feeling\b/i,
  /\bLast (year|month|week) I\b/i,
  /\bIn today's\b/i,
];

function needsRewrite(post) {
  const blob = `${post.title}\n${post.excerpt}\n${post.content}`;
  return FIRST_PERSON_PATTERNS.some((rx) => rx.test(blob));
}

const SYSTEM_PROMPT = `You are the editor of THE BRIEF, a synthesis-notes publication on alekotools.com. You are rewriting a back-catalog post that was originally written in first-person founder voice. Your job: rewrite it in The Brief's third-person editorial voice while preserving the post's actual ideas, examples, and stance.

Voice rules (strict):
- THIRD-PERSON / editorial. Never "I" as the author.
- Direct address to reader using "you" is allowed and good.
- Replace personal anecdotes ("My friend got accused of...") with anonymized observations ("Across schools, students are getting accused of..." or "A growing pattern: students get accused of...").
- Banned openings: "You know that feeling when", "I've been there", "Last year I", "I spent $", "I watched a", "I talked to", "We've all", "In today's".
- No AI-flavor phrases: "in today's fast-paced world", "it's no secret that", "at the end of the day".
- No bootstrap-bro / founder-hustle cliches.
- Get to the point by sentence 2.
- End with a concrete takeaway, not a motivational platitude.

Preservation rules:
- Keep the actual stance/argument of the original. Don't invert opinions.
- Keep concrete examples and stats; just remove the first-person framing around them.
- Keep approximate length (don't truncate a 1000-word post into 300).
- If the original was a soft tool pitch, keep the soft pitch — but as third-person.

Output format (strict JSON, no markdown fences, no preamble):
{
  "title": "Rewritten title in sentence case",
  "excerpt": "One-sentence hook, 140-180 chars. A hook, not a summary.",
  "content": "Markdown body. Same approximate length as original."
}`;

async function rewritePost(post) {
  const userPrompt = `Rewrite the following blog post in third-person editorial voice. Preserve the slug ${JSON.stringify(post.slug)}, the date, the product tag, and the keywords — those will not change. Only rewrite title, excerpt, and content.

Original title: ${post.title}
Original excerpt: ${post.excerpt}
Original content:
${post.content}

Return ONLY the JSON object described in the system prompt.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
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

function serializePosts(posts) {
  const header = `// Blog posts for alekotools.com
// Add new posts here — the scheduled agent will append to this file.
// Posts are sorted by date (newest first) automatically.

export const BLOG_POSTS = [
`;
  const entries = posts.map((p) => {
    return `  {
    slug: ${JSON.stringify(p.slug)},
    title: ${JSON.stringify(p.title)},
    excerpt: ${JSON.stringify(p.excerpt)},
    date: ${JSON.stringify(p.date)},
    product: ${JSON.stringify(p.product)},
    keywords: ${JSON.stringify(p.keywords)},
    content: ${JSON.stringify(p.content)},
  },`;
  }).join('\n');
  return header + entries + '\n];\n';
}

// --- Run

const mod = await import(pathToFileURL(POSTS_FILE).href);
const posts = [...mod.BLOG_POSTS];
console.log(`Loaded ${posts.length} posts.`);

const candidates = posts.map((p, i) => ({ p, i })).filter(({ p }) => needsRewrite(p));
console.log(`${candidates.length} need rewrite (third-person violations detected).`);

let done = 0;
let failed = 0;
for (const { p, i } of candidates) {
  const label = `[${++done}/${candidates.length}] ${p.slug.slice(0, 50)}`;
  try {
    process.stdout.write(`${label}... `);
    const t0 = Date.now();
    const rewritten = await rewritePost(p);
    posts[i] = {
      ...p,
      title: rewritten.title || p.title,
      excerpt: rewritten.excerpt || p.excerpt,
      content: rewritten.content || p.content,
    };
    // Save after every successful rewrite so a crash doesn't lose work.
    writeFileSync(POSTS_FILE, serializePosts(posts), 'utf8');
    process.stdout.write(`ok (${((Date.now() - t0) / 1000).toFixed(1)}s)\n`);
  } catch (e) {
    failed++;
    process.stdout.write(`FAILED: ${e.message.slice(0, 100)}\n`);
  }
}

console.log(`\nDone. Rewritten: ${done - failed}, Failed: ${failed}.`);

// Single commit + push for the whole batch.
try {
  execSync(`git add lib/blog-posts.js`, { cwd: ROOT, stdio: 'pipe' });
  execSync(`git -c commit.gpgsign=false commit -m "brief: rewrite back catalog to third-person editorial voice"`, { cwd: ROOT, stdio: 'pipe' });
  execSync(`git push`, { cwd: ROOT, stdio: 'pipe' });
  console.log('Pushed.');
} catch (e) {
  console.error(`git failed: ${e.message}`);
}
