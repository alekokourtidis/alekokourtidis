const { useState } = React;

const POSTS = [
  { cat: 'Education', title: 'How EssayCloner Learns A Voice In Three Samples', excerpt: 'I tried fine-tuning. I tried RAG. I tried a wild prompt sandwich. Here is what actually shipped, and what I threw out.', date: 'Apr 17, 2026', read: '6 Min', accent: '#fbbf24' },
  { cat: 'Relationships', title: 'I Killed My Second Product After Four Months', excerpt: 'It made $200 a month. People told me to keep it. I shut it down anyway. Honestly the best decision I made this year.', date: 'Apr 14, 2026', read: '9 Min', accent: '#ef4444' },
  { cat: 'SEO', title: 'Why One-Person Companies Will Own The Next Decade', excerpt: 'Distribution got cheap. Building got cheaper. The bottleneck moved to taste, and taste does not scale with headcount.', date: 'Apr 11, 2026', read: '11 Min', accent: '#a78bfa' },
  { cat: 'Security', title: 'Shipping Six Tools In Seven Days', excerpt: 'I gave myself one rule. Push something live before midnight. Here is what broke, what worked, and what I would never do again.', date: 'Apr 10, 2026', read: '8 Min', accent: '#60a5fa' },
  { cat: 'Health', title: 'The Macro Math Behind Feastmate', excerpt: 'Hitting an exact macro target with real food is a constraint solver, not a search problem. Took me three rewrites to figure that out.', date: 'Apr 8, 2026', read: '7 Min', accent: '#22c55e' },
  { cat: 'Education', title: 'On Building Tools You Actually Use', excerpt: 'Every product I shipped that worked started with a problem I had at 11pm. Every one that flopped started with a market I imagined.', date: 'Apr 5, 2026', read: '5 Min', accent: '#fbbf24' },
  { cat: 'SEO', title: 'The Onboarding Flow That Killed My Conversion', excerpt: 'I added a six-step setup wizard. Conversion dropped 71% overnight. Here is the data and the very obvious lesson.', date: 'Apr 2, 2026', read: '4 Min', accent: '#a78bfa' },
];

function BlogPage() {
  const cats = ['All', 'Education', 'Health', 'Security', 'SEO', 'Relationships'];
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? POSTS : POSTS.filter(p => p.cat === filter);

  return (
    <>
      <SharedNav current="blog" />

      <section className="blogpage-new blogpage-lux">
        <div className="about-hero-aurora" aria-hidden style={{ height: 560 }}>
          <span className="about-aurora-a" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.32), transparent 60%)' }} />
          <span className="about-aurora-b" style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.28), transparent 60%)' }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div>
            <div className="about-eyebrow"><span className="pulse-green" /><span>WRITING</span></div>
            <h1 className="blogpage-title">Blog.</h1>
            <p className="blogpage-sub">
              What I'm shipping, what I broke, and what I'm thinking about next.
            </p>
          </div>

          <div>
            <div className="blogpage-filter">
              {cats.map(c => (
                <button key={c} className={`blogpage-pill ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="blogpage-grid">
            {filtered.map((p, i) => (
              <div key={p.title}>
                <CardGlow className="blogpage-card" accent={p.accent}>
                  <span className="blogpage-card-glow" />
                  <div className="blogpage-card-cat" style={{ color: p.accent, borderColor: p.accent + '40', background: p.accent + '10' }}>{p.cat}</div>
                  <div className="blogpage-card-title">{p.title}</div>
                  <div className="blogpage-card-excerpt">{p.excerpt}</div>
                  <div className="blogpage-card-meta">
                    <span>{p.date}</span>
                    <span className="blogpage-card-dot">·</span>
                    <span>{p.read} Read</span>
                    <span className="blogpage-card-arrow">→</span>
                  </div>
                </CardGlow>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SharedFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BlogPage />);
