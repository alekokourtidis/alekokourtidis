const { useState, useEffect, useRef, useMemo } = React;

/* ============ Seed data ============ */
const SEED_IDEAS = [
  { id: 1,  text: 'A tool that rewrites my class notes in the voice of a bored teenager so I remember them', by: 'mira_k',       cat: 'Education',     votes: 247, posted: '2 days ago' },
  { id: 2,  text: 'Catch AI slop in group-chat screenshots before my grandma forwards it',                        by: 'devon.b',        cat: 'Security',      votes: 198, posted: '3 days ago' },
  { id: 3,  text: 'One-button gym macros. I eat the same five meals, stop making me configure them',               by: 'lmao.lift',      cat: 'Health',        votes: 164, posted: '4 days ago' },
  { id: 4,  text: 'Scrape a recipe from a 19-paragraph blog post and return ONLY the recipe',                      by: 'kat_c',          cat: 'Productivity',  votes: 142, posted: '1 day ago' },
  { id: 5,  text: 'Tell me if a college essay prompt is a rewording of last year\'s prompt',                       by: 'thomas_w',       cat: 'Education',     votes: 119, posted: '5 days ago' },
  { id: 6,  text: 'A voice memo to-do app that organizes itself. No tags, no folders, just \"now / soon / maybe\"', by: 'rynn',           cat: 'Productivity',  votes: 93,  posted: '2 days ago' },
  { id: 7,  text: 'Shadow Shield but for TikTok comments on my grandma\'s account',                                 by: 'mia_ok',         cat: 'Security',      votes: 78,  posted: '6 days ago' },
  { id: 8,  text: 'Something that listens to my Spotify and tells me when my ADHD meds are wearing off',            by: 'clancy',         cat: 'Health',        votes: 61,  posted: '1 day ago' },
  { id: 9,  text: 'A \"reply-to-this-text\" helper that sounds like me, not like ChatGPT',                          by: 'jude_a',         cat: 'Relationships', votes: 54,  posted: '3 days ago' },
  { id: 10, text: 'Parse school grade portals + tell me what assignment moves my GPA most',                         by: 'spencer.m',      cat: 'Education',     votes: 42,  posted: '1 day ago' },
  { id: 11, text: 'Roast my landing page in the voice of a grumpy designer',                                         by: 'pat_v',          cat: 'Productivity',  votes: 31,  posted: '4 hours ago' },
  { id: 12, text: 'Drops incoming homework into Google Cal with realistic time blocks',                              by: 'noor_s',         cat: 'Education',     votes: 28,  posted: '6 hours ago' },
];

const CAT_COLOR = {
  'Education':     '#fbbf24',
  'Security':      '#60a5fa',
  'Health':        '#22c55e',
  'Productivity':  '#a78bfa',
  'Relationships': '#ef4444',
  'SEO':           '#f97316',
};

const PAST_BUILDS = [
  { week: 16, title: 'Wholefed',              by: 'nat_w',    shipped: 'Apr 14, 2026', blurb: 'Macro-aware grocery list that doesn\'t lie about portion sizes.' },
  { week: 15, title: 'Traffic Guard Threshold', by: 'alex.r',  shipped: 'Apr 07, 2026', blurb: 'Watch-only mode for anomaly detection before it blocks real users.' },
  { week: 14, title: 'Shadow Shield v2',       by: 'mira_k',   shipped: 'Mar 31, 2026', blurb: 'Screenshot layer so you can share a proof-of-shield without the full flag.' },
  { week: 13, title: 'Study Pebble Streaks',   by: 'devon.b',  shipped: 'Mar 24, 2026', blurb: 'Gamified recall streaks with opt-out for people who hate gamification.' },
  { week: 12, title: 'EssayCloner Tones',      by: 'kat_c',    shipped: 'Mar 17, 2026', blurb: 'Three voice sliders replacing the old ten-checkbox mess.' },
  { week: 11, title: 'Feastmate Pantry Mode',  by: 'lmao.lift',shipped: 'Mar 10, 2026', blurb: 'Tells you what to cook with what you already own.' },
];

const LEADERBOARD = [
  { name: 'mira_k',   shipped: 2, upvotes: 612 },
  { name: 'devon.b',  shipped: 1, upvotes: 441 },
  { name: 'kat_c',    shipped: 1, upvotes: 389 },
  { name: 'lmao.lift',shipped: 1, upvotes: 308 },
  { name: 'alex.r',   shipped: 1, upvotes: 287 },
  { name: 'nat_w',    shipped: 1, upvotes: 254 },
];

