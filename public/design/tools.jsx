/* Tools Directory — /tools page
 * Scalable from 6 to 200 tools. Hero, sticky filter, featured cards,
 * expandable list rows, category view, empty state, CTA.
 */

const { useState, useEffect, useMemo, useRef } = React;

/* ============ Tool Data ============
 * SEED_TOOLS is the hardcoded fallback; live list comes from Supabase
 * tool_library via useToolLibrarySupabase (shared.jsx).
 */
const SEED_TOOLS = [
  {
    id: 'essaycloner', title: 'EssayCloner', price: '$1.99 / Mo', priceNum: 1.99,
    cat: 'Education', platform: 'Web',
    tag: 'Feed it three of your old essays. It learns how you actually write and drafts new ones that don\'t sound like ChatGPT.',
    desc: 'The model does a structured extraction pass on your samples — syntax tics, sentence-length rhythm, clause patterns, vocabulary — and writes inside that profile. No fine-tuning. No RAG. Just a very specific prompt sandwich that learned what "your voice" actually means.',
    featured: true, users: '4.1k', usersNum: 4100, shipped: '2026-04-11',
    accent: '#a78bfa',
  },
  {
    id: 'studypebble', title: 'Study Pebble', price: '$14.99 / Mo', priceNum: 14.99,
    cat: 'Education', platform: 'Web',
    tag: 'AP and SAT prep that adjusts to what you keep getting wrong. Free response answers get scored against the actual rubric.',
    desc: 'Adaptive flashcards that surface your weak topics more often. Free-response answers get graded against the real AP/College Board rubric, not a generic "is this correct" check. Pulls every official released exam question.',
    featured: true, users: '2.4k', usersNum: 2400, shipped: '2026-04-12',
    accent: '#fbbf24',
  },
  {
    id: 'shadowshield', title: 'AI Shadow Shield', price: '$19 / Mo', priceNum: 19,
    cat: 'Security', platform: 'Web',
    tag: 'Quietly checks the apps you use at work. Tells you if your company is feeding what you write into a model.',
    desc: 'Monitors the AI features of common workplace tools (Notion, Slack, Gmail, Jira, Linear). Flags when a feature is training on your input. Gives you a one-line explanation you can paste to IT.',
    users: '860', usersNum: 860, shipped: '2026-04-13',
    accent: '#ef4444',
  },
  {
    id: 'trafficguard', title: 'AI Traffic Guard', price: '$29 / Mo', priceNum: 29,
    cat: 'Productivity', platform: 'Web',
    tag: 'Watches your top keywords and flags the ones Google AI Overviews are eating. Rewrite before the traffic goes.',
    desc: 'Daily sweeps of your top 100 ranking keywords. Detects when an AI Overview shows up for a query you ranked on, and diffs how your content lines up with what the Overview is citing. Tells you what to rewrite.',
    users: '412', usersNum: 412, shipped: '2026-04-14',
    accent: '#60a5fa',
  },
  {
    id: 'wholefed', title: 'Wholefed', price: 'Free · iOS', priceNum: 0,
    cat: 'Health', platform: 'iOS',
    tag: 'Take a photo of what you\'re about to eat. Get back a real read on it, not just a calorie number.',
    desc: 'Photo → breakdown. Macros, micronutrients, processing level, and a real answer on whether this is the meal you actually want. Built because every other calorie tracker is a spreadsheet in a trench coat.',
    users: '11.2k', usersNum: 11200, shipped: '2026-04-15',
    featured: false, accent: '#22c55e',
  },
  {
    id: 'feastmate', title: 'Feastmate', price: '$4.99 / Mo', priceNum: 4.99,
    cat: 'Health', platform: 'iOS',
    tag: 'Plug in your macro targets. Get back a real recipe that hits them, not a vague suggestion you have to math out.',
    desc: 'Constraint solver hits your macros on the nose with real ingredients. Respects allergies, budget, and a "don\'t want" list without blowing up the math.',
    users: '1.8k', usersNum: 1800, shipped: '2026-04-16',
    accent: '#f472b6',
  },
  {
    id: 'whowasright', title: 'WhoWasRight', price: 'Free', priceNum: 0,
    cat: 'Relationships', platform: 'Web',
    tag: 'Paste a text argument. AI breaks down who was right, scores each person on 10 dimensions, detects manipulation tactics.',
    desc: 'Supports text paste, screenshot OCR, voice recording, and typed description. Analyzes arguments with 10-category scoring: factual accuracy, emotional control, proportionality, manipulation, empathy, and more.',
    users: '320', usersNum: 320, shipped: '2026-04-15',
    accent: '#8b5cf6',
  },
  {
    id: 'flowdebug', title: 'FlowDebug', price: '$29 / Mo', priceNum: 29,
    cat: 'Productivity', platform: 'Web',
    tag: 'When your Make.com automations break at 3 AM, this shows you exactly what data went where and what failed.',
    desc: 'Replay workflows step by step, see data flowing between modules, spot the exact moment things went wrong. Built for freelancers and agencies running client automations.',
    users: '89', usersNum: 89, shipped: '2026-04-16',
    accent: '#14b8a6',
  },
  {
    id: 'whomealplanner', title: 'WHO Meal Planner', price: '$4.99 / Mo', priceNum: 4.99,
    cat: 'Health', platform: 'Web',
    tag: 'Converts WHO nutrition guidelines into personalized weekly meal plans with grocery lists and cost estimates.',
    desc: 'Paste your dietary restrictions and goals. AI generates a 7-day meal plan following WHO guidelines with a grocery list and estimated weekly cost.',
    users: '0', usersNum: 0, shipped: '2026-04-19',
    accent: '#22c55e',
  },
  {
    id: 'arrpower', title: 'ArrPower', price: '\$9.99 / Mo', priceNum: 9.99,
    cat: 'Productivity', platform: 'Web',
    tag: 'Stop your drives from spinning at 3AM. Schedule Radarr and Sonarr tasks intelligently.',
    desc: 'Smart scheduling for media server tasks so your hardware rests when you sleep.',
    users: '0', usersNum: 0, shipped: '2026-04-20',
    accent: '#60a5fa',
  },
  {
    id: 'aivisibilitychecker', title: 'AI Visibility Checker', price: '\$19 / Mo', priceNum: 19,
    cat: 'Productivity', platform: 'Web',
    tag: 'Find out if your business shows up when people ask AI chatbots like ChatGPT.',
    desc: 'Checks if your brand appears in AI chatbot responses and tracks visibility over time.',
    users: '0', usersNum: 0, shipped: '2026-04-20',
    accent: '#a78bfa',
  },
  {
    id: 'rulebotai', title: 'RuleBot AI', price: '\$4.99 / Mo', priceNum: 4.99,
    cat: 'Productivity', platform: 'Web',
    tag: 'An AI chatbot that follows YOUR rules, not its own judgment.',
    desc: 'Set custom rules and constraints for your AI assistant so it stays on-brand.',
    users: '0', usersNum: 0, shipped: '2026-04-20',
    accent: '#fbbf24',
  },
];

