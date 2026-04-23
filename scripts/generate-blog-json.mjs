// Generates /public/blog-posts.json from lib/blog-posts.js so the static
// design pages can render real (agent-generated) posts.
//
// Category strategy:
//   1. Try Supabase tool_library at build time (authoritative — every tool
//      has a curated `cat`). Normalizes slugs to match dashed/undashed
//      variants the blog uses in `product`.
//   2. Fall back to a small hardcoded map for tools that never hit
//      tool_library.
//   3. Last-resort fallback: "General" — not "Writing", since writing
//      is a medium, not a topic.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const { BLOG_POSTS } = await import(resolve(root, 'lib/blog-posts.js'));

const SB_URL = 'https://fdnbotpgodpcgqtojnrm.supabase.co';
const SB_KEY = 'sb_publishable_EXP_ArZJG1-dDSY240-ZdQ_91x4KdbQ';

const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const HARDCODED_CAT = {
  'who-meal-planner': 'Health',
  feastmate: 'Health',
  wholefed: 'Health',
  essaycloner: 'Education',
  studypebble: 'Education',
  'study-acorn': 'Education',
  'ai-shadow-shield': 'Security',
  'ai-traffic-guard': 'SEO',
  shadowshield: 'Security',
  trafficguard: 'SEO',
  whowasright: 'Relationships',
  autoeditor: 'Build Log',
  flowdebug: 'Productivity',
  alekotools: 'Thinking',
};

const ACCENT_BY_CAT = {
  Health: '#22c55e',
  Education: '#fbbf24',
  Security: '#ef4444',
  SEO: '#a78bfa',
  Productivity: '#60a5fa',
  Marketing: '#f472b6',
  Creative: '#14b8a6',
  Relationships: '#8b5cf6',
  'Build Log': '#22d3ee',
  Thinking: '#f472b6',
  General: '#a78bfa',
};

// Smart titlecase: keeps AI / WHO / SAT / AP / API / SEO / PDF uppercase.
// Used only as a last-resort fallback when a blog's `product` slug isn't in
// tool_library. The curated tool_library.title is always the preferred source.
const BRAND_WORDS = new Set(['AI', 'WHO', 'SAT', 'AP', 'API', 'SEO', 'PDF']);
function smartTitle(str) {
  return (str || '')
    .replace(/-/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const up = w.toUpperCase();
      if (BRAND_WORDS.has(up)) return up;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

// Try to load live tool info from tool_library. If the build runs without
// network (rare), fall back gracefully.
let supabaseCats = {};
try {
  const res = await fetch(
    `${SB_URL}/rest/v1/tool_library?select=slug,title,cat,accent&visible=eq.true`,
    { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
  );
  if (res.ok) {
    const rows = await res.json();
    for (const r of rows) {
      supabaseCats[normalize(r.slug)] = { cat: r.cat, accent: r.accent, title: r.title };
    }
    console.log(`Fetched ${rows.length} tool categories from Supabase`);
  } else {
    console.warn(`tool_library fetch returned ${res.status} — using hardcoded map`);
  }
} catch (e) {
  console.warn(`tool_library fetch failed (${e.message}) — using hardcoded map`);
}

function resolveToolTitle(product) {
  if (!product) return null;
  const hit = supabaseCats[normalize(product)];
  if (hit?.title) return hit.title;
  return smartTitle(product);
}

function resolveCategory(product) {
  if (!product) return { cat: 'General', accent: ACCENT_BY_CAT.General };
  const norm = normalize(product);
  if (supabaseCats[norm]) {
    return {
      cat: supabaseCats[norm].cat,
      accent: supabaseCats[norm].accent || ACCENT_BY_CAT[supabaseCats[norm].cat] || ACCENT_BY_CAT.General,
    };
  }
  const hard = HARDCODED_CAT[product] || HARDCODED_CAT[norm];
  if (hard) return { cat: hard, accent: ACCENT_BY_CAT[hard] || ACCENT_BY_CAT.General };
  return { cat: 'General', accent: ACCENT_BY_CAT.General };
}

const minified = BLOG_POSTS
  .slice()
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .map((p) => {
    const { cat, accent } = resolveCategory(p.product);
    const words = (p.content || '').trim().split(/\s+/).length;
    const read = `${Math.max(2, Math.round(words / 220))} Min`;
    const d = new Date(p.date);
    const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: dateLabel,
      isoDate: p.date,
      cat,
      accent,
      read,
      words: words.toLocaleString(),
      tool: resolveToolTitle(p.product),
    };
  });

const out = resolve(root, 'public/blog-posts.json');
writeFileSync(out, JSON.stringify(minified, null, 2));
console.log(`Wrote ${minified.length} posts → ${out}`);
