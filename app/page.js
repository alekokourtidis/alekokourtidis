import Link from "next/link";
import { getDeployedProducts } from "../lib/supabase";
import { getAllPosts } from "../lib/blog-posts";
import EmailCapture from "./components/EmailCapture";

const PRODUCT_COLORS = {
  "answer-my-pdf": "#2563eb",
  "essay-cloner": "#7c3aed",
  feastmate: "#f59e0b",
  wholefed: "#dc2626",
  "ai-shadow-shield": "#10b981",
};

const PRODUCT_PRICING = {
  "answer-my-pdf": "$1.99/mo",
  "essay-cloner": "Free",
  feastmate: "$4.99/mo",
  wholefed: "Free",
  "ai-shadow-shield": "$19/mo",
};

export default async function Home() {
  let products = [];
  try {
    products = await getDeployedProducts();
  } catch {}

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

      {/* Tools Section */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Tools</span>
        </div>

        {products.length === 0 ? (
          <p style={{ color: "var(--text-muted)", padding: "40px 0", textAlign: "center", fontSize: 14 }}>
            Loading tools...
          </p>
        ) : (
          <div className="products">
            {products.map((product) => {
              const evaluation = product.evaluations?.[0] || product.evaluations;
              const color = PRODUCT_COLORS[product.project_name] || "#525252";
              const pricing = PRODUCT_PRICING[product.project_name] || "Free";
              const initial = formatName(product.project_name).charAt(0);

              return (
                <Link href={`/${product.project_name}`} key={product.id} className="product-card">
                  <div className="card-top">
                    <div className="card-icon" style={{ background: color }}>
                      {initial}
                    </div>
                    <span className="card-badge">Live</span>
                  </div>
                  <h3>{formatName(product.project_name)}</h3>
                  <div className="tagline">
                    {product.tagline || evaluation?.eli17 || ""}
                  </div>
                  <div className="card-footer">
                    <span className="card-price">{pricing}</span>
                    <span className="card-arrow">View →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
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

function formatName(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}