const DEMO_MAP = {
  essaycloner:  () => window.EssayClonerDemo,
  studypebble:  () => window.StudyPebbleDemo,
  shadowshield: () => window.ShadowShieldDemo,
  trafficguard: () => window.TrafficGuardDemo,
  wholefed:     () => window.WholefedDemo,
  feastmate:    () => window.FeastmateDemo,
  whowasright:  null,
  flowdebug:    null,
};


const TOOL_URLS = {
  essaycloner: '/essaycloner',
  studypebble: '/studypebble',
  shadowshield: '/shadowshield',
  trafficguard: '/trafficguard',
  wholefed: 'https://apps.apple.com/app/wholefed',
  feastmate: 'https://apps.apple.com/us/app/feastmate-ai-recipe-generator/id6738283833',
  whowasright: '/whowasright',
  flowdebug: '/flowdebug',
  whomealplanner: '/whomealplanner',
  arrpower: '/arrpower',
  aivisibilitychecker: '/aivisibilitychecker',
  rulebotai: '/rulebotai',
};
function toolUrl(id, url) { return url || TOOL_URLS[id] || '/' + id; }
function toolTarget(id, url) {
  const u = url || TOOL_URLS[id] || '';
  return u.startsWith('http') ? '_blank' : '_top';
}

const CATEGORIES = ['All', 'Education', 'Health', 'Security', 'Productivity', 'Relationships', 'iOS Apps'];
const SORTS = ['Newest', 'Most Popular', 'Price (Low)'];

