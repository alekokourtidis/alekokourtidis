import WaitlistForm from "./WaitlistForm";

export const metadata = {
  title: "TrendScout — Daily AI news briefs, rewritten as video hooks | Aleko Tools",
  description:
    "Every morning at 7am, TrendScout reads Reddit, Hacker News, and AI/tech RSS, picks the stories that actually popped overnight, and rewrites them as TikTok video hooks you can film. Like an @aibreakfast / @morning.brew editor — for your feed.",
  alternates: { canonical: "https://alekotools.com/trendscout" },
};

const FEATURES = [
  {
    title: "Real news, not hashtags",
    body:
      "TrendScout reads Reddit's top AI/builder subs, Hacker News front page, ProductHunt launches, and AI/tech RSS feeds every morning. It picks the stories with real signal — 1,000+ upvotes, 300+ HN points, reacting to actual launches — not hashtags with no relevance.",
  },
  {
    title: "Rewritten as video hooks",
    body:
      "Every story comes back as a TikTok-ready concept: exact on-screen text for the first 2 seconds, 3-beat shot structure, and a 1-line reason why the story hits right now. Like an @aibreakfast editor wrote your shot list.",
  },
  {
    title: "Weekly batch brief",
    body:
      "Every Sunday 7am: 7 story-driven video concepts pulled from the week's biggest AI/builder news. Shoot them all Sunday, post one per day Mon-Sun. Your entire week's content solved in a 20-minute session.",
  },
  {
    title: "Daily news nudge",
    body:
      "Mon–Sat 7am: a quick scan. If a big story broke overnight (new GPT release, a founder's thread going viral), you get a reactive concept. Otherwise, silence. No noise for the sake of it.",
  },
  {
    title: "Niche-filtered by default",
    body:
      "Only pulls from subs/feeds where AI builders, solo founders, and tech-curious students actually hang out. No generic pop culture. No crypto. No politics. Just the stuff your audience is already talking about.",
  },
  {
    title: "Telegram delivery",
    body:
      "Briefs ship to Telegram at 7am — the first thing you see when you wake up. No dashboard, no new app, no login. Open your phone, read, film, post.",
  },
];

const FAQS = [
  {
    q: "Why news instead of TikTok trends?",
    a: "Trending hashtags and sounds are lagging indicators — by the time they're trending, they've peaked. Real content creators in AI/tech ride NEWS: a GPT release, a founder's tweet going viral, an open-source project hitting 20k stars overnight. TrendScout surfaces the news the day it happens so you're the first to post a take.",
  },
  {
    q: "Is it safe for my social accounts?",
    a: "100% safe. TrendScout never logs into any platform, never uses your cookies. It reads public sources — Reddit's JSON API, HN's Firebase API, public RSS feeds. Nothing touches your accounts.",
  },
  {
    q: "Will the ideas actually work?",
    a: "Execution still matters — you have to film well. But you won't waste 30 minutes staring at your FYP wondering what to post. Every brief names the exact story, the hook line, the 3 shots, and why it hits right now.",
  },
  {
    q: "What if I post in a different niche?",
    a: "v1 is tuned for AI + solo-builder + tech-curious-student creators. If you want a different niche (fitness, finance, fashion) I'll build that version if the waitlist shows demand.",
  },
  {
    q: "How is this different from just scrolling Reddit?",
    a: "Scrolling Reddit takes 45 min and leaves you overwhelmed. TrendScout does 3 minutes of reading in 20 seconds: top stories, ranked, with the exact hook line already written. You go from news → video in 10 minutes instead of 2 hours.",
  },
  {
    q: "When is it available?",
    a: "Currently in private beta. Join the waitlist — I'll send a discount code when it opens.",
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
          The AI news that&apos;s about to blow up — rewritten as your next TikTok hook.
        </h1>

        <p style={{ fontSize: 19, color: "var(--text-2)", lineHeight: 1.6, maxWidth: 640 }}>
          Every morning at 7am, TrendScout reads Reddit&apos;s top AI subs, Hacker News, ProductHunt, and the best AI/tech
          RSS feeds — picks the stories that actually popped overnight, and turns them into video concepts you can film today.
          Built like @aibreakfast / @morning.brew, but for creators who post short-form instead of carousels.
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
        >{`trend-scout · daily · 2026-04-23
reddit 102 · hn 13 · rss 8

Story 1 — GPT-5.5 launched this morning
  Source: Hacker News, 762 pts, 3h ago
  Hook (0:00): "OpenAI just dropped GPT-5.5 and nobody's talking about
              the weirdest feature"
  Beat 1: screen-rec of the model card, zoom on context window stat
  Beat 2: your face reacting, text overlay with the one crazy number
  Beat 3: "if you were still paying for ChatGPT Plus, here's what
          actually changed"
  Why now: front-page HN, TechCrunch broke it 30 min ago

Story 2 — r/ChatGPT hit 5,058 upvotes on "Yahu by gpt"
  Source: Reddit, 5058 ups, 6h ago
  Hook (0:00): "This 8-word ChatGPT prompt has 5,000 upvotes and
              nobody can explain why"
  Beat 1: screen of the actual post
  Beat 2: you trying it live
  Beat 3: result text overlaid
  Why now: pure curiosity gap, community-validated hook

Story 3 — Anthropic's Mythos breach
  ...

Also worth mentioning:
  · Qwen3.6-27B hit 938 HN pts — good for a "small models keep winning" tweet
  · r/ClaudeAI viral thread about dev autonomy — thread-able
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