/* ============ Top banner ============ */
function ThisWeek() {
  return (
    <div className="cm-week-banner">
      <div className="cm-week-inner">
        <div className="cm-week-badge">
          <span className="pulse-green" />
          <span>Building This Week</span>
        </div>
        <div className="cm-week-text">
          <span className="cm-week-num">WEEK 17</span>
          <span className="cm-week-dot">·</span>
          <span className="cm-week-title">{SEED_IDEAS[0].text}</span>
        </div>
        <div className="cm-week-meta">
          pitched by <strong>@{SEED_IDEAS[0].by}</strong> · {SEED_IDEAS[0].votes} votes
        </div>
      </div>
    </div>
  );
}

/* ============ Suggest form ============ */
function SuggestForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [burst, setBurst] = useState(false);
  const max = 180;

  const submit = (e) => {
    e.preventDefault();
    if (!idea.trim()) return;
    onSubmit({ text: idea.trim(), by: name.trim() || 'anon' });
    setBurst(true);
    setTimeout(() => setBurst(false), 900);
    setSent(true);
    setIdea(''); setName(''); setEmail('');
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <div className="cm-suggest" id="suggest">
      <div className="cm-suggest-header">
        <div className="cm-section-eyebrow">Drop A Build Request</div>
        <h2 className="cm-suggest-title">Your idea. My bedroom. One week.</h2>
      </div>
      <form className="cm-suggest-form" onSubmit={submit}>
        <div className="cm-field-row">
          <label className="cm-field">
            <span>Name (optional)</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="How should I credit you?" />
          </label>
          <label className="cm-field">
            <span>Email (optional)</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="So I can tell you when it ships" />
          </label>
        </div>
        <label className="cm-field cm-field-big">
          <span>Your idea</span>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value.slice(0, max))}
            placeholder="One sentence. Describe the problem, not the feature. Be specific."
            rows={3}
          />
          <div className="cm-count">
            <span className={idea.length > max - 20 ? 'warn' : ''}>{idea.length}</span>
            <span> / {max}</span>
          </div>
        </label>
        <div className="cm-suggest-footer">
          <button className="cm-submit" type="submit" disabled={!idea.trim()}>
            {sent ? 'Got It. Thanks.' : 'Post Idea →'}
          </button>
          <span className="cm-fine">Posts are public. Profanity and scams get removed.</span>
        </div>
        {burst && <span className="cm-burst" aria-hidden />}
      </form>
    </div>
  );
}

/* ============ Voting card ============ */
function IdeaCard({ idea, onVote, voted, isWinner, ord }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  };
  const accent = CAT_COLOR[idea.cat] || '#fafafa';
  return (
    <div
      ref={ref}
      className={`cm-idea ${voted ? 'is-voted' : ''} ${isWinner ? 'is-winner' : ''}`}
      style={{ '--accent': accent, '--ord': ord }}
      onMouseMove={onMove}
    >
      <span className="cm-idea-glow" aria-hidden />
      <span className="cm-idea-accent" aria-hidden />
      <div className="cm-idea-main">
        <div className="cm-idea-head">
          <span className="cm-idea-cat" style={{ color: accent, borderColor: accent + '55', background: accent + '14' }}>{idea.cat}</span>
          {isWinner && (
            <span className="cm-idea-winner">
              <span className="pulse-green" /> Building This Week
            </span>
          )}
        </div>
        <p className="cm-idea-text">{idea.text}</p>
        <div className="cm-idea-meta">
          <span>@{idea.by}</span>
          <span className="cm-dot">·</span>
          <span>{idea.posted}</span>
        </div>
      </div>
      <button
        className={`cm-vote ${voted ? 'is-voted' : ''}`}
        onClick={() => onVote(idea.id)}
        aria-label={voted ? 'Remove upvote' : 'Upvote'}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2 L12 9 L9 9 L9 12 L5 12 L5 9 L2 9 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill={voted ? 'currentColor' : 'none'}/>
        </svg>
        <span className="cm-vote-count">{idea.votes}</span>
      </button>
    </div>
  );
}

/* ============ Board ============ */
function Board({ ideas, setIdeas, voted, setVoted }) {
  const [sort, setSort] = useState('voted');
  const sorted = useMemo(() => {
    const copy = [...ideas];
    if (sort === 'voted') copy.sort((a, b) => b.votes - a.votes);
    else copy.sort((a, b) => b.id - a.id);
    return copy;
  }, [ideas, sort]);

  const winnerId = useMemo(() => {
    let max = -1, id = null;
    ideas.forEach(i => { if (i.votes > max) { max = i.votes; id = i.id; } });
    return id;
  }, [ideas]);

  const vote = (id) => {
    const has = voted.has(id);
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, votes: i.votes + (has ? -1 : 1) } : i));
    setVoted(prev => {
      const n = new Set(prev);
      if (has) n.delete(id); else n.add(id);
      return n;
    });
  };

  return (
    <div className="cm-board">
      <div className="cm-board-head">
        <div>
          <div className="cm-section-eyebrow">The Board</div>
          <h2 className="cm-board-title">{ideas.length} live ideas, sorted by you</h2>
        </div>
        <div className="cm-sort">
          <button className={sort === 'voted' ? 'active' : ''} onClick={() => setSort('voted')}>Most Voted</button>
          <button className={sort === 'new' ? 'active' : ''} onClick={() => setSort('new')}>Newest</button>
        </div>
      </div>
      <div className="cm-idea-list">
        {sorted.map((idea, i) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            ord={i}
            voted={voted.has(idea.id)}
            isWinner={idea.id === winnerId}
            onVote={vote}
          />
        ))}
      </div>
    </div>
  );
}