/* ============ Filtering ============ */
function filterTools(tools, { cat, q, sort }) {
  let out = tools;
  if (cat !== 'All') {
    out = out.filter(t => {
      if (cat === 'iOS Apps') return t.platform === 'iOS';
      return t.cat === cat;
    });
  }
  if (q) {
    const needle = q.toLowerCase().trim();
    out = out.filter(t =>
      t.title.toLowerCase().includes(needle) ||
      t.tag.toLowerCase().includes(needle) ||
      t.cat.toLowerCase().includes(needle)
    );
  }
  if (sort === 'Newest') {
    out = [...out].sort((a, b) => b.shipped.localeCompare(a.shipped));
  } else if (sort === 'Most Popular') {
    out = [...out].sort((a, b) => b.usersNum - a.usersNum);
  } else if (sort === 'Price (Low)') {
    out = [...out].sort((a, b) => a.priceNum - b.priceNum);
  }
  return out;
}

function fmtDate(s) {
  const [y, m, d] = s.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[+m - 1]} ${+d}, ${y}`;
}

/* ============ Hero ============ */
function ToolsHero({ count }) {
  return (
    <header className="tools-hero">
      <div className="container">
        <div className="tools-hero-chip">
          <span className="pulse-green" /> LIVE DIRECTORY
        </div>
        <h1 className="tools-hero-title">
          Every Tool I've Built.
        </h1>
        <p className="tools-hero-sub">
          <span className="tools-hero-count">{count}</span> live and counting. New ones ship daily.
        </p>
      </div>
    </header>
  );
}

/* ============ Sticky Filter Bar ============ */
function FilterBar({ cat, setCat, sort, setSort, q, setQ, view, setView, counts }) {
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, []);
  return (
    <>
      <div ref={sentinelRef} className="tools-filter-sentinel" />
      <div className={`tools-filter ${stuck ? 'is-stuck' : ''}`}>
        <div className="container tools-filter-inner">
          <div className="tools-search">
            <svg className="tools-search-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <line x1="10.8" y1="10.8" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              className="tools-search-input"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search tools..."
              spellCheck={false}
              autoComplete="off"
            />
            {q && (
              <button className="tools-search-clear" onClick={() => setQ('')} aria-label="Clear">✕</button>
            )}
          </div>
          <div className="tools-cats">
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`tools-cat ${cat === c ? 'active' : ''}`}
                onClick={() => setCat(c)}
              >
                {c}
                {counts[c] != null && <span className="tools-cat-count">{counts[c]}</span>}
              </button>
            ))}
          </div>
          <div className="tools-right-controls">
            <div className="tools-sort">
              {SORTS.map(s => (
                <button
                  key={s}
                  className={`tools-sort-btn ${sort === s ? 'active' : ''}`}
                  onClick={() => setSort(s)}
                >{s}</button>
              ))}
            </div>
            <div className="tools-view-toggle">
              <button
                className={`tools-view-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
                title="List view"
              >
                <span className="tools-view-icon">☰</span> List
              </button>
              <button
                className={`tools-view-btn ${view === 'cat' ? 'active' : ''}`}
                onClick={() => setView('cat')}
                title="Category view"
              >
                <span className="tools-view-icon">⊞</span> Categories
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ Mouse-tracking card glow ============ */
function CardGlow({ children, className = '', accent }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} className={className} onMouseMove={onMove} style={{ '--accent': accent }}>
      {children}
    </div>
  );
}

