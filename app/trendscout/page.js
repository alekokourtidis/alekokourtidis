import WaitlistForm from "./WaitlistForm";

export const metadata = {
  title: "TrendScout — Daily TikTok trend briefs for solo creators | Aleko Tools",
  description:
    "Every morning at 7am, TrendScout pulls TikTok's Creative Center data, diffs it against last week, and writes you a content brief: hooks to use, sounds to ride, formats to avoid. Built for solo creators who post consistently.",
  alternates: { canonical: "https://alekotools.com/trendscout" },
};

const FEATURES = [
  {
    title: "Weekly batch brief",
    body:
      "Every Sunday at 7am, a full sweep of trending hashtags, sounds, creators, and top ads — then 7–10 specific video concepts with exact hooks and beat-by-beat structure. Shoot them all Sunday, post one a day.",
  },
  {
    title: "Daily change log",
    body:
      "Mon–Sat 7am, a light scan. Only pings you if something moved overnight — a sound blowing up, a hashtag jumping 20 ranks. Silence is good. No noise.",
  },
  {
    title: "Velocity signal",
    body:
      "Trend data means nothing without direction. TrendScout stores daily snapshots and shows you what's rising, what's peaked, what's new this week. You're not reacting to yesterday — you're riding what's climbing.",
  },
  {
    title: "Tailored to your niche",
    body:
      "Picks the industries that match your audience (Tech, Education, Apps, etc.). Filters out trends that won't convert for you. Every brief is written for your brand, not a generic creator.",
  },
  {
    title: "Built on the source",
    body:
      "Pulls directly from TikTok's Creative Center — the same dashboard TikTok shows to paying advertisers. No third-party scrapers, no stale rankings.",
  },
  {
    title: "Telegram delivery",
    body:
      "Briefs ship to Telegram at 7am so they're the first thing you see. No new app to check. No dashboard to log into. Just open your phone, read, film.",
  },
];

const FAQS = [
  {
    q: "Is it safe for my TikTok account?",
    a: "Yes. TrendScout never logs in, never uses your cookies, never identifies as you. It scrapes Creative Center — TikTok's own public trend dashboard. Zero ban risk to your account.",
  },
  {
    q: "Will the ideas actually work?",
    a: "You have to film well. TrendScout tells you what's working right now and gives you the hook + structure. The performance depends on your execution — but you'll never be stuck staring at a blank FYP wondering what to post.",
  },
  {
    q: "What if I don't want daily briefs?",
    a: "Configure it to weekly-only. Many creators batch Sunday and ignore the daily nudges entirely.",
  },
  {
    q: "How is this different from just scrolling TikTok?",
    a: "Scrolling TikTok wastes 30–60 minutes a day and skews your feed toward whatever the algo wants YOU to consume — not what's growing in your niche. TrendScout gives you structural, ranked, niche-filtered data in 3 minutes of reading a morning brief.",
  },
  {
    q: "When is it available?",
    a: "Currently in private beta. Join the waitlist and I'll send a discount code when it opens.",
  },
];

export default function TrendScoutPage() {
  return (
    <div className="container" style={{ paddingTop: 80, paddingBottom: 80, maxWidth: 880 }}>
      <div style={{ marginBottom: 36 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(52, 211, 153, 0.06)",
            fontSize: 12,
            fontWeight: 600,
            color: "#34d399",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#34d399",
              boxShadow: "0 0 10px #34d399",
            }}
          />
          In private beta · waitlist open
        </div>

        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: "-2.5px",
            lineHeight: 1.05,
            marginBottom: 20,
            background: "linear-gradient(to bottom, #fff 30%, #71717a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          A TikTok content strategist who sends you marching orders at 7am.
        </h1>

        <p style={{ fontSize: 19, color: "var(--text-2)", lineHeight: 1.6, maxWidth: 640 }}>
          TrendScout pulls TikTok's Creative Center data every morning, diffs it against last week, and writes you a brief:
          what to film, what sounds to use, what hooks are getting paid to run. Built for creators who post consistently but
          waste 30 minutes a day guessing what's working.
        </p>
      </div>

      <WaitlistForm />

      <section style={{ marginTop: 72 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-3)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          What you get
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                padding: 24,
                borderRadius: 16,
                border: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.3px" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 72 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-3)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Sample brief
        </div>
        <pre
          style={{
            padding: 24,
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "#09090b",
            color: "var(--text-2)",
            fontSize: 13,
            lineHeight: 1.7,
            overflowX: "auto",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            whiteSpace: "pre-wrap",
          }}
        >{`trend-scout · weekly · 2026-04-27

Pattern of the week: POV + tool-reveal is still dominant in AI content.
#zerotohero is up 8 ranks. Sound "Brain Scan" (22k uses, +340% WoW)
is driving most "POV: I replaced my X with AI" videos.

Concept 1 — POV + brain reveal
  Hook (0:00): "POV: I gave AI my entire iMessage history"
  Beat 1: phone scroll of messages flashing by
  Beat 2: cut to Claude output on laptop
  Beat 3: text overlay "It knew me better than I did"
  Sound: "Brain Scan" (see data)
  Tags: #aitools #pov #selfawareness
  Why now: sound ranks 2 (+340%), hashtag #aitools +12 ranks this week

Concept 2 — Solo builder receipts
  Hook (0:00): "I made $30k in a month at 16. Here's why I quit."
  ...

Avoid: generic AI explainers. "What is an AI agent" posts peaked 3 weeks
ago and are now losing ground (#aiagent dropped from rank 4 → rank 22).
`}</pre>
      </section>

      <section style={{ marginTop: 72 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-3)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          FAQ
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((f) => (
            <details
              key={f.q}
              style={{
                padding: "18px 22px",
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              <summary
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {f.q}
                <span style={{ color: "var(--text-3)", marginLeft: 12 }}>+</span>
              </summary>
              <p style={{ marginTop: 12, fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 80 }}>
        <WaitlistForm />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "TrendScout",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "19", priceCurrency: "USD" },
            description: metadata.description,
            url: "https://alekotools.com/trendscout",
            creator: { "@type": "Person", name: "Aleko Kourtidis", url: "https://alekotools.com/about" },
          }),
        }}
      />
    </div>
  );
}
