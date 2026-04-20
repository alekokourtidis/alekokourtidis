// Generates /public/blog-posts.json from lib/blog-posts.js so the static
// design pages can render real (agent-generated) posts.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const { BLOG_POSTS } = await import(resolve(root, 'lib/blog-posts.js'));

const CAT_BY_PRODUCT = {
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
  flowdebug: 'Build Log',
  alekotools: 'Thinking',
};
const ACCENT_BY_CAT = {
  Health: '#22c55e',
  Education: '#fbbf24',
  Security: '#ef4444',
  SEO: '#a78bfa',
  Relationships: '#60a5fa',
  'Build Log': '#22d3ee',
  Thinking: '#f472b6',
};

const minified = BLOG_POSTS
  .slice()
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .map((p) => {
    const cat = CAT_BY_PRODUCT[p.product] || 'Writing';
    const accent = ACCENT_BY_CAT[cat] || '#a78bfa';
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
      tool: p.product || null,
    };
  });

const out = resolve(root, 'public/blog-posts.json');
writeFileSync(out, JSON.stringify(minified, null, 2));
console.log(`Wrote ${minified.length} posts → ${out}`);
