const { useState, useEffect, useMemo, useRef } = React;

const TOOL_COLOR = {
  'EssayCloner':    '#fbbf24',
  'Study Pebble':   '#60a5fa',
  'Shadow Shield':  '#a78bfa',
  'Traffic Guard':  '#f97316',
  'Wholefed':       '#22c55e',
  'Feastmate':      '#ef4444',
  'Core':           '#d4d4d8',
};

const TAG_COLOR = {
  LAUNCH:  '#22c55e',
  FEATURE: '#60a5fa',
  FIX:     '#fbbf24',
  UPDATE:  '#a78bfa',
};

/* 30 entries, reverse chronological, grouped by day */
const ENTRIES = [
  // Today
  { date: 'Apr 19, 2026', tool: 'Feastmate',      tag: 'FEATURE', text: 'Macro solver now respects "don\'t want" ingredients without breaking the budget constraint.' },
  { date: 'Apr 19, 2026', tool: 'Core',           tag: 'UPDATE',  text: 'Shipped the new portfolio site. Dark monochrome. Less chrome, more tools.' },
  { date: 'Apr 19, 2026', tool: 'Study Pebble',   tag: 'FIX',     text: 'Streak counter stopped resetting on Safari private windows. Was an sqlite writeability check.' },
  // Yesterday
  { date: 'Apr 18, 2026', tool: 'Shadow Shield',  tag: 'FEATURE', text: 'Added a proof-of-shield screenshot mode so users can share a flag without revealing the source image.' },
  { date: 'Apr 18, 2026', tool: 'EssayCloner',    tag: 'FIX',     text: 'Voice match score now updates after every paragraph instead of only at the end.' },
  // Apr 17
  { date: 'Apr 17, 2026', tool: 'Traffic Guard',  tag: 'UPDATE',  text: 'Threshold slider is now logarithmic. 1 to 1000 fits on one row.' },
  { date: 'Apr 17, 2026', tool: 'Wholefed',       tag: 'FEATURE', text: 'Grocery list now groups by store aisle, not category. People don\'t shop in alphabetical order.' },
  { date: 'Apr 17, 2026', tool: 'Core',           tag: 'UPDATE',  text: 'Rewrote the community voting board. Votes reorder live instead of on reload.' },
  // Apr 16
  { date: 'Apr 16, 2026', tool: 'EssayCloner',    tag: 'LAUNCH',  text: 'Tones v2 is live. Three sliders replace the old ten checkboxes.' },
  { date: 'Apr 16, 2026', tool: 'Study Pebble',   tag: 'FIX',     text: 'Flashcard TTS now respects browser language. Was hardcoded to en-US.' },
  // Apr 15
  { date: 'Apr 15, 2026', tool: 'Wholefed',       tag: 'FIX',     text: 'Portion math for liquids was using weight when it should\'ve used volume. Fixed, apologized, moved on.' },
  { date: 'Apr 15, 2026', tool: 'Shadow Shield',  tag: 'UPDATE',  text: 'Detection model recompiled. ~40ms faster on mobile cold start.' },
  // Apr 14
  { date: 'Apr 14, 2026', tool: 'Wholefed',       tag: 'LAUNCH',  text: 'Week 16 winner. Community-voted. Shipped in seven days from pitch to live.' },
  { date: 'Apr 14, 2026', tool: 'Core',           tag: 'UPDATE',  text: 'Billing moved fully to Stripe. Removed the last paddle dependency.' },
  // Apr 13
  { date: 'Apr 13, 2026', tool: 'Feastmate',      tag: 'FIX',     text: 'Login with Apple was returning the wrong email on re-auth. Sev-1 for two hours. Fixed.' },
  { date: 'Apr 13, 2026', tool: 'Study Pebble',   tag: 'FEATURE', text: 'Added a "cram mode" that flips review intervals upside down for pre-exam night.' },
  // Apr 12
  { date: 'Apr 12, 2026', tool: 'Traffic Guard',  tag: 'UPDATE',  text: 'Dashboard loads 3x faster. Offloaded the time-series aggregation to Rust.' },
  { date: 'Apr 12, 2026', tool: 'EssayCloner',    tag: 'FIX',     text: 'Stripped zero-width joiners from output. Detection checkers were false-flagging on them.' },
  // Apr 11
  { date: 'Apr 11, 2026', tool: 'Core',           tag: 'FEATURE', text: 'Added a public ideas board. Live voting reorders entries. No logins required.' },
  { date: 'Apr 11, 2026', tool: 'Shadow Shield',  tag: 'FIX',     text: 'Upload retry loop was ignoring server backpressure. Rewrote with exponential backoff.' },
  // Apr 10
  { date: 'Apr 10, 2026', tool: 'Wholefed',       tag: 'UPDATE',  text: 'Pantry mode now ranks meals by how many pantry items they use, not how many they need.' },
  { date: 'Apr 10, 2026', tool: 'Feastmate',      tag: 'FEATURE', text: 'Pantry sync with Wholefed. One database, two UIs.' },
  { date: 'Apr 10, 2026', tool: 'Study Pebble',   tag: 'UPDATE',  text: 'Flashcard import now accepts Quizlet exports without any manual cleanup.' },
  // Apr 9
  { date: 'Apr 09, 2026', tool: 'EssayCloner',    tag: 'FEATURE', text: 'Added a vocabulary lock. Prevents EssayCloner from using words the user hasn\'t used themselves.' },
  { date: 'Apr 09, 2026', tool: 'Traffic Guard',  tag: 'FIX',     text: 'Webhook delivery was retrying on 4xx. Now only retries on 5xx and timeouts.' },
  // Apr 8
  { date: 'Apr 08, 2026', tool: 'Core',           tag: 'UPDATE',  text: 'All tools now share one auth session. One login unlocks the whole portfolio.' },
  { date: 'Apr 08, 2026', tool: 'Shadow Shield',  tag: 'FEATURE', text: 'Added a "trust this sender" exception list for family accounts.' },
  // Apr 7
  { date: 'Apr 07, 2026', tool: 'Traffic Guard',  tag: 'LAUNCH',  text: 'Threshold watch-only mode is live. You can monitor anomalies without blocking traffic.' },
  { date: 'Apr 07, 2026', tool: 'Wholefed',       tag: 'FIX',     text: 'Grocery list export to text had inconsistent units. All metric now, configurable later.' },
  { date: 'Apr 07, 2026', tool: 'Feastmate',      tag: 'UPDATE',  text: 'Macro targets now persist across devices via the shared account layer.' },
];

