#!/usr/bin/env node
// Retry of the 3 posts that failed JSON parsing in rewrite-to-third-person.mjs.
// Switches to XML-tagged output so internal quotes don't break parsing.

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
if (!ANTHROPIC_KEY) { console.error('ANTHROPIC_API_KEY missing'); process.exit(1); }

const TARGET_SLUGS = [
  'why-chasing-google-rankings-might-be-your-biggest-seo-mistake',
  'why-your-teachers-can-actually-tell-when-you-re-faking-your-voice',
];

const SYSTEM = `You are the editor of THE BRIEF, a synthesis-notes publication on alekotools.com. You are rewriting a back-catalog post that was originally first-person founder voice into The Brief's third-person editorial voice. Preserve the post's actual ideas, examples, and stance.

Voice rules (strict):
- Third-person editorial. Never "I" as the author.
- Direct address to reader using "you" is allowed and good.
- Replace personal anecdotes with anonymized observations.
- Banned openings: "You know that feeling when", "I've been there", "Last year I", "I spent $", "I watched a", "I talked to", "We've all", "In today's".
- No AI-flavor phrases: "in today's fast-paced world", "it's no secret that", "at the end of the day".
- No bootstrap-bro / founder-hustle cliches.
- Get to the point by sentence 2.
- End with a concrete takeaway, not a motivational platitude.

Preservation:
- Keep the original stance/argument. Don't invert opinions.
- Keep concrete examples and stats; just remove first-person framing.
- Keep approximate length (don't truncate a 1000-word post).

Output format (XML tags, exact):
<title>Rewritten title in sentence case</title>
<excerpt>One-sentence hook, 140-180 chars. A hook, not a summary.</excerpt>
<content>
Markdown body here. Do not escape any characters. Use real quotes, dashes, etc.
</content>

Return ONLY those three XML tags, in that order, with no other commentary.`;

async function rewritePost(post) {
  const userPrompt = `Rewrite this blog post in third-person editorial voice.

Original title: ${post.title}
Original excerpt: ${post.excerpt}
Original content:
${post.content}

Return only the three XML tags.`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const t = text.match(/<title>([\s\S]*?)<\/title>/);
  const e = text.match(/<excerpt>([\s\S]*?)<\/excerpt>/);
  const c = text.match(/<content>([\s\S]*?)<\/content>/);
  if (!t || !e || !c) throw new Error(`Missing XML tags. Raw: ${text.slice(0, 200)}`);
  return { title: t[1].trim(), excerpt: e[1].trim(), content: c[1].trim() };
}

function serializePosts(posts) {
  const header = `// Blog posts for alekotools.com
// Add new posts here — the scheduled agent will append to this file.
// Posts are sorted by date (newest first) automatically.

export const BLOG_POSTS = [
`;
  const entries = posts.map((p) => `  {
    slug: ${JSON.stringify(p.slug)},
    title: ${JSON.stringify(p.title)},
    excerpt: ${JSON.stringify(p.excerpt)},
    date: ${JSON.stringify(p.date)},
    product: ${JSON.stringify(p.product)},
    keywords: ${JSON.stringify(p.keywords)},
    content: ${JSON.stringify(p.content)},
  },`).join('\n');
  return header + entries + '\n];\n';
}

const mod = await import(pathToFileURL(POSTS_FILE).href + '?t=' + Date.now());
const posts = [...mod.BLOG_POSTS];

let done = 0, failed = 0;
for (const slug of TARGET_SLUGS) {
  const i = posts.findIndex((p) => p.slug === slug);
  if (i < 0) { console.log(`SKIP: slug not found: ${slug}`); continue; }
  process.stdout.write(`[${++done}/${TARGET_SLUGS.length}] ${slug.slice(0, 60)}... `);
  try {
    const t0 = Date.now();
    const r = await rewritePost(posts[i]);
    posts[i] = { ...posts[i], title: r.title, excerpt: r.excerpt, content: r.content };
    writeFileSync(POSTS_FILE, serializePosts(posts), 'utf8');
    process.stdout.write(`ok (${((Date.now() - t0) / 1000).toFixed(1)}s)\n`);
  } catch (e) {
    failed++;
    process.stdout.write(`FAILED: ${e.message.slice(0, 120)}\n`);
  }
}

console.log(`\nRewritten: ${done - failed}, Failed: ${failed}.`);

if (done - failed > 0) {
  try {
    execSync(`git add lib/blog-posts.js`, { cwd: ROOT, stdio: 'pipe' });
    execSync(`git -c commit.gpgsign=false commit -m "brief: rewrite remaining 3 posts (XML retry)"`, { cwd: ROOT, stdio: 'pipe' });
    execSync(`git push`, { cwd: ROOT, stdio: 'pipe' });
    console.log('Pushed.');
  } catch (e) { console.error(`git failed: ${e.message}`); }
}