/* ============ Featured Cards ============ */
function FeaturedRow({ tools }) {
  if (tools.length === 0) return null;
  return (
    <div className="tools-featured">
      <div className="tools-section-label">
        <span className="tools-section-dot" /> Featured
        <span className="tools-section-spacer" />
        <span className="tools-section-note">{tools.length} highlighted</span>
      </div>
      <div className="tools-featured-grid">
        {tools.map((t, i) => {
          const Demo = DEMO_MAP[t.id]?.();
          return (
            <CardGlow key={t.id} className="tools-feat-card" accent={t.accent}>
              <span className="tools-feat-glow" />
              <div className="tools-feat-head">
                <div>
                  <div className="tools-feat-title">{t.title}</div>
                  <div className="tools-feat-cat" style={{ color: t.accent }}>{t.cat}</div>
                </div>
                <div className="tools-feat-price">{t.price}</div>
              </div>
              <div className="tools-feat-tag">{t.tag}</div>
              {Demo && <div className="tools-feat-demo"><Demo /></div>}
              <div className="tools-feat-footer">
                <div className="tools-feat-meta">
                  {t.platform} · {(t.users === '0' || t.users === 0) ? '… users' : (t.users + ' users')} · Launched {fmtDate(t.shipped)}
                </div>
                <a href={toolUrl(t.id, t._url)} target={toolTarget(t.id, t._url)} className="tools-feat-link">Visit →</a>
              </div>
            </CardGlow>
          );
        })}
      </div>
    </div>
  );
}

