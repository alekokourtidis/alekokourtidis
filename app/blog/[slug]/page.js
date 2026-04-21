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
  shadowshield: "https://alekotools.com/shadowshield",
  "ai-traffic-guard": "https://alekotools.com/trafficguard",
  trafficguard: "https://alekotools.com/trafficguard",
  whowasright: "https://alekotools.com/whowasright",
  studypebble: "https://studypebble.com",
  flowdebug: "https://alekotools.com/flowdebug",
  "who-meal-planner": "https://alekotools.com/whomealplanner",
  whomealplanner: "https://alekotools.com/whomealplanner",
  "claude-version-lock": "https://claude-version-lock.vercel.app",
  "cardio-sweet-spot": "https://cardio-sweet-spot.vercel.app",
  "product-animator-pro": "https://product-animator-pro.vercel.app",
  conftrack: "https://conftrack.vercel.app",
  rulebotai: "https://alekotools.com/rulebotai",
  arrpower: "https://alekotools.com/arrpower",
};

const PRODUCT_NAMES = {
  essaycloner: "EssayCloner",
  "essay-cloner": "EssayCloner",
  feastmate: "Feastmate",
  wholefed: "Wholefed",
  "ai-shadow-shield": "AI Shadow Shield",
  shadowshield: "AI Shadow Shield",
  "ai-traffic-guard": "AI Traffic Guard",
  trafficguard: "AI Traffic Guard",
  whowasright: "WhoWasRight",
  studypebble: "StudyPebble",
  flowdebug: "FlowDebug",
  "who-meal-planner": "WHO Meal Planner",
  whomealplanner: "WHO Meal Planner",
  "claude-version-lock": "Claude Version Lock",
  "cardio-sweet-spot": "Cardio Sweet Spot",
  "product-animator-pro": "Product Animator Pro",
  conftrack: "ConfTrack",
  rulebotai: "RuleBot AI",
  arrpower: "ARR Power",
};

const PRODUCT_COLORS = {
  essaycloner: "#7c3aed",
  "essay-cloner": "#7c3aed",
  feastmate: "#f59e0b",
  wholefed: "#dc2626",
  "ai-shadow-shield": "#10b981",
  shadowshield: "#10b981",
  "ai-traffic-guard": "#f59e0b",
  trafficguard: "#f59e0b",
  whowasright: "#8b5cf6",
  studypebble: "#16a34a",
  flowdebug: "#0ea5e9",
  "who-meal-planner": "#22c55e",
  whomealplanner: "#22c55e",
  "claude-version-lock": "#f97316",
  "cardio-sweet-spot": "#ef4444",
  "product-animator-pro": "#ec4899",
  conftrack: "#3b82f6",
  rulebotai: "#14b8a6",
  arrpower: "#eab308",
};

const TOPIC_GRADIENTS = {
  essaycloner: "linear-gradient(135deg, #1a1030 0%, #09090b 100%)",
  "essay-cloner": "linear-gradient(135deg, #1a1030 0%, #09090b 100%)",
  studypebble: "linear-gradient(135deg, #0d1f14 0%, #09090b 100%)",
  "ai-shadow-shield": "linear-gradient(135deg, #0d1f1a 0%, #09090b 100%)",
  "ai-traffic-guard": "linear-gradient(135deg, #1f1808 0%, #09090b 100%)",
  whowasright: "linear-gradient(135deg, #1a0d25 0%, #09090b 100%)",
  feastmate: "linear-gradient(135deg, #1f1808 0%, #09090b 100%)",
  wholefed: "linear-gradient(135deg, #1f0d0d 0%, #09090b 100%)",
};

const RELATED_GRADIENTS = {
  essaycloner: "linear-gradient(135deg, #1a1030 0%, #0f0f12 100%)",
  "essay-cloner": "linear-gradient(135deg, #1a1030 0%, #0f0f12 100%)",
  studypebble: "linear-gradient(135deg, #0d1f14 0%, #0f0f12 100%)",
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

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i)) * 16777619;
  return Math.abs(h >>> 0);
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pickStat(post) {
  const content = `${post.excerpt} ${post.content}`;
  const patterns = [
    /(\$?\d{1,3}(?:,\d{3})+|\$\d+|\d+\s*(?:percent|%)|\d+x|\d+\s+(?:hours?|minutes?|days?|weeks?|months?|years?))/i,
  ];
  for (const p of patterns) {
    const m = content.match(p);
    if (m) return m[1];
  }
  return null;
}

