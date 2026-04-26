const { useState, useEffect } = React;

function DaysSince({ from }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const target = Math.floor((new Date() - new Date(from)) / 86400000);
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const iv = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(iv); }
      setN(cur);
    }, 30);
    return () => clearInterval(iv);
  }, [from]);
  return <>{n.toLocaleString()}</>;
}

// Live tools-shipped count, sourced from tool_library to match the
// homepage ShippingDashboard. Falls back to a sensible default if the
// fetch fails (e.g. offline preview), then count-ups to the live value.
function LiveToolsShipped({ fallback = 34 }) {
  const [target, setTarget] = useState(fallback);
  useEffect(() => {
    const SB_URL = 'https://fdnbotpgodpcgqtojnrm.supabase.co';
    const SB_KEY = 'sb_publishable_EXP_ArZJG1-dDSY240-ZdQ_91x4KdbQ';
    fetch(SB_URL + '/rest/v1/tool_library?select=slug&visible=eq.true', {
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY },
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setTarget(data.length); })
      .catch(() => {});
  }, []);
  return <CountUp to={target} />;
}

function CountUp({ to, suffix = '', duration = 1400 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{n.toLocaleString()}{suffix}</>;
}

function AboutPage() {
  const stack = [
    { name: 'Claude Code', use: 'The pair I could never afford otherwise. Writes with me, not for me.' },
    { name: 'Next.js', use: 'Framework I never have to think about. App router, server actions, done.' },
    { name: 'Supabase', use: 'Auth, database, storage. Replaces three services and a weekend of yak shaving.' },
    { name: 'Vercel', use: 'Git push, hit the preview, hit the domain. The boring choice that always wins.' },
    { name: 'Stripe', use: 'Checkout links and customer portal. I have never built a billing UI.' },
  ];

  return (
    <>
      <SharedNav current="about" />

      {/* HERO */}
      <section className="about-hero about-hero-lux">
        <div className="about-hero-aurora" aria-hidden>
          <span className="about-aurora-a" />
          <span className="about-aurora-b" />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div>
            <div className="about-eyebrow">
              <span className="pulse-green" />
              <span>ABOUT</span>
            </div>
          </div>
          <div>
            <h1 className="about-hero-title">
              One person. No team.<br/><em>No funding.</em>
            </h1>
          </div>
          <div>
            <p className="about-hero-sub">
              I'm Aleko. I'm 17. I build small AI tools from my bedroom and people pay me for them. I shipped my first one a couple weeks ago. I'm shipping a new one every day.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section about-stats-section">
        <div className="container">
          <div>
            <div className="about-stats">
              <div className="about-stat">
                <div className="about-stat-num"><LiveToolsShipped /></div>
                <div className="about-stat-label">Tools Shipped</div>
                <div className="about-stat-sub">Live count · matches /tools</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num"><DaysSince from="2026-04-11" /></div>
                <div className="about-stat-label">Days Building</div>
                <div className="about-stat-sub">Since First Launch</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num"><CountUp to={199810} /></div>
                <div className="about-stat-label">Lines Of Code</div>
                <div className="about-stat-sub">Across All Tools</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num"><CountUp to={1184} /></div>
                <div className="about-stat-label">Monthly Visitors</div>
                <div className="about-stat-sub">Across The Stack</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT I USE */}
      <section className="section about-stack-section">
        <div className="container">
          <div>
            <div className="section-label">What I Use</div>
            <h2 className="section-title">The Five Things I Actually Open Every Day.</h2>
            <p className="section-desc">
              Nothing fancy. I'd rather know five tools deeply than twenty tools shallowly.
            </p>
          </div>

          <div className="about-stack">
            {stack.map((s, i) => (
              <div key={s.name} className="about-stack-row">
                <span className="about-stack-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="about-stack-name">{s.name}</span>
                <span className="about-stack-use">{s.use}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section about-story-section">
        <div className="container">
          <div className="about-story-grid">
            <div>
              <div className="section-label">The Story</div>
              <h2 className="section-title">How I Got Here.</h2>
            </div>
            <div>
              <div className="about-story-body">
                <p>
                  I started an online clothing brand at 14. It got to $30k a month by the time I was 16. I learned more from running that than I ever learned in a classroom. Inventory, shipping, refunds, ads, taste. Mostly taste.
                </p>
                <p>
                  Then AI happened. Suddenly the cost of making software went to almost zero. You could have an idea at 11pm and a working app by 2am. I shut down the clothing brand last month. It was still making money. I didn't care. The tools side is where everything interesting is happening right now and I want to be in the middle of it.
                </p>
                <p>
                  I work alone, from my bedroom, usually between 9pm and 3am. Claude Code is my pair. I don't have a cofounder. I don't want funding. I don't want a team. I want to keep shipping things people want and see how far one person can push it before something breaks.
                </p>
                <p className="about-story-quiet">
                  I'm 17. I'm still figuring a lot of this out. Some of the tools I ship are going to flop. That's fine. I'd rather ship seven things this month and have three of them work than spend six months polishing one thing nobody asked for.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES — small unique touch */}
      <section className="section about-principles-section">
        <div className="container">
          <div>
            <div className="section-label">Principles</div>
            <h2 className="section-title">Four Rules I Made For Myself.</h2>
          </div>
          <div className="about-principles">
            {[
              { n: 'I', t: 'Ship Before Midnight.', d: 'If a tool can\'t be live in a day, the idea is too big. Cut it down until it can.', accent: '#fbbf24' },
              { n: 'II', t: 'Solve My Own Problem First.', d: 'Every tool I\'ve shipped that worked started with something I was annoyed about. Nothing imagined.', accent: '#60a5fa' },
              { n: 'III', t: 'Tiny Prices, Not Free.', d: 'Free users are noisy. $2/mo users tell you exactly what they need and what they don\'t.', accent: '#22c55e' },
              { n: 'IV', t: 'Boring Stack, Interesting Problems.', d: 'I never want to spend a day debugging infrastructure. I want to spend it on the actual idea.', accent: '#a78bfa' },
            ].map((p, i) => (
              <div key={p.n}>
                <CardGlow className="about-principle" accent={p.accent}>
                  <span className="about-principle-glow" />
                  <div className="about-principle-num">{p.n}</div>
                  <div className="about-principle-title">{p.t}</div>
                  <div className="about-principle-desc">{p.d}</div>
                </CardGlow>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL / CONTACT */}
      <section className="section about-contact-section">
        <div className="container">
          <div>
            <div className="about-contact">
              <div>
                <h2 className="section-title" style={{ marginBottom: 10 }}>Find Me Elsewhere.</h2>
                <p className="section-desc" style={{ margin: 0 }}>I'm most active on TikTok. Email goes to my actual inbox.</p>
              </div>
              <div className="about-contact-links">
                <CardGlow className="about-contact-link" accent="#ef4444">
                  <span className="about-contact-glow" />
                  <span className="about-contact-handle">@aleko</span>
                  <span className="about-contact-platform">TikTok</span>
                </CardGlow>
                <CardGlow className="about-contact-link" accent="#f472b6">
                  <span className="about-contact-glow" />
                  <span className="about-contact-handle">@aleko.tools</span>
                  <span className="about-contact-platform">Instagram</span>
                </CardGlow>
                <CardGlow className="about-contact-link" accent="#a78bfa">
                  <span className="about-contact-glow" />
                  <span className="about-contact-handle">github.com/aleko</span>
                  <span className="about-contact-platform">GitHub</span>
                </CardGlow>
                <CardGlow className="about-contact-link" accent="#22c55e">
                  <span className="about-contact-glow" />
                  <span className="about-contact-handle">hi@alekotools.com</span>
                  <span className="about-contact-platform">Email</span>
                </CardGlow>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AboutPage />);
