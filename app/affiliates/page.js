"use client";

import { useState } from "react";
import Link from "next/link";

const TOOLS = [
  { id: "essaycloner", name: "EssayCloner", cut: "40%", desc: "AI essays in your voice", color: "#7c3aed" },
  { id: "ai-shadow-shield", name: "AI Shadow Shield", cut: "30%", desc: "Detect AI employee cloning", color: "#10b981" },
  { id: "ai-traffic-guard", name: "AI Traffic Guard", cut: "30%", desc: "Track keyword theft by AI Overviews", color: "#f59e0b" },
  { id: "feastmate", name: "Feastmate", cut: "30%", desc: "AI recipe generator (iOS)", color: "#f59e0b" },
  { id: "wholefed", name: "Wholefed", cut: "30%", desc: "AI food health scanner (iOS)", color: "#dc2626" },
  { id: "studyacorn", name: "Study Acorn", cut: "40%", desc: "AP/SAT adaptive study guide", color: "#16a34a" },
];

export default function AffiliatesPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [selectedTool, setSelectedTool] = useState("any");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !handle.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          handle: handle.trim(),
          platform,
          preferred_tool: selectedTool,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sign up");
      setResult(data);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-block", padding: "4px 14px", borderRadius: 999,
            background: "var(--accent-subtle)", fontSize: 12, fontWeight: 600,
            color: "var(--text-secondary)", letterSpacing: ".03em", marginBottom: 16,
            textTransform: "uppercase",
          }}>
            Affiliate Program
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.1 }}>
            Promote AI tools.<br />Earn up to 40%.
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 14, lineHeight: 1.6 }}>
            Share any Aleko Tools product with your audience. You get a unique link + promo code.
            Every paying customer you refer earns you recurring commission — for as long as they stay subscribed.
          </p>
        </div>

        {/* How it works */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 48,
        }}>
          {[
            { step: "1", title: "Sign up", desc: "Fill out the form below. Takes 30 seconds." },
            { step: "2", title: "Share", desc: "Post your link or promo code on TikTok, IG, YouTube, anywhere." },
            { step: "3", title: "Earn", desc: "Get paid monthly via PayPal. 30-40% of every sale you refer." },
          ].map((s) => (
            <div key={s.step} style={{
              padding: 20, background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--r)", textAlign: "center",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 999, background: "var(--accent)",
                color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, marginBottom: 10,
              }}>
                {s.step}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Tools grid */}
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, letterSpacing: "-.02em" }}>
          Tools you can promote
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 48 }}>
          {TOOLS.map((t) => (
            <div key={t.id} style={{
              padding: "14px 16px", background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--r)", display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: t.color,
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, flexShrink: 0,
              }}>
                {t.name[0]}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {t.desc} · <span style={{ color: t.color, fontWeight: 600 }}>{t.cut} commission</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Signup form */}
        {status === "success" ? (
          <div style={{
            padding: 32, background: "var(--surface)", border: "2px solid var(--green)",
            borderRadius: "var(--r)", textAlign: "center",
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>You&apos;re in!</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
              Here&apos;s your affiliate info:
            </p>
            <div style={{
              background: "var(--surface2)", borderRadius: "var(--r-sm)", padding: 16,
              textAlign: "left", fontSize: 13, lineHeight: 2,
            }}>
              <div><strong>Promo code:</strong> <code style={{ background: "#e0e7ff", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>{result?.code}</code></div>
              <div><strong>Referral link:</strong> <code style={{ fontSize: 11, wordBreak: "break-all" }}>{result?.link}</code></div>
            </div>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 14 }}>
              Share your code or link anywhere. We&apos;ll email you at {email} with monthly earnings reports.
            </p>
          </div>
        ) : (
          <div style={{
            padding: 32, background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--r)",
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, letterSpacing: "-.02em" }}>
              Join the program
            </h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Name</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  placeholder="Your name"
                  style={{
                    width: "100%", padding: "10px 12px", border: "1px solid var(--border)",
                    borderRadius: "var(--r-sm)", fontSize: 14, background: "var(--bg)",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="you@email.com"
                  style={{
                    width: "100%", padding: "10px 12px", border: "1px solid var(--border)",
                    borderRadius: "var(--r-sm)", fontSize: 14, background: "var(--bg)",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Platform</label>
                  <select
                    value={platform} onChange={(e) => setPlatform(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px", border: "1px solid var(--border)",
                      borderRadius: "var(--r-sm)", fontSize: 14, background: "var(--bg)",
                    }}
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">X / Twitter</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Handle / username</label>
                  <input
                    type="text" value={handle} onChange={(e) => setHandle(e.target.value)} required
                    placeholder="@yourhandle"
                    style={{
                      width: "100%", padding: "10px 12px", border: "1px solid var(--border)",
                      borderRadius: "var(--r-sm)", fontSize: 14, background: "var(--bg)",
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Which tool do you want to promote?</label>
                <select
                  value={selectedTool} onChange={(e) => setSelectedTool(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", border: "1px solid var(--border)",
                    borderRadius: "var(--r-sm)", fontSize: 14, background: "var(--bg)",
                  }}
                >
                  <option value="any">All tools / no preference</option>
                  {TOOLS.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.cut})</option>
                  ))}
                </select>
              </div>
              <button
                type="submit" disabled={status === "loading"}
                style={{
                  width: "100%", padding: 12, background: "var(--accent)", color: "#fff",
                  border: "none", borderRadius: "var(--r-sm)", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", opacity: status === "loading" ? 0.6 : 1,
                  marginTop: 6,
                }}
              >
                {status === "loading" ? "Signing up..." : "Get my affiliate code"}
              </button>
              {status === "error" && (
                <p style={{ fontSize: 12, color: "var(--red)" }}>{errorMsg}</p>
              )}
            </form>
          </div>
        )}

        <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
          Commissions are paid monthly via PayPal. Minimum payout: $10. Cookies last 30 days.
          <br />Questions? Email <a href="mailto:alekokourtidis@gmail.com" style={{ color: "var(--text-secondary)" }}>alekokourtidis@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