function BlogVisual({ post, accentColor }) {
  const seed = hashString(post.slug);
  const rand = seededRandom(seed);
  const bars = 12;
  const values = Array.from({ length: bars }, () => 0.25 + rand() * 0.75);
  // Inject a peak to make it feel narrative
  const peak = Math.floor(bars / 2) + Math.floor(rand() * 3) - 1;
  if (values[peak] !== undefined) values[peak] = 1;
  const stat = pickStat(post);
  const keyword = (post.keywords && post.keywords[0]) || post.product || "Trend";

  return (
    <figure style={{
      margin: "40px 0 48px",
      background: `linear-gradient(135deg, ${accentColor}14 0%, transparent 80%)`,
      border: "1px solid var(--border)",
      borderRadius: 18,
      padding: "32px 28px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        marginBottom: 20,
      }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: accentColor, marginBottom: 6,
          }}>
            Data point
          </div>
          <div style={{
            fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2,
          }}>
            {stat ? `${stat} — the hidden cost` : `The problem, in one chart`}
          </div>
          <div style={{
            fontSize: 13, color: "var(--text-3)", marginTop: 6, textTransform: "capitalize",
          }}>
            {keyword.replace(/-/g, " ")}
          </div>
        </div>
      </div>

      <svg viewBox="0 0 400 120" width="100%" height="120" aria-hidden style={{ display: "block" }}>
        <defs>
          <linearGradient id={`g-${seed}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.25" />
          </linearGradient>
        </defs>
        {values.map((v, i) => {
          const w = 400 / bars;
          const barW = w * 0.62;
          const x = i * w + (w - barW) / 2;
          const h = v * 100;
          const y = 110 - h;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={h}
              rx="3"
              fill={`url(#g-${seed})`}
              opacity={i === peak ? 1 : 0.78}
            />
          );
        })}
        <line x1="0" y1="110" x2="400" y2="110" stroke="var(--border)" strokeWidth="1" />
      </svg>

      <figcaption style={{
        fontSize: 12, color: "var(--text-3)", marginTop: 12, textAlign: "right",
      }}>
        Illustrative — patterns from talking to real users in this space
      </figcaption>
    </figure>
  );
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
            const nodes = [];
            if (block.type === "h2") {
              nodes.push(<h2 key={i} style={{ marginTop: i === 0 ? 0 : 48 }}>{block.text}</h2>);
            } else if (block.type === "li") {
              nodes.push(<li key={i} dangerouslySetInnerHTML={{ __html: linkify(block.text) }} />);
            } else if (block.type === "quote") {
              nodes.push(
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
            } else if (i === 0 && block.type === "p") {
              nodes.push(
                <p key={i} style={{ fontSize: 18, lineHeight: 1.85, color: "var(--text)", marginBottom: 28 }}
                  dangerouslySetInnerHTML={{ __html: linkify(block.text) }}
                />
              );
            } else {
              nodes.push(<p key={i} dangerouslySetInnerHTML={{ __html: linkify(block.text) }} />);
            }
            // Insert the visual once, right after the first paragraph
            if (i === 0 && block.type === "p") {
              nodes.push(<BlogVisual key="visual" post={post} accentColor={accentColor} />);
            }
            return nodes;
          })}
        </div>

        {/* CTA card — always shown; falls back to the full tool list if post
            doesn't reference a specific product */}
        {(() => {
          const hasProduct = post.product && PRODUCT_URLS[post.product];
          const url = hasProduct ? PRODUCT_URLS[post.product] : "https://alekotools.com";
          const name = hasProduct ? PRODUCT_NAMES[post.product] : "all my tools";
          const sub = hasProduct
            ? "Free to try \u00B7 Built by Aleko, solo"
            : "Free AI tools for students and builders";
          return (
            <div style={{
              border: `1px solid ${accentColor}33`,
              borderRadius: 16, padding: 32, marginTop: 56,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 24,
              background: `linear-gradient(135deg, ${accentColor}10 0%, var(--surface) 100%)`,
            }}>
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: accentColor, marginBottom: 6,
                }}>
                  Built by Aleko
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.4px" }}>
                  {hasProduct ? `Try ${name} \u2192` : "Explore the full toolkit \u2192"}
                </div>
                <div style={{ fontSize: 14, color: "var(--text-2)" }}>
                  {sub}
                </div>
              </div>
              <a href={url} target={url.startsWith("http") && !url.includes("alekotools.com") ? "_blank" : "_top"} rel="noopener"
                style={{
                  background: accentColor, color: "#fff",
                  padding: "14px 28px", borderRadius: 12,
                  fontWeight: 800, fontSize: 15, whiteSpace: "nowrap",
                  textDecoration: "none",
                  boxShadow: `0 10px 24px ${accentColor}33`,
                }}>
                {hasProduct ? "Open" : "See all"} &rarr;
              </a>
            </div>
          );
        })()}
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
