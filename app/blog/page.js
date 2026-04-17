import Link from "next/link";
import { getAllPosts } from "../../lib/blog-posts";

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
  essaycloner: "#a78bfa",
  feastmate: "#fbbf24",
  wholefed: "#f87171",
};

const PRODUCT_NAMES = {
  essaycloner: "EssayCloner",
  feastmate: "Feastmate",
  wholefed: "Wholefed",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="container">
      <div className="blog-header">
        <h1>Blog</h1>
        <p>Guides, tips, and insights on building and using AI tools.</p>
      </div>

      <div className="blog-list">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-card">
            <div className="blog-card-content">
              <div className="blog-meta">
                <span className="blog-date">{formatDate(post.date)}</span>
                {post.product && (
                  <span
                    className="blog-product-tag"
                    style={{ background: `${PRODUCT_COLORS[post.product]}18`, color: PRODUCT_COLORS[post.product] }}
                  >
                    {PRODUCT_NAMES[post.product]}
                  </span>
                )}
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className="blog-keywords">
                {post.keywords.slice(0, 3).map(k => (
                  <span key={k} className="blog-keyword">{k}</span>
                ))}
              </div>
            </div>
            <span className="blog-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
