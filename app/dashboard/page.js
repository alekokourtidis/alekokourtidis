"use client";

import { useState, useEffect } from "react";

const SUPABASE_URL = "https://fdnbotpgodpcgqtojnrm.supabase.co";
const SUPABASE_KEY = "sb_publishable_EXP_ArZJG1-dDSY240-ZdQ_91x4KdbQ";

const STATUS_COLORS = {
  deployed: "#16a34a",
  generated: "#f59e0b",
  queued: "#3b82f6",
  archived: "#a1a1aa",
  failed: "#dc2626",
};

const STATUS_EMOJI = {
  deployed: "🟢",
  generated: "🟡",
  queued: "🔵",
  archived: "⚫",
  failed: "🔴",
};

export default function Dashboard() {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [explaining, setExplaining] = useState(null);
  const [explanation, setExplanation] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("dash_auth") === "1") {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchBuilds();
    const interval = setInterval(fetchBuilds, 30000);
    return () => clearInterval(interval);
  }, [authed]);

  async function fetchBuilds() {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/built_projects?order=created_at.desc&limit=20&select=id,project_name,status,created_at,eli17,tagline,price,target_audience,deploy_url,preview_url,problem_summary`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      const data = await res.json();
      if (Array.isArray(data)) setBuilds(data);
    } catch {}
    setLoading(false);
  }

  async function explainBuild(build) {
    if (explanation[build.id]) {
      setExpandedId(expandedId === build.id ? null : build.id);
      return;
    }
    setExplaining(build.id);
    setExpandedId(build.id);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: build.project_name,
          eli17: build.eli17,
          tagline: build.tagline,
          price: build.price,
          target_audience: build.target_audience,
          problem_summary: build.problem_summary,
        }),
      });
      const data = await res.json();
      setExplanation(prev => ({ ...prev, [build.id]: data.explanation }));
    } catch {
      setExplanation(prev => ({ ...prev, [build.id]: "Failed to generate explanation." }));
    }
    setExplaining(null);
  }

  if (!authed) {
    return (
      <div style={styles.loginWrap}>
        <div style={styles.loginCard}>
          <h2 style={styles.loginTitle}>Dashboard</h2>
          <p style={styles.loginSub}>Enter PIN to access</p>
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && pin === "4848") {
                localStorage.setItem("dash_auth", "1");
                setAuthed(true);
              }
            }}
            placeholder="PIN"
            style={styles.pinInput}
            autoFocus
          />
          <button
            onClick={() => {
              if (pin === "4848") {
                localStorage.setItem("dash_auth", "1");
                setAuthed(true);
              }
            }}
            style={styles.pinBtn}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  const counts = {};
  builds.forEach(b => { counts[b.status] = (counts[b.status] || 0) + 1; });

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.h1}>Command Center</h1>
        <div style={styles.stats}>
          {Object.entries(counts).map(([status, count]) => (
            <span key={status} style={styles.stat}>
              {STATUS_EMOJI[status] || "⚪"} {status}: {count}
            </span>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading builds...</div>
      ) : (
        <div style={styles.buildList}>
          {builds.map(build => (
            <div key={build.id} style={styles.buildCard}>
              <div style={styles.buildHeader}>
                <div>
                  <div style={styles.buildName}>{build.project_name}</div>
                  <div style={styles.buildMeta}>
                    <span style={{ color: STATUS_COLORS[build.status] || "#999", fontWeight: 600 }}>
                      {build.status}
                    </span>
                    {" · "}
                    {new Date(build.created_at).toLocaleDateString()}
                    {build.price && ` · ${build.price}`}
                  </div>
                </div>
                <div style={styles.buildActions}>
                  <button onClick={() => explainBuild(build)} style={styles.explainBtn}>
                    {explaining === build.id ? "..." : "Explain"}
                  </button>
                  {(build.deploy_url || build.preview_url) && (
                    <a
                      href={build.deploy_url || build.preview_url}
                      target="_blank"
                      rel="noopener"
                      style={styles.viewBtn}
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
              <div style={styles.buildTagline}>
                {build.eli17 || build.tagline || "No description"}
              </div>
              {expandedId === build.id && explanation[build.id] && (
                <div style={styles.explainBox}>
                  {explanation[build.id]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 600, margin: "0 auto", padding: "20px 16px 80px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif",
  },
  header: { marginBottom: 24 },
  h1: { fontSize: 22, fontWeight: 700, letterSpacing: "-.02em", margin: "0 0 8px" },
  stats: { display: "flex", flexWrap: "wrap", gap: 12 },
  stat: { fontSize: 13, color: "#555" },
  loading: { textAlign: "center", color: "#999", padding: 40, fontSize: 14 },
  buildList: { display: "flex", flexDirection: "column", gap: 12 },
  buildCard: {
    background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12,
    padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,.04)",
  },
  buildHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  buildName: { fontSize: 15, fontWeight: 600, letterSpacing: "-.01em" },
  buildMeta: { fontSize: 12, color: "#777", marginTop: 2 },
  buildTagline: { fontSize: 13, color: "#444", marginTop: 8, lineHeight: 1.5 },
  buildActions: { display: "flex", gap: 6, flexShrink: 0 },
  explainBtn: {
    background: "#f5f5f5", border: "1px solid #e5e5e5", borderRadius: 8,
    padding: "6px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer",
  },
  viewBtn: {
    background: "#171717", color: "#fff", borderRadius: 8,
    padding: "6px 12px", fontSize: 12, fontWeight: 500, textDecoration: "none",
  },
  explainBox: {
    marginTop: 12, padding: 14, background: "#fafafa", border: "1px solid #e5e5e5",
    borderRadius: 10, fontSize: 13, lineHeight: 1.6, color: "#333",
  },
  loginWrap: {
    display: "flex", justifyContent: "center", alignItems: "center",
    minHeight: "60vh", padding: 20,
  },
  loginCard: { textAlign: "center", maxWidth: 280 },
  loginTitle: { fontSize: 20, fontWeight: 700, margin: "0 0 4px" },
  loginSub: { fontSize: 13, color: "#999", margin: "0 0 20px" },
  pinInput: {
    width: "100%", padding: "12px 14px", border: "1px solid #e5e5e5",
    borderRadius: 10, fontSize: 16, textAlign: "center", marginBottom: 10,
  },
  pinBtn: {
    width: "100%", padding: 12, background: "#171717", color: "#fff",
    border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
  },
};
