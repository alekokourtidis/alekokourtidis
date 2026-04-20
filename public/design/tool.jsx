const { useState } = React;

/* This template reads ?id=<toolId> from the URL to pick which tool to render.
   Falls back to EssayCloner if no id given. */

const TOOLS = {
  essaycloner: {
    name: 'EssayCloner', tagline: 'Writes new essays in your actual voice from three samples.',
    price: '$1.99 / Month', freePrice: 'Free', accent: '#a78bfa',
    Demo: window.EssayClonerDemo,
    how: [
      { n: '01', t: 'Paste Three Essays', d: 'Drop in anything you\'ve written — school papers, personal essays, blog posts. Three is the sweet spot.' },
      { n: '02', t: 'It Learns Your Voice', d: 'In about twelve seconds, it builds a style profile. Sentence length, word choices, the stuff that makes you sound like you.' },
      { n: '03', t: 'Draft Anything', d: 'Give it a topic. Get back a full draft that reads like you wrote it at 2am, not a chatbot.' },
    ],
    testimonials: [
      { q: 'Turned in an EssayCloner draft and my English teacher said it was my best work all semester. Felt weird but also not really.', by: '— High school junior, Chicago' },
      { q: 'I use this for cold outreach. The replies I get sound like a real person wrote them because one did. Kind of.', by: '— Founder, solo SaaS' },
      { q: 'I write 30 newsletters a week for clients. This cut my drafting time in half.', by: '— Ghostwriter, LA' },
    ],
  },
  studypebble: {
    name: 'Study Pebble', tagline: 'Adaptive AP and SAT prep that adjusts to the stuff you actually keep missing.',
    price: '$14.99 / Month', freePrice: 'First Week Free', accent: '#fbbf24',
    Demo: window.StudyPebbleDemo,
    how: [
      { n: '01', t: 'Take A Diagnostic', d: 'Fifteen minutes. It figures out where your gaps actually are, not just what\'s on the course outline.' },
      { n: '02', t: 'Get A Live Plan', d: 'A plan that changes every day based on what you got wrong yesterday. No more generic "review unit 4" nonsense.' },
      { n: '03', t: 'Write Free Response', d: 'Your FRQs get scored against the real College Board rubric, not vibes. You see exactly where the points went.' },
    ],
    testimonials: [
      { q: 'Went from a 3 on the practice APUSH to a 5 on the real thing. This plus some cram sessions.', by: '— Senior, Dallas' },
      { q: 'SAT went 1280 to 1440 in six weeks. The diagnostic caught stuff I didn\'t know I was weak on.', by: '— Junior, Boston' },
      { q: 'The FRQ scorer is the thing. I never understood what graders actually wanted until this.', by: '— AP Lit student, Seattle' },
    ],
  },
  shadowshield: {
    name: 'AI Shadow Shield', tagline: 'Tells you if the apps you use at work are feeding what you write into a model.',
    price: '$19 / Month', freePrice: 'Free Scan', accent: '#ef4444',
    Demo: window.ShadowShieldDemo,
    how: [
      { n: '01', t: 'Connect Your Accounts', d: 'Read-only access to the tools you use — Slack, Notion, Gmail, the usual. Nothing gets written, nothing leaves.' },
      { n: '02', t: 'Get A Risk Map', d: 'A dashboard showing every tool, what data it can access, and whether it\'s training on your stuff by default.' },
      { n: '03', t: 'Lock It Down', d: 'Opt-out flows for every tool in one click. We keep watching and alert you if anything changes.' },
    ],
    testimonials: [
      { q: 'Found out three of my tools were feeding everything I wrote into training data. Fixed in ten minutes.', by: '— PM, B2B SaaS' },
      { q: 'My legal team made this mandatory for the whole org. First time they agreed with me on tooling.', by: '— Engineering Lead, healthcare' },
      { q: 'The drift alerts caught a silent ToS change I would have missed. Worth it for that alone.', by: '— Solo founder' },
    ],
  },
  trafficguard: {
    name: 'AI Traffic Guard', tagline: 'Watches your top keywords and flags the ones Google AI Overviews are eating.',
    price: '$29 / Month', freePrice: '5 Keywords Free', accent: '#60a5fa',
    Demo: window.TrafficGuardDemo,
    how: [
      { n: '01', t: 'Plug In Keywords', d: 'Import from Search Console or paste your top traffic drivers. We track the top 50 by default.' },
      { n: '02', t: 'We Monitor Daily', d: 'We check which queries now show an AI Overview, how prominently, and whether your page is cited in it.' },
      { n: '03', t: 'Get Rewrite Nudges', d: 'For pages losing clicks to AI, we suggest the exact structural changes to become the cited source instead of the page under the fold.' },
    ],
    testimonials: [
      { q: 'Caught a 40% drop on our comparison pages before it showed up anywhere else. Rewrote, won back traffic.', by: '— Head of content, SaaS' },
      { q: 'We stopped writing long-form comparison content because of what this showed us. Saved us from making worse decisions.', by: '— SEO lead, agency' },
      { q: 'The citation tracker is the feature. Knowing which AI Overview cited you changes everything.', by: '— Founder, newsletter' },
    ],
  },
  wholefed: {
    name: 'Wholefed', tagline: 'Snap a photo of your meal. Get a real read on what you\'re about to eat.',
    price: 'Free', freePrice: 'Free', accent: '#22c55e',
    Demo: window.WholefedDemo,
    how: [
      { n: '01', t: 'Snap A Photo', d: 'Before you eat. Ingredients, a plated dish, a menu, a label — anything readable works.' },
      { n: '02', t: 'Get A Real Read', d: 'Not a calorie number. An honest take on whether this is a good fit for your body and your goals today.' },
      { n: '03', t: 'Flag What Matters', d: 'If you have celiac, keto goals, allergies, whatever — it catches the stuff you actually need to catch.' },
    ],
    testimonials: [
      { q: 'I have celiac. This is the first food app that didn\'t treat me like a macro robot. It just tells me if it\'s safe.', by: '— User, San Francisco' },
      { q: 'My kid has peanut allergies. I scan every menu before ordering now. It has saved me from two bad nights.', by: '— Parent, Austin' },
      { q: 'I stopped tracking macros and just started scanning. Lost eight pounds without thinking about it.', by: '— User, NYC' },
    ],
  },
  feastmate: {
    name: 'Feastmate', tagline: 'Plug in macro targets. Get a real recipe that hits them — no math, no vague suggestions.',
    price: '$4.99 / Month', freePrice: 'First Recipe Free', accent: '#f472b6',
    Demo: window.FeastmateDemo,
    how: [
      { n: '01', t: 'Set Your Macros', d: 'Protein, carbs, fat, calories. One time setup. Or sync from any tracker you already use.' },
      { n: '02', t: 'Pick A Vibe', d: 'Cuisine, effort level, what\'s in your fridge, how fast you need it. Four sliders, takes six seconds.' },
      { n: '03', t: 'Cook It', d: 'A real recipe with ingredients, quantities, and step-by-step that actually hits your targets within 2%.' },
    ],
    testimonials: [
      { q: 'Finally stopped eating the same four meals. This gives me something new that still fits my cut.', by: '— Gym, Houston' },
      { q: 'Bulk season and I have zero time. This is dinner, five nights a week, no thinking.', by: '— College athlete' },
      { q: 'Plugged in vegan + 160g protein and it actually worked. Most tools choke on this.', by: '— Plant-based lifter' },
    ],
  },
};

