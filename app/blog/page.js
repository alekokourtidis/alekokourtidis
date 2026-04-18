import Link from "next/link";
import { getAllPosts } from "../../lib/blog-posts";
import BlogFilters from "./BlogFilters";

export const metadata = {
  title: "Blog — Aleko Tools",
  description: "Tips, guides, and insights on AI tools for students. Learn how to use AI effectively without getting caught.",
  openGraph: {
    title: "Blog — Aleko Tools",
    description: "Tips, guides, and insights on AI tools for students.",
    type: "website",
  },
};

const PRODUCT_COLORS = {
  essaycloner: "#7c3aed",
  "essay-cloner": "#7c3aed",
  feastmate: "#f59e0b",
  wholefed: "#dc2626",
  studyacorn: "#16a34a",
  "ai-shadow-shield": "#10b981",
  "ai-traffic-guard": "#f59e0b",
  whowasright: "#8b5cf6",
};

const PRODUCT_GRADIENTS = {
  essaycloner: "linear-gradient(135deg, #1a1030 0%, #0f0f12 100%)",
  "essay-cloner": "linear-gradient(135deg, #1a1030 0%, #0f0f12 100%)",
  studyacorn: "linear-gradient(135deg, #0d1f14 0%, #0f0f12 100%)",
  feastmate: "linear-gradient(135deg, #1f1808 0%, #0f0f12 100%)",
  wholefed: "linear-gradient(135deg, #1f0d0d 0%, #0f0f12 100%)",
  "ai-shadow-shield": "linear-gradient(135deg, #0d1f1a 0%, #0f0f12 100%)",
  "ai-traffic-guard": "linear-gradient(135deg, #1f1808 0%, #0f0f12 100%)",
  whowasright: "linear-gradient(135deg, #1a0d25 0%, #0f0f12 100%)",
};

const PRODUCT_NAMES = {
  essaycloner: "EssayCloner",
  "essay-cloner": "EssayCloner",
  feastmate: "Feastmate",
  wholefed: "Wholefed",
  studyacorn: "StudyAcorn",
  "ai-shadow-shield": "AI Shadow Shield",
  "ai-traffic-guard": "AI Traffic Guard",
  whowasright: "WhoWasRight",
};

function readingTime(content) {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 230));
}

export default function BlogIndex() {
  const posts = getAllPosts();

  // Get unique product filters
  const productSet = new Set();
  posts.forEach(p => { if (p.product) productSet.add(p.product); });
  const filters = Array.from(productSet).map(key => ({
    key,
    label: PRODUCT_NAMES[key] || key,
  }));

  // Prepare serializable post data
  const postsData = posts.map(post => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    product: post.product || null,
    keywords: post.keywords || [],
    readingTime: readingTime(post.content),
    color: PRODUCT_COLORS[post.product] || "#63636e",
    gradient: PRODUCT_GRADIENTS[post.product] || "linear-gradient(135deg, #151518 0%, #0f0f12 100%)",
    productName: PRODUCT_NAMES[post.product] || null,
    initial: post.product ? (PRODUCT_NAMES[post.product] || post.product).charAt(0).toUpperCase() : "A",
  }));

  return (
    <div className="container">
      <div className="blog-hero">
        <h1>Blog</h1>
        <p>Guides, deep dives, and insights on building AI tools that people actually use.</p>
      </div>

      <BlogFilters filters={filters} posts={postsData} />
    </div>
  );
}
