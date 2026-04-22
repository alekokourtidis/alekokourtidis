// Rewrites the intro of every blog post in lib/blog-posts.js so they:
// (1) don't all start with "You know that feeling when..."
// (2) drop first-person-as-Aleko framing
// (3) each use a different intro archetype (rotated)
//
// Also trims / extends a handful so lengths vary.
// Uses Claude API. Requires ANTHROPIC_API_KEY in env.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_KEY) {
  console.error('ANTHROPIC_API_KEY required. export it from ~/studyacorn/.env.local');
  process.exit(1);
}

const ARCHETYPES = [
  'cold_fact_lede', 'frame_flip', 'definitional', 'list_promise', 'question',
  'taxonomy', 'counter_intuitive', 'historical_anchor', 'quote_cold_open',
  'scene_setting_third_person', 'myth_debunk', 'rule_of_thumb', 'before_after',
  'analogy', 'numbered_observation', 'contrarian_minority', 'tension',
  'redefinition', 'one_line_hook', 'industry_pattern',
];

const LENGTH_TARGETS = ['quick_take', 'explainer', 'listicle', 'primer', 'deep_dive'];

const SYSTEM = `You are the editor of THE BRIEF, a synthesis-notes publication on alekotools.com.

Your job: rewrite the given blog post so it fits the editorial voice below. Return ONLY the new markdown content of the post — nothing else, no commentary, no preamble.

Voice rules (strict):
- THIRD-PERSON / editorial. Not first-person-as-founder.
- Banned openings: "You know that feeling when", "I've been there", "Last year I", "I spent $", "I watched a", "I talked to", "We've all", "In today's".
- Banned phrases anywhere: "I spent $", "I watched a growth director", "I talked to one founder", "I built a small tool and".
- If the original post has first-person lived experience ("I watched Jane..."), rewrite as an anonymous / generalized observation ("Across growth teams, a common pattern is...").
- Tool mention is optional and max once, at the end. If the post promotes a specific tool, keep a single soft mention at the end: "A small tool in this space: [name] (alekotools.com/[slug])". Otherwise drop it.

Length rule:
- Target length: ~LENGTH_WORDS words total, ±15%.

Intro rule:
- Open with this specific archetype: ARCHETYPE_NAME — ARCHETYPE_DESC.
- First sentence must not begin with "You know" or "I".

Preserve:
- Core factual claims, takeaways, and any genuinely useful structure.
- Original topic / keywords / intent.
- Markdown formatting style (H2 headers only if the length warrants it — quick takes shouldn't have headers).

Return ONLY the new markdown body. No surrounding quotes. No preamble.`;

const ARCHETYPE_DESC = {
  cold_fact_lede: 'Open with one concrete, surprising stat or observation.',
  frame_flip: 'State the conventional wisdom, then flip it.',
  definitional: 'Name a specific failure mode or phenomenon that doesn\'t have a common name yet and describe it.',
  list_promise: 'Promise a short list: "Four patterns separate X from Y."',
  question: 'Open with one genuine, non-rhetorical question and answer it immediately.',
  taxonomy: '"There are three kinds of X. Most teams only plan for the first."',
  counter_intuitive: 'Lead with a spicy one-liner, then back it up.',
  historical_anchor: '"In [year], [event]. It changed X in a way most teams still haven\'t internalized."',
  quote_cold_open: 'Open with a striking archetypal quote in italics or quotes.',
  scene_setting_third_person: 'A short cinematic scene (still third-person, not "I"): "It\'s Sunday night. A growth director is three tabs deep..."',
  myth_debunk: '"Conventional wisdom: X. Reality, according to [evidence]: Y."',
  rule_of_thumb: '"A simple rule: if you can\'t [X], you didn\'t [Y]."',
  before_after: '"Before [shift]: [old]. After [shift]: [new]. Most teams still operate like nothing changed."',
  analogy: 'Open with a pointed analogy from a different field.',
  numbered_observation: '"Three things happen when [X]. None of them are good."',
  contrarian_minority: '"The majority of [people] do X. The ones who [outcome] do something different."',
  tension: '"Here\'s the awkward tension: [activity everyone tracks] correlates poorly with [outcome everyone wants]."',
  redefinition: '"The word [X] is doing too much work in this conversation. Let\'s break it apart."',
  one_line_hook: 'A single short fragment or line as paragraph 1. Then the real explainer starts in paragraph 2.',
  industry_pattern: '"Across [N] teams we\'ve looked at, one pattern keeps showing up: [X]."',
};

const LENGTH_WORDS = {
  quick_take: 350,
  explainer: 750,
  listicle: 650,
  primer: 500,
  deep_dive: 1400,
};

async function callClaude(systemPrompt, userContent) {
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
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Claude API ${res.status}: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return data.content?.[0]?.text || '';
}

const { BLOG_POSTS } = await import(resolve(root, 'lib/blog-posts.js'));
const posts = [...BLOG_POSTS];

console.log(`Rewriting ${posts.length} posts…`);

for (let i = 0; i < posts.length; i++) {
  const post = posts[i];
  const archetype = ARCHETYPES[i % ARCHETYPES.length];
  const lengthKey = LENGTH_TARGETS[i % LENGTH_TARGETS.length];
  const targetWords = LENGTH_WORDS[lengthKey];

  const sys = SYSTEM
    .replace('ARCHETYPE_NAME', archetype)
    .replace('ARCHETYPE_DESC', ARCHETYPE_DESC[archetype])
    .replace('LENGTH_WORDS', String(targetWords));

  const user = `Title: ${post.title}\nTopic keywords: ${(post.keywords || []).join(', ')}\nRelated tool (optional mention): ${post.product || 'none'}\n\nOriginal post content:\n\n${post.content}`;

  try {
    const rewritten = (await callClaude(sys, user)).trim();
    if (!rewritten || rewritten.length < 200) {
      console.log(`  ${i + 1}. ${post.slug} — WARNING: short output, keeping original`);
      continue;
    }
    post.content = rewritten;
    // Refresh excerpt from first sentence of new content
    const firstLine = rewritten.replace(/^[#\s>*_-]+/, '').split(/\n\n/)[0] || '';
    post.excerpt = firstLine.length > 180 ? firstLine.slice(0, 175) + '…' : firstLine;
    console.log(`  ${i + 1}. ${post.slug} — rewritten (${archetype}, ~${targetWords}w)`);
  } catch (e) {
    console.log(`  ${i + 1}. ${post.slug} — ERR ${e.message}`);
  }
}

// Write back
const header = `// Blog posts for alekotools.com
// Add new posts here — the scheduled agent will append to this file.
// Posts are sorted by date (newest first) automatically.

export const BLOG_POSTS = `;

const helpers = `;

export function getAllPosts() {
  return [...BLOG_POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  return BLOG_POSTS.find(p => p.slug === slug) || null;
}

export function getPostsByProduct(product) {
  return BLOG_POSTS.filter(p => p.product === product).sort((a, b) => new Date(b.date) - new Date(a.date));
}
`;

writeFileSync(resolve(root, 'lib/blog-posts.js'), header + JSON.stringify(posts, null, 2) + helpers);
console.log(`\n✓ Wrote updated lib/blog-posts.js. Run \`npm run blog:json\` to regenerate JSON, then commit + push.`);
