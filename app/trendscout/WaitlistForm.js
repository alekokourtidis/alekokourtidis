"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done | error

  async function submit(e) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "trendscout" }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div
        style={{
          padding: 28,
          borderRadius: 16,
          border: "1px solid rgba(52,211,153,0.25)",
          background: "rgba(52,211,153,0.06)",
          color: "#34d399",
          fontSize: 15,
          fontWeight: 500,
          lineHeight: 1.6,
        }}
      >
        On the list. When TrendScout opens I'll send you a discount code first.
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        padding: 28,
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      <div style={{ flex: "1 1 280px" }}>
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-3)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Join the waitlist
        </label>
        <input
          type="email"
          required
          placeholder="you@creator.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "loading"}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "1px solid var(--border)",
            borderRadius: 10,
            fontSize: 15,
            background: "var(--bg)",
            color: "var(--text)",
            outline: "none",
          }}
        />
      </div>
      <button
        type="submit"
        disabled={state === "loading"}
        style={{
          padding: "12px 22px",
          background: "var(--text)",
          color: "var(--bg)",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 700,
          alignSelf: "flex-end",
          minHeight: 44,
          cursor: state === "loading" ? "default" : "pointer",
          opacity: state === "loading" ? 0.6 : 1,
        }}
      >
        {state === "loading" ? "Adding…" : "Get early access"}
      </button>
      {state === "error" && (
        <div style={{ flex: "1 1 100%", fontSize: 12, color: "#ef4444" }}>
          Something went wrong — try again?
        </div>
      )}
    </form>
  );
}
