// Removes posts whose content opens with any banned first-person / copy-paste intro.
// Run: node scripts/purge-duplicate-intros.mjs
// Then: npm run blog:json && git commit && push.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const { BLOG_POSTS } = await import(resolve(root, 'lib/blog-posts.js'));

const BANNED_INTROS = [
  /^you know that feeling/i,
  /^i've been there/i,
  /^last year i/i,
  /^we've all/i,
  /^in today's/i,
  /^i watched a /i,
  /^i spent \$/i,
  /^i talked to /i,
];

const survivors = BLOG_POSTS.filter((p) => {
  const opener = (p.content || '').trim().slice(0, 120);
  const banned = BANNED_INTROS.some((rx) => rx.test(opener));
  if (banned) console.log(`✗ purging ${p.slug}`);
  return !banned;
});

const removed = BLOG_POSTS.length - survivors.length;
console.log(`\nRemoved ${removed} posts. ${survivors.length} survived.`);

if (removed === 0) {
  console.log('Nothing to do.');
  process.exit(0);
}

// Regenerate the file
const header = `// Blog posts for alekotools.com
// Add new posts here — the scheduled agent will append to this file.
// Posts are sorted by date (newest first) automatically.

export const BLOG_POSTS = `;

const body = JSON.stringify(survivors, null, 2);

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

writeFileSync(resolve(root, 'lib/blog-posts.js'), header + body + helpers);
console.log(`\n✓ Wrote updated lib/blog-posts.js — run \`npm run blog:json\` next.`);