/* ============ Animated stat counter ============ */
function CountUp({ to, duration = 1200 }) {
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
  return <>{n}</>;
}

/* ============ Hero + stats ============ */
function Hero() {
  return (
    <header className="cl-hero">
      <div className="cl-hero-aurora" aria-hidden>
        <span className="cl-aurora-a" />
        <span className="cl-aurora-b" />
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div>
          <div className="cl-hero-eyebrow">
            <span className="pulse-green" />
            <span>Build Log</span>
          </div>
        </div>
        <div>
          <h1 className="cl-hero-title">
            Everything I shipped,<br />
            <em>fixed, and broke.</em>
          </h1>
        </div>
        <div>
          <p className="cl-hero-sub">
            Updated daily. No marketing copy, no "we are excited to announce". Just the actual diff, in plain English.
          </p>
        </div>
        <div>
          <div className="cl-stats">
            <div className="cl-stat">
              <span className="cl-stat-num"><CountUp to={34} /></span>
              <span className="cl-stat-lbl">Updates This Month</span>
            </div>
            <div className="cl-stat">
              <span className="cl-stat-num"><CountUp to={6} /></span>
              <span className="cl-stat-lbl">Tools Updated This Week</span>
            </div>
            <div className="cl-stat">
              <span className="cl-stat-num"><CountUp to={112} /></span>
              <span className="cl-stat-lbl">Day Ship Streak</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ============ Filter bar ============ */
function FilterBar({ tag, setTag, tool, setTool, q, setQ }) {
  const tags = ['ALL', 'LAUNCH', 'FEATURE', 'FIX', 'UPDATE'];
  const tools = ['All Tools', ...Object.keys(TOOL_COLOR)];
  return (
    <div className="cl-filter">
      <div className="cl-filter-search">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M9 9 L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search updates..."
        />
      </div>
      <div className="cl-filter-pills">
        {tags.map(t => (
          <button
            key={t}
            className={`cl-pill ${tag === t ? 'active' : ''}`}
            onClick={() => setTag(t)}
            style={tag === t && t !== 'ALL' ? { '--pill-color': TAG_COLOR[t] } : {}}
          >
            {t}
          </button>
        ))}
      </div>
      <select className="cl-tool-select" value={tool} onChange={e => setTool(e.target.value)}>
        {tools.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
  );
}

/* ============ Timeline ============ */
function Timeline({ entries }) {
  const railRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const rail = railRef.current;
    if (!wrap || !rail) return;
    const on = () => {
      const r = wrap.getBoundingClientRect();
      const h = window.innerHeight;
      // progress from 0 (top of wrap just entered viewport) to 1 (bottom of wrap left viewport)
      const total = r.height + h * 0.5;
      const seen = Math.min(Math.max(h - r.top, 0), total);
      const p = Math.min(1, seen / total);
      rail.style.setProperty('--p', p);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, [entries]);

  // group by date
  const groups = useMemo(() => {
    const out = [];
    let current = null;
    entries.forEach(e => {
      if (!current || current.date !== e.date) {
        current = { date: e.date, items: [] };
        out.push(current);
      }
      current.items.push(e);
    });
    return out;
  }, [entries]);

  const today = 'Apr 19, 2026';

  return (
    <div ref={wrapRef} className="cl-tl-wrap">
      <div ref={railRef} className="cl-tl-rail" aria-hidden>
        <span className="cl-tl-rail-fill" />
      </div>
      {groups.map((g, gi) => (
        <div key={g.date} className="cl-tl-group">
          <div className={`cl-tl-date ${g.date === today ? 'is-today' : ''}`}>
            <span className="cl-tl-date-dot" />
            <span className="cl-tl-date-text">{g.date}</span>
            {g.date === today && <span className="cl-tl-today">TODAY</span>}
          </div>
          {g.items.map((e, ei) => (
            <div key={gi + ':' + ei} className="cl-tl-row">
              <span
                className="cl-tl-node"
                style={{ '--accent': TOOL_COLOR[e.tool] || '#fafafa' }}
                aria-hidden
              />
              <div className="cl-tl-card" style={{ '--accent': TOOL_COLOR[e.tool] || '#fafafa' }}>
                <div className="cl-tl-card-head">
                  <span className="cl-tl-tool">
                    <span className="cl-tl-tool-dot" />
                    {e.tool}
                  </span>
                  <span
                    className="cl-tl-tag"
                    style={{
                      color: TAG_COLOR[e.tag],
                      borderColor: TAG_COLOR[e.tag] + '55',
                      background: TAG_COLOR[e.tag] + '14',
                    }}
                  >{e.tag}</span>
                  {g.date === today && <span className="cl-tl-new">NEW</span>}
                </div>
                <p className="cl-tl-text">{e.text}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ============ Page ============ */
function ChangelogPage() {
  const [tag, setTag] = useState('ALL');
  const [tool, setTool] = useState('All Tools');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ENTRIES.filter(e =>
      (tag === 'ALL' || e.tag === tag) &&
      (tool === 'All Tools' || e.tool === tool) &&
      (!needle || e.text.toLowerCase().includes(needle) || e.tool.toLowerCase().includes(needle))
    );
  }, [tag, tool, q]);

  return (
    <>
      <SharedNav current="changelog" />
      <Hero />
      <main className="container cl-main">
        <FilterBar tag={tag} setTag={setTag} tool={tool} setTool={setTool} q={q} setQ={setQ} />
        {filtered.length === 0 ? (
          <div className="cl-empty">
            <div className="cl-empty-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 11 L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="cl-empty-title">Nothing matches that filter.</div>
            <div className="cl-empty-sub">Try widening the search, or clear the filters.</div>
          </div>
        ) : (
          <Timeline entries={filtered} />
        )}
      </main>
      <SharedFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ChangelogPage />);
