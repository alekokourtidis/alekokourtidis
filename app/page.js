import Link from "next/link";
import { getDeployedProducts } from "../lib/supabase";
import { getAllPosts } from "../lib/blog-posts";
import EmailCapture from "./components/EmailCapture";

const PRODUCT_COLORS = {
  "essay-cloner": "#7c3aed",
  studyacorn: "#16a34a",
  feastmate: "#f59e0b",
  wholefed: "#dc2626",
  "ai-shadow-shield": "#10b981",
  "ai-traffic-guard": "#f59e0b",
  "whowasright": "#8b5cf6",
};

const PRODUCT_PRICING = {
  "essay-cloner": "$1.99/mo",
  studyacorn: "Free",
  feastmate: "$4.99/mo",
  wholefed: "Free",
  "ai-shadow-shield": "$19/mo",
  "whowasright": "Free",
  "ai-traffic-guard": "$29/mo",
};

// Core products that always show up (not dependent on Supabase)
const CORE_PRODUCTS = [
  {
    id: "essaycloner",
    project_name: "essay-cloner",
    tagline: "AI essays written in your personal voice — not ChatGPT's",
    deploy_url: "/essaycloner",
  },
  {
    id: "studyacorn",
    project_name: "studyacorn",
    tagline: "Adaptive AP and SAT study guide that finds your gaps",
    deploy_url: "/studyacorn",
  },
  {
    id: "ai-shadow-shield",
    project_name: "ai-shadow-shield",
    tagline: "Know when your company is being cloned with AI",
    deploy_url: "/shadowshield",
  },
  {
    id: "ai-traffic-guard",
    project_name: "ai-traffic-guard",
    tagline: "Track keywords stolen by Google AI Overviews",
    deploy_url: "/trafficguard",
  },
  {
    id: "wholefed",
    project_name: "wholefed",
    tagline: "Snap a photo of your food, get instant AI health analysis (iOS)",
    deploy_url: "https://apps.apple.com/app/wholefed",
    isApp: true,
  },
  {
    id: "feastmate",
    project_name: "feastmate",
    tagline: "AI recipe generator — set your macros, pick ingredients, get full recipes (iOS)",
    deploy_url: "https://apps.apple.com/us/app/feastmate-ai-recipe-generator/id6738283833",
    isApp: true,
  },
];

export default async function Home() {
  let supabaseProducts = [];
  try {
    supabaseProducts = await getDeployedProducts();
  } catch {}

  // Merge: core products + any Supabase products not already in core
  const coreNames = new Set(CORE_PRODUCTS.map(p => p.project_name));
  const extraProducts = supabaseProducts.filter(p => !coreNames.has(p.project_name));
  const products = [...CORE_PRODUCTS, ...extraProducts];

  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="container">
      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">Open-source AI tools</div>
        <h1>Tools that solve real problems</h1>
        <p>
          A growing collection of AI-powered tools built for students.
          Each one solves a specific problem — no bloat, no fluff.
        </p>
      </div>

      {/* Web Tools */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Web Tools</span>
        </div>
        <div className="products">
          {products.filter(p => !p.isApp).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Mobile Apps */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Mobile Apps</span>
        </div>
        <div className="products">
          {products.filter(p => p.isApp).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">Latest from the blog</span>
            <Link href="/blog" className="section-link">View all →</Link>
          </div>
          <div className="blog-list" style={{ paddingBottom: 0 }}>
            {recentPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-card">
                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span className="blog-date">{formatDate(post.date)}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                </div>
                <span className="blog-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Email Capture */}
      <EmailCapture />
    </div>
  );
}

const TOOL_ROUTES = {
  "essay-cloner": "/essaycloner",
  "ai-shadow-shield": "/shadowshield",
  "ai-traffic-guard": "/trafficguard",
  "argument-analyzer-ten": "/whowasright",
  "studyacorn": "/studyacorn",
};

function getProductUrl(product) {
  if (product.isApp) return product.deploy_url;
  return TOOL_ROUTES[product.project_name] || product.deploy_url || `/${product.project_name}`;
}

function ProductCard({ product }) {
  const evaluation = product.evaluations?.[0] || product.evaluations;
  const color = PRODUCT_COLORS[product.project_name] || "#525252";
  const pricing = PRODUCT_PRICING[product.project_name] || "Free";
  const initial = formatName(product.project_name).charAt(0);
  const url = getProductUrl(product);
  const isExternal = url.startsWith("http");

  return (
    <Link href={url} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener" : undefined} className="product-card">
      <div className="card-top">
        <div className="card-icon" style={{ background: color }}>
          {initial}
        </div>
        <span className="card-badge">{product.isApp ? "App Store" : "Live"}</span>
      </div>
      <h3>{formatName(product.project_name)}</h3>
      <div className="tagline">
        {product.tagline || evaluation?.eli17 || ""}
      </div>
      <div className="card-footer">
        <span className="card-price">{pricing}</span>
        <span className="card-arrow">{product.isApp ? "Download →" : "Try it →"}</span>
      </div>
    </Link>
  );
}

function formatName(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}
