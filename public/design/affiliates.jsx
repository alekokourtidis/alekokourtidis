const { useState } = React;

const TOOLS = [
  { name: 'EssayCloner', desc: 'Writes new essays in your actual voice from three samples.', rate: 40, price: '$1.99/mo', cat: 'Education' },
  { name: 'Study Pebble', desc: 'Adaptive AP and SAT prep that adjusts to your weak spots.', rate: 35, price: '$14.99/mo', cat: 'Education' },
  { name: 'AI Shadow Shield', desc: 'Tells you if the apps you use at work are feeding AI.', rate: 40, price: '$19/mo', cat: 'Security' },
  { name: 'AI Traffic Guard', desc: 'Flags keywords Google AI Overviews are eating.', rate: 40, price: '$29/mo', cat: 'SEO' },
  { name: 'Wholefed', desc: 'Snap a meal, get a real health read beyond calories.', rate: 30, price: 'Free', cat: 'Health' },
  { name: 'Feastmate', desc: 'Macro-locked recipes that actually hit your targets.', rate: 35, price: '$4.99/mo', cat: 'Health' },
];

function AffiliatesPage() {
  const [form, setForm] = useState({ name: '', email: '', platform: 'TikTok', handle: '', tool: 'EssayCloner' });
  const [submitted, setSubmitted] = useState(false);
  const code = submitted ? `${form.name.split(' ')[0].toUpperCase() || 'NEW'}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}` : null;

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = (e) => { e.preventDefault(); if (form.name && form.email && form.handle) setSubmitted(true); };

  return (
    <>
      <SharedNav current="affiliates" />

      {/* HERO */}
      <section className="aff-hero aff-hero-lux">
        <div className="about-hero-aurora" aria-hidden>
          <span className="about-aurora-a" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.35), transparent 60%)' }} />
          <span className="about-aurora-b" style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.28), transparent 60%)' }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div>
            <div className="about-eyebrow"><span className="pulse-green" /><span>AFFILIATE PROGRAM</span></div>
          </div>
          <div>
            <h1 className="aff-hero-title">Promote AI tools.<br/><em>Earn up to 40%.</em></h1>
          </div>
          <div>
            <p className="aff-hero-sub">
              Real products, real commissions, monthly payouts. No MLM nonsense, no "growth hacks." You share a link, someone signs up, you get paid.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section aff-steps-section">
        <div className="container">
          <div>
            <div className="section-label">How It Works</div>
            <h2 className="section-title">Three Steps. That's It.</h2>
          </div>
          <div className="aff-steps">
            {[
              { n: '01', t: 'Sign Up', d: 'Tell me who you are and what platform you post on. Takes a minute. No approval waiting, no interview.', accent: '#22c55e' },
              { n: '02', t: 'Share', d: 'You get a unique promo code and link for every tool. Put them in bios, captions, videos, wherever makes sense.', accent: '#60a5fa' },
              { n: '03', t: 'Earn', d: 'Every paid signup through your link pays you 30–40% of the subscription. Payouts go out monthly via PayPal.', accent: '#fbbf24' },
            ].map((s, i) => (
              <div key={s.n}>
                <CardGlow className="aff-step" accent={s.accent}>
                  <span className="about-principle-glow" />
                  <div className="aff-step-num">{s.n}</div>
                  <div className="aff-step-title">{s.t}</div>
                  <div className="aff-step-desc">{s.d}</div>
                </CardGlow>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMISSION TABLE */}
      <section className="section aff-table-section">
        <div className="container">
          <div>
            <div className="section-label">Commission Rates</div>
            <h2 className="section-title">What You Earn Per Tool.</h2>
            <p className="section-desc">Higher rates on the tools that convert best. Rates are recurring for as long as the customer stays subscribed.</p>
          </div>

          <div>
            <div className="aff-table">
              <div className="aff-table-head">
                <div>Tool</div>
                <div>Description</div>
                <div className="aff-col-right">Price</div>
                <div className="aff-col-right">Commission</div>
                <div />
              </div>
              {TOOLS.map(t => (
                <div key={t.name} className="aff-table-row">
                  <div className="aff-table-name">{t.name}</div>
                  <div className="aff-table-desc">{t.desc}</div>
                  <div className="aff-col-right aff-table-price">{t.price}</div>
                  <div className="aff-col-right aff-table-rate">{t.rate}%</div>
                  <div className="aff-col-right"><a href="#signup" className="aff-table-link">Promote →</a></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SIGNUP FORM */}
      <section className="section aff-signup-section" id="signup">
        <div className="container">
          <div className="aff-signup-grid">
            <div>
              <div className="section-label">Sign Up</div>
              <h2 className="section-title">Apply In Under A Minute.</h2>
              <p className="section-desc">No approval queue. You submit, you get your code and link immediately. Start posting today.</p>
              <div className="aff-fineprint">
                <div className="aff-fine-title">The Fine Print</div>
                <ul>
                  <li>Paid monthly via PayPal</li>
                  <li>Minimum payout $10</li>
                  <li>Cookies last 30 days</li>
                  <li>Recurring commission for active subs</li>
                </ul>
              </div>
            </div>

            <div>
              {!submitted ? (
                <form className="aff-form" onSubmit={submit}>
                  <label className="aff-field">
                    <span>Name</span>
                    <input type="text" value={form.name} onChange={update('name')} placeholder="Alex Rivera" required />
                  </label>
                  <label className="aff-field">
                    <span>Email</span>
                    <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required />
                  </label>
                  <div className="aff-field-row">
                    <label className="aff-field">
                      <span>Platform</span>
                      <select value={form.platform} onChange={update('platform')}>
                        <option>TikTok</option><option>Instagram</option><option>YouTube</option><option>Twitter / X</option>
                      </select>
                    </label>
                    <label className="aff-field">
                      <span>Handle</span>
                      <input type="text" value={form.handle} onChange={update('handle')} placeholder="@yourhandle" required />
                    </label>
                  </div>
                  <label className="aff-field">
                    <span>Preferred Tool</span>
                    <select value={form.tool} onChange={update('tool')}>
                      {TOOLS.map(t => <option key={t.name}>{t.name}</option>)}
                    </select>
                  </label>
                  <button type="submit" className="aff-submit">Generate My Link →</button>
                </form>
              ) : (
                <div className="aff-success">
                  <div className="aff-success-badge"><span className="pulse-green" /> You're In</div>
                  <div className="aff-success-title">Here's Your Code + Link</div>
                  <div className="aff-success-row">
                    <span className="aff-success-label">Promo Code</span>
                    <span className="aff-success-val">{code}</span>
                  </div>
                  <div className="aff-success-row">
                    <span className="aff-success-label">Referral Link</span>
                    <span className="aff-success-val aff-success-link">alekotools.com/{form.tool.toLowerCase().replace(/\s/g, '')}?ref={code}</span>
                  </div>
                  <p className="aff-success-note">
                    Check your email — I'm also sending these there plus the asset pack (logos, copy, a couple of short clips).
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AffiliatesPage />);
