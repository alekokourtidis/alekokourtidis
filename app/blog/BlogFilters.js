"use client";

import { useState } from "react";
import Link from "next/link";

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// Topic categories based on content, not tools
const TOPIC_MAP = {
  essaycloner: "Writing",
  "essay-cloner": "Writing",
  studyacorn: "Study Tips",
  "ai-shadow-shield": "AI & Work",
  "ai-traffic-guard": "SEO",
  whowasright: "Relationships",
  feastmate: "Health",
  wholefed: "Health",
  bonus: "General",
  informational: "General",
  synthesis: "General",
  comparison: "General",
  reaction: "General",
  experiment: "General",
  personal: "General",
};

export default function BlogFilters({ filters, posts }) {
  const [active, setActive] = useState("all");

  // Build topic-based filters
  const topicSet = new Set();
  posts.forEach(p => {
    const topic = TOPIC_MAP[p.product] || "General";
    topicSet.add(topic);
  });
  const topics = Array.from(topicSet).sort();

  const filtered = active === "all"
    ? posts
    : posts.filter(p => (TOPIC_MAP[p.product] || "General") === active);

  return (
    <>
      <div className="filter-pills">
        <button
          className={`filter-pill ${active === "all" ? "active" : ""}`}
          onClick={() => setActive("all")}
        >
          All
        </button>
        {topics.map(t => (
          <button
            key={t}
            className={`filter-pill ${active === t ? "active" : ""}`}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="blog-grid">
        {filtered.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-grid-card" style={{ borderLeft: `3px solid ${post.color || 'var(--border)'}` }}>
            <div className="blog-card-body">
              <div className="blog-card-meta">
                <span>{formatDate(post.date)}</span>
                <span style={{ color: "var(--text-3)" }}>&middot;</span>
                <span>{post.readingTime} min read</span>
              </div>
              <h2>{post.title}</h2>
              <p className="blog-card-excerpt">{post.excerpt}</p>
              <div className="blog-card-footer">
                <span className="blog-card-read">Read article &rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
