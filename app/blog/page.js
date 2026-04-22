import Link from "next/link";
import { getAllPosts } from "../../lib/blog-posts";

export const metadata = {
  title: "Blog — Aleko Tools",
  description: "Build logs, postmortems, and writing from Aleko Kourtidis.",
};

const CAT_BY_PRODUCT = {
  "who-meal-planner": "Health",
  feastmate: "Health",
  wholefed: "Health",
  essaycloner: "Education",
  studypebble: "Education",
  "study-acorn": "Education",
  "ai-shadow-shield": "Security",
  "ai-traffic-guard": "SEO",
  shadowshield: "Security",
  trafficguard: "SEO",
  whowasright: "Relationships",
  autoeditor: "Build Log",
  flowdebug: "Build Log",
  alekotools: "Thinking",
};
const ACCENT_BY_CAT = {
  Health: "#22c55e",
  Education: "#fbbf24",
  Security: "#ef4444",
  SEO: "#a78bfa",
  Relationships: "#60a5fa",
  "Build Log": "#22d3ee",
  Thinking: "#f472b6",
  Writing: "#a78bfa",
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function readMinutes(content) {
  const words = (content || "").trim().split(/\s+/).length;
  return `${Math.max(2, Math.round(words / 220))} min`;
}

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main style={{ background: "#0b0b0f", color: "#e6e6ea", minHeight: "100vh", padding: "24px 16px 64px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <Link href="/" style={{ color: "#9aa", fontSize: 14, textDecoration: "none" }}>← Aleko Tools</Link>
        </div>

        <header style={{ marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: 1.2, color: "#9aa", marginBottom: 12, textTransform: "uppercase" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
            Synthesis Notes
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 700, margin: 0, lineHeight: 1.1, letterSpacing: -0.5 }}>The Brief.</h1>
          <p style={{ color: "#9aa", fontSize: 16, marginTop: 12, maxWidth: 600 }}>
            Research notes, explainers, and pattern spotting across the categories the tools in this directory touch. Not personal essays — editorial voice. {posts.length} briefs.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.map((p) => {
            const cat = CAT_BY_PRODUCT[p.product] || "Writing";
            const accent = ACCENT_BY_CAT[cat] || "#a78bfa";
            return (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                style={{
                  display: "block",
                  padding: "18px 18px",
                  borderRadius: 14,
                  border: "1px solid #1c1c22",
                  background: "#111116",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "border-color 0.15s, background 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 11, letterSpacing: 0.5 }}>
                  <span style={{
                    color: accent,
                    background: `${accent}14`,
                    border: `1px solid ${accent}33`,
                    padding: "2px 8px",
                    borderRadius: 999,
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}>
                    {cat}
                  </span>
                  <span style={{ color: "#666" }}>{formatDate(p.date)}</span>
                  <span style={{ color: "#666" }}>·</span>
                  <span style={{ color: "#666" }}>{readMinutes(p.content)}</span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0, lineHeight: 1.3, letterSpacing: -0.2 }}>{p.title}</h2>
                {p.excerpt && (
                  <p style={{ color: "#9aa", fontSize: 14, marginTop: 8, marginBottom: 0, lineHeight: 1.5 }}>
                    {p.excerpt}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