/* ============ Past builds timeline ============ */
function PastBuilds() {
  return (
    <section className="cm-section">
      <div>
        <div className="cm-section-eyebrow">Previously, on Community Week</div>
        <h2 className="cm-board-title">Shipped from the board</h2>
        <p className="cm-section-sub">Every one of these started as a post on the board. Most got built in seven days.</p>
      </div>
      <div className="cm-past">
        <span className="cm-past-rail" aria-hidden />
        {PAST_BUILDS.map((b, i) => (
          <div key={b.week} className="cm-past-row">
            <span className="cm-past-dot" aria-hidden />
            <div className="cm-past-week">
              <span>WEEK {b.week}</span>
              <span className="cm-past-date">Shipped {b.shipped}</span>
            </div>
            <div className="cm-past-card">
              <div className="cm-past-card-head">
                <h3 className="cm-past-name">{b.title}</h3>
                <span className="cm-past-tag">SHIPPED</span>
              </div>
              <p className="cm-past-blurb">{b.blurb}</p>
              <div className="cm-past-meta">pitched by <strong>@{b.by}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ Leaderboard ============ */
function Leaderboard() {
  return (
    <section className="cm-section">
      <div>
        <div className="cm-section-eyebrow">Top Contributors</div>
        <h2 className="cm-board-title">People whose ideas turned into code</h2>
      </div>
      <div className="cm-lb">
        {LEADERBOARD.map((p, i) => (
          <div key={p.name} className="cm-lb-row">
            <span className="cm-lb-rank">{String(i + 1).padStart(2, '0')}</span>
            <div className="cm-lb-avatar">{p.name.slice(0, 2).toUpperCase()}</div>
            <div className="cm-lb-name">@{p.name}</div>
            <div className="cm-lb-stat">
              <span className="cm-lb-num">{p.shipped}</span>
              <span className="cm-lb-lbl">Shipped</span>
            </div>
            <div className="cm-lb-stat">
              <span className="cm-lb-num">{p.upvotes}</span>
              <span className="cm-lb-lbl">Upvotes</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ Hero ============ */
function Hero() {
  return (
    <header className="cm-hero">
      <div className="cm-hero-aurora" aria-hidden>
        <span className="cm-aurora-a" />
        <span className="cm-aurora-b" />
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="cm-hero-eyebrow">
          <span className="pulse-green" />
          <span>The Community</span>
        </div>
        <h1 className="cm-hero-title">
          You vote.<br />
          <em>I build.</em>
        </h1>
        <p className="cm-hero-sub">
          Every week, the most-upvoted idea on the board gets prototyped and shipped. No feature requests that rot in a spreadsheet. No roadmaps. Just one week, one build, public.
        </p>
        <div className="cm-hero-stats">
            <div className="cm-hero-stat">
              <span className="cm-hero-stat-num">17</span>
              <span className="cm-hero-stat-lbl">Weeks Running</span>
            </div>
            <div className="cm-hero-stat">
              <span className="cm-hero-stat-num">11</span>
              <span className="cm-hero-stat-lbl">Ideas Shipped</span>
            </div>
            <div className="cm-hero-stat">
              <span className="cm-hero-stat-num">312</span>
              <span className="cm-hero-stat-lbl">Ideas On Board</span>
            </div>
          </div>
      </div>
    </header>
  );
}

/* ============ Page ============ */
function CommunityPage() {
  const [ideas, setIdeas] = useState(SEED_IDEAS);
  const [voted, setVoted] = useState(new Set());

  const addIdea = ({ text, by }) => {
    setIdeas(prev => [
      { id: Math.max(...prev.map(i => i.id)) + 1, text, by, cat: 'Productivity', votes: 1, posted: 'just now' },
      ...prev,
    ]);
  };

  return (
    <>
      <SharedNav current="community" />
      <Hero />

      <ThisWeek />

      <div className="container cm-main">
        <div className="cm-main-grid">
          <SuggestForm onSubmit={addIdea} />
          <Board ideas={ideas} setIdeas={setIdeas} voted={voted} setVoted={setVoted} />
        </div>
      </div>

      <div className="container">
        <PastBuilds />
        <Leaderboard />
      </div>

      <SharedFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CommunityPage />);
