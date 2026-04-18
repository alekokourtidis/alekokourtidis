import Link from "next/link";
import { getPostBySlug, getAllPosts } from "../../../lib/blog-posts";

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
  essaycloner: "https://alekotools.com/essaycloner",
  "essay-cloner": "https://alekotools.com/essaycloner",
  feastmate: "https://apps.apple.com/us/app/feastmate-ai-recipe-generator/id6738283833",
  wholefed: "https://apps.apple.com/app/wholefed",
  "ai-shadow-shield": "https://alekotools.com/shadowshield",
  "ai-traffic-guard": "https://alekotools.com/trafficguard",
  whowasright: "https://alekotools.com/whowasright",
  studyacorn: "https://alekotools.com/studyacorn",
};

const PRODUCT_NAMES = {
  essaycloner: "EssayCloner",
  "essay-cloner": "EssayCloner",
  feastmate: "Feastmate",
  wholefed: "Wholefed",
  "ai-shadow-shield": "AI Shadow Shield",
  "ai-traffic-guard": "AI Traffic Guard",
  whowasright: "WhoWasRight",
  studyacorn: "StudyAcorn",
};

const PRODUCT_COLORS = {
  essaycloner: "#7c3aed",
  "essay-cloner": "#7c3aed",
  feastmate: "#f59e0b",
  wholefed: "#dc2626",
  "ai-shadow-shield": "#10b981",
  "ai-traffic-guard": "#f59e0b",
  whowasright: "#8b5cf6",
  studyacorn: "#16a34a",
};

const TOPIC_GRADIENTS = {
  essaycloner: "linear-gradient(135deg, #1a1030 0%, #09090b 100%)",
  "essay-cloner": "linear-gradient(135deg, #1a1030 0%, #09090b 100%)",
  studyacorn: "linear-gradient(135deg, #0d1f14 0%, #09090b 100%)",
  "ai-shadow-shield": "linear-gradient(135deg, #0d1f1a 0%, #09090b 100%)",
  "ai-traffic-guard": "linear-gradient(135deg, #1f1808 0%, #09090b 100%)",
  whowasright: "linear-gradient(135deg, #1a0d25 0%, #09090b 100%)",
  feastmate: "linear-gradient(135deg, #1f1808 0%, #09090b 100%)",
  wholefed: "linear-gradient(135deg, #1f0d0d 0%, #09090b 100%)",
};

const RELATED_GRADIENTS = {
  essaycloner: "linear-gradient(135deg, #1a1030 0%, #0f0f12 100%)",
  "essay-cloner": "linear-gradient(135deg, #1a1030 0%, #0f0f12 100%)",
  studyacorn: "linear-gradient(135deg, #0d1f14 0%, #0f0f12 100%)",
  feastmate: "linear-gradient(135deg, #1f1808 0%, #0f0f12 100%)",
  wholefed: "linear-gradient(135deg, #1f0d0d 0%, #0f0f12 100%)",
  "ai-shadow-shield": "linear-gradient(135deg, #0d1f1a 0%, #0f0f12 100%)",
  "ai-traffic-guard": "linear-gradient(135deg, #1f1808 0%, #0f0f12 100%)",
  whowasright: "linear-gradient(135deg, #1a0d25 0%, #0f0f12 100%)",
};