function ToolPage() {
  const params = new URLSearchParams(window.location.search);
  const id = (params.get('id') || 'essaycloner').toLowerCase();
  const tool = TOOLS[id] || TOOLS.essaycloner;
  const Demo = tool.Demo || (() => <div style={{ color: '#71717a' }}>Demo coming soon</div>);

  return (
    <>
      <SharedNav current="tools" />

      {/* TOP BAR */}
      <section className="tool-topbar">
        <div className="container">
          <a href="index.html#tools" className="tool-back">← All Tools</a>
        </div>
      </section>

      {/* HERO */}
      <section className="tool-hero" style={{ '--accent': tool.accent }}>
        <div className="container">
          <div className="tool-hero-grid">
            <Reveal>
              <div>
                <div className="section-label">
                  <span className="pulse-green" /> Live
                </div>
                <h1 className="tool-hero-title">{tool.name}</h1>
                <p className="tool-hero-tag">{tool.tagline}</p>
                <div className="tool-hero-meta">
                  <span className="tool-hero-price">{tool.price}</span>
                  <span className="tool-hero-sep">·</span>
                  <a href="#" className="tool-hero-cta">Try It →</a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <CardGlow className="tool-hero-demo" accent={tool.accent}>
                <div className="tool-hero-demo-chrome">
                  <span className="tool-hero-demo-dot" style={{ background: '#ef4444' }} />
                  <span className="tool-hero-demo-dot" style={{ background: '#fbbf24' }} />
                  <span className="tool-hero-demo-dot" style={{ background: '#22c55e' }} />
                  <span className="tool-hero-demo-url">{tool.name.toLowerCase().replace(/\s/g, '')}.alekotools.com</span>
                </div>
                <div className="tool-hero-demo-body"><Demo /></div>
              </CardGlow>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section tool-how-section">
        <div className="container">
          <Reveal>
            <div className="section-label">How It Works</div>
            <h2 className="section-title">Three Steps. Nothing Hidden.</h2>
          </Reveal>
          <div className="tool-how">
            {tool.how.map((s, i) => (
              <Reveal key={s.n} delay={i * 80} className="tool-how-step">
                <div className="tool-how-num" style={{ color: tool.accent, borderColor: tool.accent + '55' }}>{s.n}</div>
                <div className="tool-how-title">{s.t}</div>
                <div className="tool-how-desc">{s.d}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      {tool.price !== 'Free' && (
        <section className="section tool-pricing-section">
          <div className="container">
            <Reveal>
              <div className="section-label">Pricing</div>
              <h2 className="section-title">Two Plans. No Surprises.</h2>
            </Reveal>
            <div className="tool-pricing">
              <Reveal className="tool-plan">
                <div className="tool-plan-name">Free</div>
                <div className="tool-plan-price">$0<span>/month</span></div>
                <ul className="tool-plan-features">
                  <li>3 uses per month</li>
                  <li>Core feature set</li>
                  <li>Web access only</li>
                  <li>Email support in ~24h</li>
                </ul>
                <a href="#" className="tool-plan-cta tool-plan-cta-alt">Start Free</a>
              </Reveal>
              <Reveal delay={80} className="tool-plan tool-plan-pro" style={{ '--accent': tool.accent }}>
                <div className="tool-plan-badge">Most Popular</div>
                <div className="tool-plan-name">Pro</div>
                <div className="tool-plan-price">{tool.price.split(' / ')[0]}<span>/month</span></div>
                <ul className="tool-plan-features">
                  <li>Unlimited usage</li>
                  <li>All current features</li>
                  <li>All future features</li>
                  <li>Priority email support</li>
                  <li>Cancel anytime</li>
                </ul>
                <a href="#" className="tool-plan-cta">Start Pro →</a>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="section tool-testimonials-section">
        <div className="container">
          <Reveal>
            <div className="section-label">What People Say</div>
            <h2 className="section-title">Real Users. Real Quotes.</h2>
          </Reveal>
          <div className="tool-testimonials">
            {tool.testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 70} className="tool-quote">
                <div className="tool-quote-mark">"</div>
                <p className="tool-quote-body">{t.q}</p>
                <div className="tool-quote-by">{t.by}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section tool-finalcta-section">
        <div className="container">
          <Reveal>
            <div className="tool-finalcta" style={{ '--accent': tool.accent }}>
              <h2 className="tool-finalcta-title">Try {tool.name} {tool.freePrice.includes('Free') ? 'Free' : 'Today'}.</h2>
              <p className="tool-finalcta-sub">{tool.freePrice}. Cancel anytime. No card required for the free tier.</p>
              <a href="#" className="tool-finalcta-cta">Try {tool.name} →</a>
            </div>
          </Reveal>
        </div>
      </section>

      <SharedFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ToolPage />);
