import Link from "next/link";
import { getPostBySlug, getAllPosts, getPostsByProduct } from "../../../lib/blog-posts";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} — Aleko Tools`,
    description: post.excerpt,
    keywords: post.keywords.join(", "),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

const PRODUCT_URLS = {
  essaycloner: "https://essaycloner.vercel.app",
  feastmate: "https://apps.apple.com/us/app/feastmate-ai-recipe-generator/id6738283833",
  wholefed: "https://apps.apple.com/app/wholefed",
};

const PRODUCT_NAMES = {
  essaycloner: "EssayCloner",
  feastmate: "Feastmate",
  wholefed: "Wholefed",
};

const PRODUCT_COLORS = {
  essaycloner: "#7c3aed",
  feastmate: "#f59e0b",
  wholefed: "#dc2626",
};

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="container blog-post-page">
        <Link href="/blog" className="back">← Back to blog</Link>
        <h1>Post not found</h1>
      </div>
    );
  }

  // Get related posts
  const allPosts = getAllPosts();
  const relatedPosts = allPosts.filter(p => p.slug !== slug).slice(0, 3);

  // Parse content into paragraphs and headings
  const blocks = parseContent(post.content);

  return (
    <div className="container blog-post-page">
      <Link href="/blog" className="back">← Back to blog</Link>

      <article>
        <div className="blog-post-header">
          <div className="blog-meta">
            <span className="blog-date">{formatDate(post.date)}</span>
            {post.product && (
              <span
                className="blog-product-tag"
                style={{ background: `${PRODUCT_COLORS[post.product]}20`, color: PRODUCT_COLORS[post.product] }}
              >
                {PRODUCT_NAMES[post.product]}
              </span>
            )}
          </div>
          <h1>{post.title}</h1>
          <p className="blog-post-excerpt">{post.excerpt}</p>
        </div>

        <div className="blog-post-body">
          {blocks.map((block, i) => {
            if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
            if (block.type === "li") return <li key={i} dangerouslySetInnerHTML={{ __html: linkify(block.text) }} />;
            return <p key={i} dangerouslySetInnerHTML={{ __html: linkify(block.text) }} />;
          })}
        </div>

        {/* CTA */}
        {post.product && (
          <div className="blog-cta">
            <h3>Try {PRODUCT_NAMES[post.product]}</h3>
            <p>{post.excerpt}</p>
            <a href={PRODUCT_URLS[post.product]} target="_blank" rel="noopener" className="cta">
              Try it free →
            </a>
          </div>
        )}
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="blog-related">
          <h2>More from the blog</h2>
          <div className="blog-list">
            {relatedPosts.map((p) => (
              <Link href={`/blog/${p.slug}`} key={p.slug} className="blog-card">
                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span className="blog-date">{formatDate(p.date)}</span>
                  </div>
                  <h2>{p.title}</h2>
                  <p>{p.excerpt}</p>
                </div>
                <span className="blog-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* JSON-LD for blog post */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { "@type": "Person", name: "Aleko" },
            publisher: { "@type": "Organization", name: "Aleko Tools" },
            keywords: post.keywords.join(", "),
          }),
        }}
      />
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

function parseContent(content) {
  const lines = content.split("\n");
  const blocks = [];
  let currentParagraph = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: "p", text: currentParagraph.join(" ") });
        currentParagraph = [];
      }
      blocks.push({ type: "h2", text: line.replace("## ", "") });
    } else if (line.startsWith("- **") || line.startsWith("- ")) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: "p", text: currentParagraph.join(" ") });
        currentParagraph = [];
      }
      blocks.push({ type: "li", text: line.replace(/^- /, "") });
    } else if (line.trim() === "") {
      if (currentParagraph.length > 0) {
        blocks.push({ type: "p", text: currentParagraph.join(" ") });
        currentParagraph = [];
      }
    } else {
      currentParagraph.push(line);
    }
  }
  if (currentParagraph.length > 0) {
    blocks.push({ type: "p", text: currentParagraph.join(" ") });
  }
  return blocks;
}

function linkify(text) {
  // Convert markdown bold
  let html = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Convert markdown links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return html;
}