/* ============ Expandable Row ============ */
function ToolRow({ t, index, isOpen, onToggle }) {
  const Demo = DEMO_MAP[t.id]?.();
  const bodyRef = useRef(null);
  const [bodyHeight, setBodyHeight] = useState(0);

  useEffect(() => {
    if (!bodyRef.current) return;
    if (isOpen) {
      setBodyHeight(bodyRef.current.scrollHeight);
    } else {
      setBodyHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      className={`tools-row ${isOpen ? 'open' : ''}`}
      style={{ '--accent': t.accent, animationDelay: `${index * 35}ms` }}
    >
      <button className="tools-row-head" onClick={onToggle}>
        <span className="tools-row-dot" style={{ background: t.accent }} />
        <div className="tools-row-title-col">
          <div className="tools-row-title">{t.title}</div>
          <div className="tools-row-tag">{t.tag}</div>
        </div>
        <div className="tools-row-cat-pill">{t.cat}</div>
        <div className="tools-row-users">
          <span className="tools-row-users-num">{(t.users === '0' || t.users === 0) ? '…' : t.users}</span>
          <span className="tools-row-users-label">users</span>
        </div>
        <div className="tools-row-price">{t.price}</div>
        <span className={`tools-row-chev ${isOpen ? 'open' : ''}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div
        className="tools-row-body"
        style={{ height: bodyHeight }}
        aria-hidden={!isOpen}
      >
        <div ref={bodyRef} className="tools-row-body-inner">
          <div className="tools-row-body-left">
            <p className="tools-row-desc">{t.desc}</p>
            <div className="tools-row-meta-grid">
              <div className="tools-row-meta">
                <span className="tools-row-meta-label">Launched</span>
                <span className="tools-row-meta-val">{fmtDate(t.shipped)}</span>
              </div>
              <div className="tools-row-meta">
                <span className="tools-row-meta-label">Platform</span>
                <span className="tools-row-meta-val">{t.platform}</span>
              </div>
              <div className="tools-row-meta">
                <span className="tools-row-meta-label">Users</span>
                <span className="tools-row-meta-val">{t.users}</span>
              </div>
              <div className="tools-row-meta">
                <span className="tools-row-meta-label">Price</span>
                <span className="tools-row-meta-val">{t.price}</span>
              </div>
            </div>
            <a
              href={toolUrl(t.id, t._url)}
              target={toolTarget(t.id, t._url)}
              className="tools-row-cta"
              style={{ '--accent': t.accent }}
            >
              Visit {t.title} →
            </a>
          </div>
          {Demo && (
            <div className="tools-row-demo">
              <Demo />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ List View ============ */
function ListView({ tools, expanded, setExpanded }) {
  if (tools.length === 0) return <EmptyState />;
  return (
    <div className="tools-list">
      {tools.map((t, i) => (
        <ToolRow
          key={t.id}
          t={t}
          index={i}
          isOpen={expanded === t.id}
          onToggle={() => setExpanded(expanded === t.id ? null : t.id)}
        />
      ))}
    </div>
  );
}

/* ============ Category View ============ */
function CategoryView({ tools, expanded, setExpanded }) {
  if (tools.length === 0) return <EmptyState />;
  const groups = {};
  tools.forEach(t => {
    if (!groups[t.cat]) groups[t.cat] = [];
    groups[t.cat].push(t);
  });
  const order = ['Education', 'Health', 'Security', 'Productivity'];
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    const ai = order.indexOf(a), bi = order.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  return (
    <div className="tools-cat-view">
      {sortedKeys.map(cat => (
        <CategoryGroup
          key={cat}
          cat={cat}
          tools={groups[cat]}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      ))}
    </div>
  );
}

function CategoryGroup({ cat, tools, expanded, setExpanded }) {
  const [open, setOpen] = useState(true);
  const accent = tools[0]?.accent || '#a78bfa';
  return (
    <section className="tools-cat-group">
      <button className="tools-cat-group-head" onClick={() => setOpen(!open)}>
        <span className="tools-cat-group-chev" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)' }}>▸</span>
        <span className="tools-cat-group-title">{cat}</span>
        <span className="tools-cat-group-count">{tools.length}</span>
        <span className="tools-cat-group-rule" />
        <span className="tools-cat-group-dots">
          {tools.slice(0, 6).map((t, i) => (
            <span key={i} className="tools-cat-group-dot" style={{ background: t.accent }} />
          ))}
        </span>
      </button>
      {open && (
        <div className="tools-cat-group-body">
          {tools.map((t, i) => (
            <ToolRow
              key={t.id}
              t={t}
              index={i}
              isOpen={expanded === t.id}
              onToggle={() => setExpanded(expanded === t.id ? null : t.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ============ Empty State ============ */
function EmptyState() {
  return (
    <div className="tools-empty">
      <div className="tools-empty-mono">
        <span className="tools-empty-prompt">$</span>
        <span className="tools-empty-cmd">find ./tools -match "<span className="tools-empty-query">your query</span>"</span>
      </div>
      <div className="tools-empty-result">0 results.</div>
      <div className="tools-empty-title">No tools match that.</div>
      <div className="tools-empty-sub">Try a different filter — or pitch what you need.</div>
      <a href="/community" target="_top" className="tools-empty-cta">Suggest a tool →</a>
    </div>
  );
}

/* ============ Bottom CTA ============ */
function BottomCTA() {
  return (
    <section className="tools-cta-section">
      <div className="container tools-cta-inner">
        <div className="tools-cta-dot-ring">
          <span className="tools-cta-dot" />
          <span className="tools-cta-ring" />
        </div>
        <h3 className="tools-cta-title">Don't see what you need?</h3>
        <p className="tools-cta-sub">I ship one community-picked tool a week. Pitch yours — if it gets enough votes, I build it.</p>
        <a href="/community" target="_top" className="tools-cta-btn">Suggest A Tool →</a>
      </div>
    </section>
  );
}

/* ============ Page ============ */
function ToolsPage() {
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [q, setQ] = useState('');
  const [view, setView] = useState('list');
  const [expanded, setExpanded] = useState(null);

  // debounce search for animation smoothness
  const [debouncedQ, setDebouncedQ] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 120);
    return () => clearTimeout(t);
  }, [q]);

  // Live tool list from Supabase (falls back to SEED_TOOLS on failure)
  const ALL_TOOLS = window.useToolLibrarySupabase(SEED_TOOLS, (r) => {
    const price = r.price || 'Free';
    const priceNum = parseFloat((price.match(/\d+(\.\d+)?/) || ['0'])[0]) || 0;
    const platform = price.includes('iOS') ? 'iOS' : 'Web';
    return {
      id: r.slug,
      title: r.title,
      price,
      priceNum,
      cat: r.cat,
      platform,
      tag: r.tagline,
      desc: r.tagline,
      featured: !!r.featured,
      community: !!r.community,
      users: r.users,
      usersNum: parseFloat((r.users || '0').replace('k', '')) * ((r.users || '').includes('k') ? 1000 : 1),
      shipped: r.shipped_at || '2026-01-01',
      accent: r.accent,
      _url: r.url,
    };
  });

  const featured = useMemo(() => ALL_TOOLS.filter(t => t.featured), [ALL_TOOLS]);
  const rest = useMemo(() => ALL_TOOLS, [ALL_TOOLS]);

  const filteredFeatured = useMemo(
    () => filterTools(featured, { cat, q: debouncedQ, sort }),
    [cat, debouncedQ, sort, featured]
  );
  const filteredRest = useMemo(
    () => filterTools(rest, { cat, q: debouncedQ, sort }),
    [cat, debouncedQ, sort, rest]
  );
  const filteredAll = useMemo(
    () => filterTools(ALL_TOOLS, { cat, q: debouncedQ, sort }),
    [cat, debouncedQ, sort, ALL_TOOLS]
  );

  const counts = useMemo(() => {
    const c = { All: ALL_TOOLS.length };
    CATEGORIES.slice(1).forEach(cat => {
      c[cat] = ALL_TOOLS.filter(t => cat === 'iOS Apps' ? t.platform === 'iOS' : t.cat === cat).length;
    });
    return c;
  }, [ALL_TOOLS]);

  const totalMatches = view === 'cat' ? filteredAll.length : filteredFeatured.length + filteredRest.length;

  return (
    <>
      <SharedNav current="tools" />
      <ToolsHero count={ALL_TOOLS.length} />
      <FilterBar
        cat={cat} setCat={setCat}
        sort={sort} setSort={setSort}
        q={q} setQ={setQ}
        view={view} setView={setView}
        counts={counts}
      />
      <main className="tools-main">
        <div className="container">
          <div className="tools-results-bar">
            <div className="tools-results-count">
              Showing <span className="tools-results-num">{totalMatches}</span> of {ALL_TOOLS.length}
              {cat !== 'All' && <span className="tools-results-pill">in <b>{cat}</b></span>}
              {debouncedQ && <span className="tools-results-pill">for <b>"{debouncedQ}"</b></span>}
            </div>
            <div className="tools-results-meta">
              Sorted by <b>{sort}</b>
            </div>
          </div>

          {view === 'list' && (
            <>
              {filteredFeatured.length > 0 && <FeaturedRow tools={filteredFeatured} />}
              <div className="tools-section-label">
                <span className="tools-section-dot tools-section-dot-all" /> All Tools
                <span className="tools-section-spacer" />
                <span className="tools-section-note">{filteredRest.length} {filteredRest.length === 1 ? 'tool' : 'tools'}</span>
              </div>
              <ListView tools={filteredRest} expanded={expanded} setExpanded={setExpanded} />
            </>
          )}

          {view === 'cat' && (
            <CategoryView tools={filteredAll} expanded={expanded} setExpanded={setExpanded} />
          )}
        </div>
      </main>
      <BottomCTA />
      <SharedFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ToolsPage />);