function readingTime(content) {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 230));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="container blog-post-page">
        <Link href="/blog" className="back">&larr; Back to blog</Link>
        <h1>Post not found</h1>
      </div>
    );
  }

  const allPosts = getAllPosts();
  // Prefer same-product related posts, then fill with others
  const sameProd = allPosts.filter(p => p.slug !== slug && p.product === post.product);
  const otherProd = allPosts.filter(p => p.slug !== slug && p.product !== post.product);
  const relatedPosts = [...sameProd, ...otherProd].slice(0, 3);

  const blocks = parseContent(post.content);
  const mins = readingTime(post.content);
  const gradient = TOPIC_GRADIENTS[post.product] || "linear-gradient(135deg, #111 0%, #09090b 100%)";
  const accentColor = PRODUCT_COLORS[post.product] || "#63636e";

  return (
    <div className="blog-post-page">
      {/* Hero header with gradient */}
      <div style={{
        background: gradient,
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 0 56px" }}>
          <Link href="/blog" className="back" style={{ marginBottom: 24, display: "inline-flex" }}>
            &larr; Back to blog
          </Link>

          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            marginBottom: 20, fontSize: 13, color: "var(--text-3)", fontWeight: 500,
          }}>
            <span>{formatDate(post.date)}</span>
            <span style={{ opacity: 0.4 }}>&middot;</span>
            <span>{mins} min read</span>
            {post.product && PRODUCT_NAMES[post.product] && (
              <>
                <span style={{ opacity: 0.4 }}>&middot;</span>
                <span style={{
                  color: accentColor,
                  background: `${accentColor}12`,
                  padding: "2px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                }}>{PRODUCT_NAMES[post.product]}</span>
              </>
            )}
          </div>

          <h1 style={{
            fontSize: 40, fontWeight: 900, letterSpacing: "-1.5px",
            lineHeight: 1.12, marginBottom: 20, maxWidth: 640,
          }}>
            {post.title}
          </h1>

          <p style={{
            fontSize: 18, color: "var(--text-2)", lineHeight: 1.7, maxWidth: 560,
          }}>
            {post.excerpt}
          </p>

          {/* Author strip */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginTop: 28,
            paddingTop: 24, borderTop: "1px solid var(--border)",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: accentColor, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff",
            }}>A</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Aleko</div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>Building AI tools &middot; alekotools.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Article body */}
      <article style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px" }}>
        <div className="blog-post-body">
          {blocks.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2 key={i} style={{ marginTop: i === 0 ? 0 : 48 }}>{block.text}</h2>
              );
            }
            if (block.type === "li") {
              return <li key={i} dangerouslySetInnerHTML={{ __html: linkify(block.text) }} />;
            }
            if (block.type === "quote") {
              return (
                <blockquote key={i} style={{
                  borderLeft: `3px solid ${accentColor}`,
                  padding: "14px 24px", margin: "32px 0",
                  fontSize: 17, fontStyle: "italic", color: "var(--text-2)",
                  background: "var(--surface)",
                  borderRadius: "0 12px 12px 0",
                }}>
                  {block.text}
                </blockquote>
              );
            }
            if (i === 0 && block.type === "p") {
              return (
                <p key={i} style={{ fontSize: 18, lineHeight: 1.85, color: "var(--text)", marginBottom: 28 }}
                  dangerouslySetInnerHTML={{ __html: linkify(block.text) }}
                />
              );
            }
            return <p key={i} dangerouslySetInnerHTML={{ __html: linkify(block.text) }} />;
          })}
        </div>

        {/* CTA card */}
        {post.product && PRODUCT_URLS[post.product] && (
          <div style={{
            border: "1px solid var(--border)",
            borderRadius: 16, padding: 32, marginTop: 56,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 24,
            background: "var(--surface)",
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.3px" }}>
                Try {PRODUCT_NAMES[post.product]}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-2)" }}>
                Free to use &middot; No signup required
              </div>
            </div>
            <a href={PRODUCT_URLS[post.product]} target="_blank" rel="noopener"
              style={{
                background: "var(--text)", color: "var(--bg)",
                padding: "12px 24px", borderRadius: 10,
                fontWeight: 700, fontSize: 14, whiteSpace: "nowrap",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}>
              Try it free &rarr;
            </a>
          </div>
        )}
      </article>

      {/* Related posts as visual cards */}
      {relatedPosts.length > 0 && (
        <div style={{
          borderTop: "1px solid var(--border)",
          maxWidth: 720, margin: "0 auto", padding: "48px 24px 72px",
        }}>
          <div style={{
            fontSize: 12, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.08em", color: "var(--text-3)", marginBottom: 20,
          }}>More from the blog</div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
          }}>
            {relatedPosts.map((p) => {
              const relColor = PRODUCT_COLORS[p.product] || "#63636e";
              const relGrad = RELATED_GRADIENTS[p.product] || "linear-gradient(135deg, #151518 0%, #0f0f12 100%)";
              const relName = PRODUCT_NAMES[p.product] || null;
              const relInitial = relName ? relName.charAt(0) : "A";
              return (
                <Link href={`/blog/${p.slug}`} key={p.slug} style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  overflow: "hidden",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  textDecoration: "none",
                  color: "inherit",
                }}>
                  <div style={{
                    height: 80,
                    background: relGrad,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: relColor,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 800, color: "#fff",
                    }}>{relInitial}</div>
                  </div>
                  <div style={{ padding: "14px 16px 16px" }}>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 6, fontWeight: 500 }}>
                      {formatDate(p.date)}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, letterSpacing: "-0.2px" }}>
                      {p.title}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

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
    month: "long", day: "numeric", year: "numeric",
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
    } else if (line.startsWith("> ")) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: "p", text: currentParagraph.join(" ") });
        currentParagraph = [];
      }
      blocks.push({ type: "quote", text: line.replace(/^> /, "") });
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
  let html = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return html;
}
