"use client";

import { useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="email-capture">
        <div className="email-success">You're in! We'll notify you when new tools drop.</div>
      </div>
    );
  }

  return (
    <div className="email-capture">
      <p className="email-label">Stay in the loop</p>
      <p className="email-sublabel">Get notified when new tools launch. No spam, just builds.</p>
      <form onSubmit={handleSubmit} className="email-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="email-input"
          required
        />
        <button type="submit" className="email-btn" disabled={status === "loading"}>
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && <p className="email-error">Something went wrong. Try again.</p>}
      <p className="email-note">Join other students and builders. Unsubscribe anytime.</p>
    </div>
  );
}
