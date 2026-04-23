const { useState, useEffect, useRef } = React;

/* ============ Cycling tool name (hero) ============ */
function MorphingWord() {
  const words = [
    'Essays in Your Voice',
    'Adaptive Study Guides',
    'AI Privacy Shields',
    'SEO Decay Reports',
    'Food Intelligence',
    'Macro-Precise Recipes',
  ];
  const [i, setI] = useState(0);
  const [shown, setShown] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    const target = words[i];
    let id;
    if (phase === 'typing') {
      if (shown.length < target.length) {
        id = setTimeout(() => setShown(target.slice(0, shown.length + 1)), 38);
      } else {
        id = setTimeout(() => setPhase('hold'), 1600);
      }
    } else if (phase === 'hold') {
      id = setTimeout(() => setPhase('deleting'), 500);
    } else if (phase === 'deleting') {
      if (shown.length > 0) {
        id = setTimeout(() => setShown(shown.slice(0, -1)), 22);
      } else {
        setI((i + 1) % words.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(id);
  }, [shown, phase, i]);

  return <span className="morph">{shown || '\u00A0'}</span>;
}

/* ============ Days-since counter ============ */
const START_DATE = '2026-04-11'; // a week ago, +1 tool per day
function daysSince(from) {
  const start = new Date(from);
  return Math.max(0, Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24)));
}
function DaysSince({ from }) {
  const [days, setDays] = useState(daysSince(from));
  useEffect(() => {
    const id = setInterval(() => setDays(daysSince(from)), 60_000);
    return () => clearInterval(id);
  }, [from]);
  return <span>{days.toLocaleString()}</span>;
}

/* ============ Cards: glow-following ============ */
function CardGlow({ children, className, accent }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  };
  return (
    <div ref={ref} className={className} onMouseMove={onMove} style={accent ? { '--accent': accent } : {}}>
      {children}
    </div>
  );
}

/* ============ Reveal-on-scroll wrapper ============ */
function Reveal({ children, delay = 0, as: Tag = 'div', className = '', style = {} }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      // no ref yet, just reveal
      const t = setTimeout(() => setShown(true), delay);
      return () => clearTimeout(t);
    }
    const reveal = () => setTimeout(() => setShown(true), delay);
    const r = el.getBoundingClientRect();
    // if already visible or already scrolled past, reveal immediately
    if (r.top < window.innerHeight + 200) {
      reveal();
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          reveal();
          io.unobserve(el);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px 10% 0px' });
    io.observe(el);
    // hard fallback — always reveal within 1.5s no matter what
    const fallback = setTimeout(() => setShown(true), 1500 + delay);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, [delay]);
  const inlineStyle = {
    ...style,
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1)',
  };
  return <Tag ref={ref} className={className} style={inlineStyle}>{children}</Tag>;
}

/* ============ Tool data ============
 * SEED_TOOLS is the hardcoded fallback used if the Supabase fetch fails.
 * The live list comes from `tool_library` in Supabase — new pipeline-shipped
 * tools should be upserted there so they appear here automatically.
 */
const SEED_TOOLS = [
  {
    id: 'essaycloner', title: 'EssayCloner', price: '$1.99 / Mo',
    cat: 'Education',
    tag: 'Feed it three of your old essays. It learns how you actually write and drafts new ones that don\'t sound like ChatGPT.',
    meta: 'Web · Launched April 2026', cls: 'card-feat-1',
    featured: true, users: '4.1k', shipped: '2026-04-11',
    accent: '#a78bfa', Demo: window.EssayClonerDemo,
  },
  {
    id: 'studypebble', title: 'Study Pebble', price: '$14.99 / Mo',
    cat: 'Education',
    tag: 'AP and SAT prep that adjusts to what you keep getting wrong. Free response answers get scored against the actual rubric.',
    meta: 'Web · Launched April 2026', cls: 'card-feat-2',
    featured: true, users: '2.4k', shipped: '2026-04-12',
    accent: '#fbbf24', Demo: window.StudyPebbleDemo,
  },
  {
    id: 'shadowshield', title: 'AI Shadow Shield', price: '$19 / Mo',
    cat: 'Security',
    tag: 'Quietly checks the apps you use at work. Tells you if your company is feeding what you write into a model.',
    meta: 'Web · Launched April 2026',
    users: '860', shipped: '2026-04-13',
    accent: '#ef4444', Demo: window.ShadowShieldDemo,
  },
  {
    id: 'trendscout', title: 'TrendScout', price: 'Waitlist',
    cat: 'Productivity', url: '/trendscout',
    tag: 'Every 7am: the AI news that popped overnight — rewritten as your next TikTok hook. Reddit + HN + ProductHunt + RSS, filtered to your niche, delivered to Telegram.',
    meta: 'Web · Beta 2026-04-23',
    users: '…', shipped: '2026-04-23',
    accent: '#f472b6', Demo: null,
  },
  {
    id: 'trafficguard', title: 'AI Traffic Guard', price: '$29 / Mo',
    cat: 'Productivity',
    tag: 'Watches your top keywords and flags the ones Google AI Overviews are eating. Rewrite before the traffic goes.',
    meta: 'Web · Launched April 2026',
    users: '412', shipped: '2026-04-14',
    accent: '#60a5fa', Demo: window.TrafficGuardDemo,
  },
  {
    id: 'wholefed', title: 'Wholefed', price: 'Free · iOS',
    cat: 'Health',
    tag: 'Take a photo of what you\'re about to eat. Get back a real read on it, not just a calorie number.',
    meta: 'iOS · Launched April 2026',
    users: '11.2k', shipped: '2026-04-15', community: true,
    accent: '#22c55e', Demo: window.WholefedDemo,
  },
  {
    id: 'feastmate', title: 'Feastmate', price: '$4.99 / Mo',
    cat: 'Health',
    tag: 'Plug in your macro targets. Get back a real recipe that hits them, not a vague suggestion you have to math out.',
    meta: 'iOS · Launched April 2026',
    users: '1.8k', shipped: '2026-04-16',
    accent: '#f472b6', Demo: window.FeastmateDemo,
  },
  {
    id: 'whowasright', title: 'WhoWasRight', price: 'Free',
    cat: 'Relationships',
    tag: 'Paste a text argument. AI breaks down who was right, what manipulation tactics were used, and scores each person on 10 dimensions.',
    meta: 'Web · Launched April 2026',
    users: '320', shipped: '2026-04-15',
    accent: '#8b5cf6', Demo: function() { return React.createElement('div', {style:{padding:16,fontSize:13,color:'var(--text-2)'}}, 'Person A: 62% · Person B: 38%'); },
  },
  {
    id: 'flowdebug', title: 'FlowDebug', price: '$29 / Mo',
    cat: 'Productivity',
    tag: 'When your Make.com automations break at 3 AM, this shows you exactly what data went where and what failed.',
    meta: 'Web · Launched April 2026',
    users: '89', shipped: '2026-04-16',
    accent: '#14b8a6', Demo: function() { return React.createElement('div', {style:{padding:16,fontSize:13,color:'var(--text-2)'}}, 'Scan: 3 workflows · 1 failure detected'); },
  },
  {
    id: 'whomealplanner', title: 'WHO Meal Planner', price: '$4.99 / Mo',
    cat: 'Health',
    tag: 'Converts WHO nutrition guidelines into personalized weekly meal plans with grocery lists.',
    meta: 'Web · Launched April 2026',
    users: '0', shipped: '2026-04-19',
    accent: '#22c55e', Demo: function() { return React.createElement('div', {style:{padding:16,fontSize:13,color:'var(--text-2)'}}, 'Mon: Grilled salmon + quinoa · 2,100 cal · $8.40'); },
  },
  {
    id: 'arrpower', title: 'ArrPower', price: '$9.99 / Mo',
    cat: 'Productivity',
    tag: 'Stop your drives from spinning at 3AM. Schedule Radarr and Sonarr tasks intelligently so your hardware rests when you sleep.',
    meta: 'Web · Launched April 2026',
    users: '0', shipped: '2026-04-20',
    accent: '#60a5fa', Demo: function() { return React.createElement('div', {style:{padding:16,fontSize:13,color:'var(--text-2)'}}, 'Next run: 02:00 · 4 tasks queued'); },
  },
  {
    id: 'aivisibilitychecker', title: 'AI Visibility Checker', price: '$19 / Mo',
    cat: 'Productivity',
    tag: 'Find out if your business shows up when people ask AI chatbots like ChatGPT. Track visibility over time.',
    meta: 'Web · Launched April 2026',
    users: '0', shipped: '2026-04-20',
    accent: '#a78bfa', Demo: function() { return React.createElement('div', {style:{padding:16,fontSize:13,color:'var(--text-2)'}}, 'ChatGPT: ✓ mentioned · Claude: ✗ missing'); },
  },
  {
    id: 'rulebotai', title: 'RuleBot AI', price: '$4.99 / Mo',
    cat: 'Productivity',
    tag: 'An AI chatbot that follows YOUR rules, not its own judgment. Set custom constraints so it stays on-brand.',
    meta: 'Web · Launched April 2026',
    users: '0', shipped: '2026-04-20',
    accent: '#fbbf24', Demo: function() { return React.createElement('div', {style:{padding:16,fontSize:13,color:'var(--text-2)'}}, '3 rules active · 0 violations'); },
  },
];


// Map tool IDs to the real production URL the user should land on.
// Always use the final destination — never the /toolname wrapper — so the
// browser doesn't do an alekotools → vercel.app hop (which triggers
// Vercel's SSO "authenticating" flash on any project with deployment
// protection on).
const TOOL_URLS = {
  essaycloner: "https://essaycloner.vercel.app",
  studypebble: "https://studypebble.com",
  studyacorn: "https://studypebble.com",
  shadowshield: "https://ai-shadow-shield.vercel.app",
  trafficguard: "https://ai-traffic-guard.vercel.app",
  wholefed: "https://apps.apple.com/app/wholefed",
  feastmate: "https://apps.apple.com/us/app/feastmate-ai-recipe-generator/id6738283833",
  whowasright: "https://argument-analyzer-ten.vercel.app",
  flowdebug: "https://flowdebug.vercel.app",
  whomealplanner: "https://who-meal-planner.vercel.app",
  arrpower: "https://arrpower.vercel.app",
  rulebotai: "https://rulebot-ai.vercel.app",
  conftrack: "https://conftrack.vercel.app",
  "cardio-sweet-spot": "https://cardio-sweet-spot.vercel.app",
  "claude-version-lock": "https://claude-version-lock.vercel.app",
  "product-animator-pro": "https://product-animator-pro.vercel.app",
};
function toolUrl(id, url) {
  if (url && url.startsWith('http')) return url;
  if (url && url.startsWith('/')) return url;
  return TOOL_URLS[id] || url || ('/' + id);
}
// Open external (http*) in new tab, same-origin (/…) in same tab.
function toolExternal(id, url) {
  const u = url || TOOL_URLS[id] || '';
  return u.startsWith('http');
}

/* ============ Supabase-backed tool fetch ============
 * Reads `tool_library` (public SELECT policy). Maps rows onto the shape
 * SEED_TOOLS uses. Falls back to SEED_TOOLS on any error or empty response.
 * Demos are keyed by slug so pipeline tools without hand-built demos render
 * a simple placeholder.
 */
const SB_URL = 'https://fdnbotpgodpcgqtojnrm.supabase.co';
const SB_KEY = 'sb_publishable_EXP_ArZJG1-dDSY240-ZdQ_91x4KdbQ';

const DEMOS_BY_SLUG = {
  essaycloner: () => window.EssayClonerDemo,
  studypebble: () => window.StudyPebbleDemo,
  shadowshield: () => window.ShadowShieldDemo,
  trafficguard: () => window.TrafficGuardDemo,
  wholefed: () => window.WholefedDemo,
  feastmate: () => window.FeastmateDemo,
};

function placeholderDemo(tagline) {
  return function Demo() {
    return React.createElement('div', { style: { padding: 16, fontSize: 13, color: 'var(--text-2)' } }, tagline);
  };
}

function rowToTool(r) {
  const demoFactory = DEMOS_BY_SLUG[r.slug];
  const Demo = (demoFactory && demoFactory()) || placeholderDemo(r.tagline);
  const platform = (r.price || '').includes('iOS') ? 'iOS' : 'Web';
  const shipped = r.shipped_at || '2026-01-01';
  const month = new Date(shipped).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  return {
    id: r.slug,
    title: r.title,
    price: r.price,
    cat: r.cat,
    tag: r.tagline,
    meta: platform + ' · Launched ' + month,
    featured: !!r.featured,
    users: r.users,
    shipped: shipped,
    community: !!r.community,
    accent: r.accent,
    url: r.url,
    Demo: Demo,
  };
}

function useToolLibrary() {
  const [tools, setTools] = useState(SEED_TOOLS);
  useEffect(() => {
    let cancelled = false;
    // Newest-first. shipped_at DESC with created_at as tiebreaker so same-day
    // ships show in actual deploy order, not arbitrary Postgres order.
    fetch(SB_URL + '/rest/v1/tool_library?select=*&visible=eq.true&order=shipped_at.desc,created_at.desc', {
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY },
    })
      .then(r => r.ok ? r.json() : null)
      .then(rows => {
        if (cancelled || !Array.isArray(rows) || rows.length === 0) return;
        setTools(rows.map(rowToTool));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return tools;
}

const WIP = [
  { tag: 'Shipping This Week', title: 'Tabby', desc: 'My tabs got out of hand. So I\'m building a thing that summarizes them and closes the dead ones for me.', pct: 78, eta: 'Friday', accent: '#fbbf24', icon: '⌘' },
  { tag: 'Building', title: 'Quietmail', desc: 'I hate getting pinged for things that aren\'t urgent. This batches the noise and only surfaces what actually matters.', pct: 41, eta: 'May', accent: '#60a5fa', icon: '✉' },
  { tag: 'Sketching', title: 'Loom For Money', desc: 'I want to see where my money actually goes without setting up 14 categories. Still figuring out the shape of it.', pct: 12, eta: 'Q3', accent: '#22c55e', icon: '$' },
];

/* ============ Shipping Dashboard ============ */
function ShippingDashboard() {
  const [pulse, setPulse] = useState(false);
  const [count, setCount] = useState(8);

  useEffect(() => {
    // Source of truth for "tools shipped" is tool_library (visible only) so
    // this number always matches the count shown on /tools and in the tool
    // library section below. The old "6 manual + deployed" heuristic drifted
    // (double-counted, ignored Alekotools being a site not a tool).
    const SB_URL = 'https://fdnbotpgodpcgqtojnrm.supabase.co';
    const SB_KEY = 'sb_publishable_EXP_ArZJG1-dDSY240-ZdQ_91x4KdbQ';
    fetch(SB_URL + '/rest/v1/tool_library?select=slug&visible=eq.true', {
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY },
    })
      .then(r => r.json())
      .then(data => {
        const total = Array.isArray(data) ? data.length : 0;
        if (total > 0) setCount(total);
        setPulse(true);
        setTimeout(() => setPulse(false), 400);
      })
      .catch(() => {});
  }, []);

  // 14-day commit heatmap (your contribution graph)
  const days = 14;
  const heat = [3, 5, 2, 7, 4, 8, 6, 11, 9, 5, 12, 7, 14, 9];
  const maxHeat = Math.max(...heat);
  const heatColor = (v) => {
    if (v === 0) return 'rgba(255,255,255,0.04)';
    const t = v / maxHeat;
    // cool blue → warm orange as commits ramp
    return `oklch(${0.55 + t * 0.2} ${0.12 + t * 0.08} ${250 - t * 200})`;
  };

  // Live activity feed from Supabase
  const [activity, setActivity] = useState([]);
  const kindColor = { build: '#fbbf24', deploy: '#22c55e', evaluate: '#60a5fa', blog: '#a78bfa', scout: '#22d3ee' };

  useEffect(() => {
    const SB_URL = 'https://fdnbotpgodpcgqtojnrm.supabase.co';
    const SB_KEY = 'sb_publishable_EXP_ArZJG1-dDSY240-ZdQ_91x4KdbQ';
    const headers = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY };

    // Fetch last 5 agent runs
    fetch(SB_URL + '/rest/v1/agent_runs?order=started_at.desc&limit=8&select=agent,status,stats,started_at', { headers })
      .then(r => r.json())
      .then(runs => {
        if (!Array.isArray(runs)) return;
        const items = runs.map(r => {
          const ago = Math.floor((Date.now() - new Date(r.started_at).getTime()) / 60000);
          const t = ago < 60 ? ago + 'm' : ago < 1440 ? Math.floor(ago/60) + 'h' : 'Yesterday';
          const stats = r.stats || {};
          let detail = r.status === 'completed' ? 'Completed' : r.status;
          if (r.agent === 'scout') detail = (stats.stored || stats.found || 0) + ' problems found';
          else if (r.agent === 'builder') detail = (stats.built || 0) + ' MVPs built';
          else if (r.agent === 'publisher') detail = (stats.deployed || 0) + ' deployed';
          else if (r.agent === 'evaluator') detail = (stats.evaluated || 0) + ' evaluated';
          else if (r.agent === 'blog-writer') detail = (stats.written || 0) + ' posts written';
          const kind = r.agent === 'builder' ? 'build' : r.agent === 'publisher' ? 'deploy' : r.agent === 'evaluator' ? 'evaluate' : r.agent === 'blog-writer' ? 'blog' : 'scout';
          return { t, label: r.agent.charAt(0).toUpperCase() + r.agent.slice(1).replace('-', ' '), kind, detail: detail.charAt(0).toUpperCase() + detail.slice(1) };
        });
        setActivity(items);
      })
      .catch(() => {});

    // Refresh every 30s
    const id = setInterval(() => {
      fetch(SB_URL + '/rest/v1/agent_runs?order=started_at.desc&limit=8&select=agent,status,stats,started_at', { headers })
        .then(r => r.json())
        .then(runs => {
          if (!Array.isArray(runs)) return;
          const items = runs.map(r => {
            const ago = Math.floor((Date.now() - new Date(r.started_at).getTime()) / 60000);
            const t = ago < 60 ? ago + 'm' : ago < 1440 ? Math.floor(ago/60) + 'h' : 'Yesterday';
            const stats = r.stats || {};
            let detail = r.status === 'completed' ? 'Completed' : r.status;
            if (r.agent === 'scout') detail = (stats.stored || stats.found || 0) + ' problems found';
            else if (r.agent === 'builder') detail = (stats.built || 0) + ' MVPs built';
            else if (r.agent === 'publisher') detail = (stats.deployed || 0) + ' deployed';
            else if (r.agent === 'evaluator') detail = (stats.evaluated || 0) + ' evaluated';
            else if (r.agent === 'blog-writer') detail = (stats.written || 0) + ' posts written';
            const kind = r.agent === 'builder' ? 'build' : r.agent === 'publisher' ? 'deploy' : r.agent === 'evaluator' ? 'evaluate' : r.agent === 'blog-writer' ? 'blog' : 'scout';
            return { t, label: r.agent.charAt(0).toUpperCase() + r.agent.slice(1).replace('-', ' '), kind, detail: detail.charAt(0).toUpperCase() + detail.slice(1) };
          });
          setActivity(items);
        })
        .catch(() => {});
    }, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="dash">
      <div className="dash-row">
        <div className="dash-stat dash-stat-hero">
          <div className="dash-stat-label">
            <span className="pulse-green" /> Tools Shipped
          </div>
          <div className={`dash-stat-value ${pulse ? 'pulsing' : ''}`}>
            {count}
          </div>
          <div className="dash-stat-sub">+1 Per Day, Every Day</div>
        </div>

        <div className="dash-divider" />

        <div className="dash-stat">
          <div className="dash-stat-label">Days Building</div>
          <div className="dash-stat-value-sm"><DaysSince from={START_DATE} /></div>
          <div className="dash-stat-sub">Since First Launch</div>
        </div>

        <div className="dash-heatmap">
          <div className="dash-stat-label" style={{ marginBottom: 10 }}>Commits · Last 14d</div>
          <div className="heat-grid">
            {heat.map((v, i) => (
              <div key={i}
                className="heat-cell"
                style={{ background: heatColor(v), animationDelay: `${i * 35}ms` }}
                title={`${v} commits`}>
                <span className="heat-tip">{v}</span>
              </div>
            ))}
          </div>
          <div className="dash-stat-sub" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span>{heat.reduce((a,b) => a+b, 0)} Total</span>
            <span style={{ color: '#fb923c' }}>↑ Trending</span>
          </div>
        </div>
      </div>

      <div className="dash-feed">
        <div className="dash-feed-header">
          <span className="section-label" style={{ margin: 0 }}>
            <span className="pulse-green" /> Live Activity
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Auto-Refreshing</span>
        </div>
        <div className="dash-feed-list">
          {activity.map((a, i) => (
            <div key={i} className="dash-feed-row" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="dash-feed-dot" style={{ background: kindColor[a.kind] }} />
              <span className="dash-feed-time">{a.t}</span>
              <span className="dash-feed-label">{a.label}</span>
              <span className="dash-feed-detail">{a.detail}</span>
              <span className="dash-feed-kind" style={{ color: kindColor[a.kind] }}>{a.kind.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      <RecentUpdates />
    </div>
  );
}

/* ============ Recent Updates Timeline ============ */
const UPDATE_TAG_COLOR = {
  LAUNCH:  '#22c55e',
  FEATURE: '#a78bfa',
  FIX:     '#fbbf24',
  UPDATE:  '#60a5fa',
};
const UPDATE_TOOL_COLOR = {
  'EssayCloner':   '#a78bfa',
  'Study Pebble':  '#60a5fa',
  'Shadow Shield': '#22c55e',
  'Traffic Guard': '#fbbf24',
  'Wholefed':      '#f472b6',
  'Feastmate':     '#fb923c',
  'Core':          '#9ca3af',
};
// Recent Updates reads from tool_library (NOT built_projects). tool_library
// is the curated source of truth — alekotools and slug-variant dupes are
// already hidden there via `visible=false`, and `shipped_at` holds the real
// first-ship date (unlike built_projects.created_at, which reflects when the
// row was last re-deployed).
//
// Ordering: shipped_at DESC, created_at DESC. Newest at the top (reverse-chron
// — standard feed order).
let RECENT_UPDATES = [];
(function loadUpdates() {
  const SB_URL = 'https://fdnbotpgodpcgqtojnrm.supabase.co';
  const SB_KEY = 'sb_publishable_EXP_ArZJG1-dDSY240-ZdQ_91x4KdbQ';
  const headers = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY };
  fetch(
    SB_URL +
    '/rest/v1/tool_library?select=slug,title,tagline,shipped_at,created_at' +
    '&visible=eq.true' +
    '&order=shipped_at.desc,created_at.desc',
    { headers }
  )
    .then(r => r.json())
    .then(rows => {
      if (!Array.isArray(rows)) return;
      RECENT_UPDATES = rows.map(r => {
        const d = new Date(r.shipped_at || r.created_at);
        return {
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          tool: r.title,
          tag: 'LAUNCH',
          text: r.tagline || 'New tool shipped',
        };
      });
    })
    .catch(() => {});
})();

function RecentUpdates() {
  return (
    <div className="dash-updates">
      <div className="dash-feed-header">
        <span className="section-label" style={{ margin: 0 }}>
          <span className="dash-updates-dot" /> Recent Updates
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          Last {RECENT_UPDATES.length} Shipped · Scroll For More
        </span>
      </div>
      <div className="dash-updates-list">
        {RECENT_UPDATES.map((u, i) => (
          <div key={i} className="dash-update-row" style={{ animationDelay: `${i * 50}ms` }}>
            <span className="dash-update-date">{u.date}</span>
            <span
              className="dash-update-tool-dot"
              style={{ background: UPDATE_TOOL_COLOR[u.tool] || '#9ca3af' }}
            />
            <span className="dash-update-tool">{u.tool}</span>
            <span className="dash-update-text">{u.text}</span>
            <span
              className="dash-update-tag"
              style={{
                color: UPDATE_TAG_COLOR[u.tag],
                borderColor: UPDATE_TAG_COLOR[u.tag] + '55',
                background: UPDATE_TAG_COLOR[u.tag] + '12',
              }}
            >{u.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Suggestion Form ============ */
function SuggestForm() {
  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [votedIds, setVotedIds] = useState(new Set());
  const [sortBy, setSortBy] = useState('votes');

  const SB_URL = 'https://fdnbotpgodpcgqtojnrm.supabase.co';
  const SB_KEY = 'sb_publishable_EXP_ArZJG1-dDSY240-ZdQ_91x4KdbQ';
  const sbHeaders = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' };

  const loadIdeas = () => {
    const order = sortBy === 'votes' ? 'votes.desc' : 'created_at.desc';
    const limit = showAll ? 20 : 4;
    fetch(SB_URL + '/rest/v1/suggestions?status=eq.open&order=' + order + '&limit=' + limit + '&select=id,idea,votes,name,created_at', { headers: sbHeaders })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const colors = ['#a78bfa', '#22c55e', '#fbbf24', '#60a5fa', '#f472b6', '#14b8a6', '#ef4444', '#fb923c'];
          setIdeas(data.map((d, i) => ({ id: d.id, t: d.idea, votes: d.votes || 0, color: colors[i % colors.length], name: d.name })));
        }
      })
      .catch(() => {});
  };

  useEffect(() => { loadIdeas(); }, [showAll, sortBy]);

  const upvote = (id) => {
    if (votedIds.has(id)) return;
    setVotedIds(prev => new Set(prev).add(id));
    setIdeas(prev => prev.map(s => s.id === id ? { ...s, votes: s.votes + 1 } : s));
    fetch(SB_URL + '/rest/v1/rpc/increment_vote', {
      method: 'POST', headers: sbHeaders,
      body: JSON.stringify({ suggestion_id: id }),
    }).catch(() => {
      // Fallback: direct update if RPC doesn't exist
      const item = ideas.find(s => s.id === id);
      if (item) {
        fetch(SB_URL + '/rest/v1/suggestions?id=eq.' + id, {
          method: 'PATCH', headers: { ...sbHeaders, Prefer: 'return=minimal' },
          body: JSON.stringify({ votes: item.votes + 1 }),
        }).catch(() => {});
      }
    });
  };

  const submit = (e) => {
    e.preventDefault();
    if (!idea.trim()) return;
    fetch(SB_URL + '/rest/v1/suggestions', {
      method: 'POST', headers: { ...sbHeaders, Prefer: 'return=minimal' },
      body: JSON.stringify({ name: name.trim() || 'Anonymous', idea: idea.trim(), email: email.trim() || null }),
    }).then(() => {
      setSent(true);
      setTimeout(() => { setSent(false); setName(''); setIdea(''); setEmail(''); loadIdeas(); }, 2500);
    }).catch(() => { setSent(true); setTimeout(() => setSent(false), 2500); });
  };
  return (
    <section className="section suggest-section" id="suggest">
      <div className="container">
        <div className="suggest-grid">
          <Reveal>
            <div className="section-label">Your Turn</div>
            <h2 className="section-title">Tell Me What To Build Next.</h2>
            <p className="section-desc">
              I read every one. The most-voted idea each month gets prototyped on stream.
              No catch, no marketing list.
            </p>
            <div className="suggest-poll">
              <div className="suggest-poll-label">Top Voted Right Now</div>
              {ideas.map((s, i) => (
                <div key={i} className="suggest-row">
                  <div className="suggest-row-bar" style={{ width: `${(s.votes / 50) * 100}%`, background: s.color }} />
                  <span className="suggest-row-text">{s.t}</span>
                  <button onClick={() => upvote(s.id)} style={{background:"none",border:"none",color:votedIds.has(s.id)?"#22c55e":"var(--text-2)",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"inherit"}}>{s.votes} {votedIds.has(s.id)?"✓":"↑"}</button>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <form className={`suggest-form ${sent ? 'sent' : ''}`} onSubmit={submit}>
              <div className="suggest-form-head">
                <span className="suggest-form-tag">Suggest A Tool</span>
                <span className="suggest-form-meta">Anonymous · Free</span>
              </div>
              <label className="suggest-field">
                <span>Your Name <em>(Optional)</em></span>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Anonymous Hero" />
              </label>
              <label className="suggest-field">
                <span>What Should I Build?</span>
                <textarea
                  rows="4"
                  value={idea}
                  onChange={e => setIdea(e.target.value)}
                  placeholder="Describe the problem first. What annoys you. Then what you wish existed."
                  required
                />
                <span className="suggest-counter">{idea.length} / 280</span>
              </label>
              <label className="suggest-field">
                <span>Email <em>(So I Can Tell You If I Build It)</em></span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@somewhere.com" />
              </label>
              <button type="submit" className="suggest-submit" disabled={sent}>
                {sent ? '✓ Got It. I\'ll Read This Tonight.' : 'Send The Idea →'}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============ Tool Library (scalable) ============ */
function ToolLibrary() {
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [expanded, setExpanded] = useState(null);
  const [query, setQuery] = useState('');

  const cats = ['All', 'Education', 'Health', 'Security', 'Productivity', 'Community Picks'];

  const TOOLS = useToolLibrary();
  const featured = TOOLS.filter(t => t.featured);
  const rest = TOOLS; // show every tool in the library (featured still render on top)

  let filteredRest = rest.filter(t => {
    if (cat === 'All') return true;
    if (cat === 'Community Picks') return t.community;
    return t.cat === cat;
  });
  if (query) {
    const q = query.toLowerCase();
    filteredRest = filteredRest.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.tag.toLowerCase().includes(q) ||
      t.cat.toLowerCase().includes(q)
    );
  }
  if (sort === 'Newest') {
    filteredRest = [...filteredRest].sort((a, b) => b.shipped.localeCompare(a.shipped));
  } else if (sort === 'Popular') {
    const toNum = (u) => parseFloat(u) * (u.includes('k') ? 1000 : 1);
    filteredRest = [...filteredRest].sort((a, b) => toNum(b.users) - toNum(a.users));
  }

  const catCount = (c) => {
    if (c === 'All') return rest.length;
    if (c === 'Community Picks') return rest.filter(t => t.community).length;
    return rest.filter(t => t.cat === c).length;
  };

  return (
    <section className="section section-library" id="tools">
      <div className="container">
        <Reveal>
          <div className="lib-head">
            <div>
              <div className="section-label">Tool Library</div>
              <h2 className="section-title">The Stuff People Are Actually Paying For.</h2>
              <p className="section-desc">
                I ship a new tool every day, so this list keeps growing. Two featured up top, the rest in the library below. Filter, search, expand the ones you want to see working.
              </p>
            </div>
            <div className="lib-counter">
              <div className="lib-counter-num">{TOOLS.length}</div>
              <div className="lib-counter-label">Live Tools<br/>And Counting</div>
            </div>
          </div>
        </Reveal>

        {/* FEATURED */}
        <div className="lib-featured-label">
          <span className="section-label" style={{ margin: 0 }}>Featured Tools</span>
          <span className="lib-divider-line" />
          <span className="lib-featured-count">{featured.length} Of {TOOLS.length}</span>
        </div>
        <div className="lib-featured">
          {featured.map((t, i) => (
            <Reveal key={t.id} delay={i * 60} className={`card card-feat-${i + 1}`}>
              <CardGlow className="card-inner" accent={t.accent}>
                <span className="card-accent" />
                <div className="card-head">
                  <div className="card-title">{t.title}</div>
                  <div className="card-cat-pill" style={{ color: t.accent, borderColor: t.accent + '40' }}>{t.cat}</div>
                </div>
                <div className="card-tagline">{t.tag}</div>
                <div className="card-demo"><t.Demo /></div>
                <div className="card-footer card-footer-simple">
                  <a className="card-link card-link-btn" href={toolUrl(t.id, t.url)} target={toolExternal(t.id, t.url) ? "_blank" : "_top"} style={{ '--accent': t.accent }}>Visit →</a>
                </div>
              </CardGlow>
            </Reveal>
          ))}
        </div>

        {/* CONTROLS */}
        <Reveal delay={60}>
          <div className="lib-controls">
            <div className="lib-cats">
              {cats.map(c => (
                <button key={c} className={`lib-cat ${cat === c ? 'active' : ''}`} onClick={() => { setCat(c); setExpanded(null); }}>
                  {c}
                  <span className="lib-cat-count">{catCount(c)}</span>
                </button>
              ))}
            </div>
            <div className="lib-controls-right">
              <div className="lib-search">
                <span className="lib-search-icon">⌕</span>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search tools..."
                />
              </div>
              <div className="lib-sort">
                {['Newest', 'Popular'].map(s => (
                  <button key={s} className={`lib-sort-btn ${sort === s ? 'active' : ''}`} onClick={() => setSort(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* LIBRARY ROWS — each row is a direct link to the tool. No more
            expand/collapse; clicking anywhere on the row opens the tool in
            a new tab. */}
        <div className="lib-rows">
          {filteredRest.length === 0 && (
            <div className="lib-empty">No tools match that. Try a different filter.</div>
          )}
          {filteredRest.slice(0, 5).map((t, i) => (
            <Reveal key={t.id} delay={i * 40} className="lib-row" style={{ '--accent': t.accent }}>
              <a
                className="lib-row-head lib-row-link"
                href={toolUrl(t.id, t.url)}
                target={toolExternal(t.id, t.url) ? "_blank" : "_top"}
                rel={toolExternal(t.id, t.url) ? "noopener noreferrer" : undefined}
              >
                <span className="lib-row-dot" style={{ background: t.accent }} />
                <div className="lib-row-title-col">
                  <div className="lib-row-title">{t.title}</div>
                  <div className="lib-row-tag">{t.tag}</div>
                </div>
                <div className="lib-row-cat" style={{ color: t.accent, borderColor: t.accent + '40' }}>
                  {t.cat}
                </div>
                <span
                  className="lib-row-visit"
                  style={{ background: t.accent, color: '#0a0a0a' }}
                >
                  Visit →
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        {filteredRest.length > 5 && (
          <div className="lib-viewall-wrap">
            <a href="/tools" target="_top" className="lib-viewall-btn">
              View All {filteredRest.length} Tools →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============ Weekly Community Build ============ */
function WeeklyCommunity() {
  const week = {
    weekNum: 2,
    range: 'Apr 14 – Apr 19',
    title: 'WHO Meal Planner',
    tagline: 'Converts WHO nutrition guidelines into personalized weekly meal plans.',
    pitch: '"I want to eat healthier based on WHO guidelines but I have no idea how to actually turn those recommendations into meals I can cook. Every influencer says something different and I just want something I can trust."',
    pitchedBy: '@nutrition_sarah',
    pitchedOn: 'Apr 14, 2026',
    votes: 96,
    chosen: 'Apr 17',
    shipped: 'Apr 19',
    accent: '#22c55e',
    thread: [
      { from: '@nutrition_sarah', when: 'Apr 14', text: 'Original pitch. 12 upvotes in the first day.' },
      { from: 'aleko', when: 'Apr 17', text: 'Picked this one. WHO guidelines are trusted and nobody has made a simple tool for it.' },
      { from: '@nutrition_sarah', when: 'Apr 19', text: 'Just tried it. This is exactly what I needed.' },
    ],
  };

  const past = [
    { week: 1, title: 'Wholefed', by: '@mara_eats', accent: '#22c55e' },
  ];

  return (
    <section className="section section-weekly" id="community">
      <div className="container">
        <Reveal>
          <div className="weekly-head-compact">
            <div className="weekly-head-copy">
              <div className="section-label">
                <span className="pulse-green" /> Weekly Community Build
              </div>
              <h2 className="section-title">Every Week, I Build What You Voted For.</h2>
              <p className="section-desc">
                One tool a week comes straight from the suggestion box. Most-upvoted pitch wins.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <a href="/whomealplanner" target="_top" className="weekly-strip" style={{ '--accent': week.accent }}>
            <span className="weekly-strip-badge">
              W{week.weekNum} · Shipped {week.shipped}
            </span>
            <span className="weekly-strip-main">
              <span className="weekly-strip-title">{week.title}</span>
              <span className="weekly-strip-tagline">{week.tagline}</span>
            </span>
            <span className="weekly-strip-meta">
              <span className="weekly-strip-votes">{week.votes}</span>
              <span className="weekly-strip-votes-label">upvotes</span>
            </span>
            <span className="weekly-strip-arrow">→</span>
          </a>
        </Reveal>

        <Reveal delay={120}>
          <div className="weekly-past-compact">
            {past.map((p, i) => (
              <a key={i} href="#" className="weekly-past-chip" style={{ '--accent': p.accent }}>
                W{p.week} · {p.title} <span className="weekly-past-chip-by">{p.by}</span>
              </a>
            ))}
            <a href="#suggest" className="weekly-past-chip weekly-past-chip-cta">Pitch Next Week →</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ Collaborations ============ */
function CollabSection() {
  const collabs = [
    { name: 'Reply Guy', by: 'w/ @maya (designer)', note: 'She designs, I ship. A tool that drafts replies that don\'t sound desperate.' },
    { name: 'Deckboard', by: 'w/ @theotis (stream)', note: 'Stream overlay that turns chat into quick reactions. We built it in a weekend.' },
    { name: 'Open Slot', by: 'you?', note: 'If you design, teach, create, or have an audience and a problem, send me a DM.', open: true },
  ];
  return (
    <section className="section section-collab" id="collab">
      <div className="container">
        <Reveal>
          <div className="section-label">Collaborations</div>
          <h2 className="section-title">Sometimes, I Build With People.</h2>
          <p className="section-desc">
            I work solo by default, but I'll team up on specific projects. Designers, teachers, and anyone with a real audience and a real problem.
          </p>
        </Reveal>
        <div className="collab-grid">
          {collabs.map((c, i) => (
            <Reveal key={c.name} delay={i * 70} className={`collab-card ${c.open ? 'collab-card-open' : ''}`}>
              <div className="collab-card-head">
                <div className="collab-card-name">{c.name}</div>
                <div className="collab-card-by">{c.by}</div>
              </div>
              <div className="collab-card-note">{c.note}</div>
              {c.open && <a href="#suggest" className="collab-card-cta">Pitch A Collab →</a>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function WIPCard({ w, idx }) {
  const [open, setOpen] = useState(idx === 0);
  return (
    <Reveal delay={idx * 70} className={`wip-card ${open ? 'open' : ''}`} style={{ '--accent': w.accent }}>
      <div className="wip-glow" />
      <button className="wip-card-btn" onClick={() => setOpen(o => !o)}>
        <div className="wip-head">
          <div className="wip-icon" style={{ background: w.accent + '22', color: w.accent, borderColor: w.accent + '55' }}>
            {w.icon}
          </div>
          <div className="wip-tag" style={{ color: w.accent, borderColor: w.accent + '40', background: w.accent + '0d' }}>
            {w.tag}
          </div>
        </div>
        <div className="wip-title-row">
          <div className="wip-title">{w.title}</div>
          <div className="wip-eta">ETA {w.eta} <span className="wip-chev">{open ? '▾' : '▸'}</span></div>
        </div>
        <div className="wip-desc">{w.desc}</div>
        <div className="wip-progress">
          <div className="wip-bar">
            <div className="wip-bar-fill"
              style={{ width: w.pct + '%', background: w.accent, boxShadow: `0 0 12px ${w.accent}80` }} />
          </div>
          <span style={{ color: w.accent, fontWeight: 600 }}>{w.pct}%</span>
        </div>
      </button>

      <div className="wip-detail" style={{ maxHeight: open ? 240 : 0 }}>
        <div className="wip-detail-inner">
          <div className="wip-detail-row">
            <span className="wip-detail-label">Last Commit</span>
            <span className="wip-detail-val">{idx === 0 ? '14 Min Ago' : idx === 1 ? '2 Days Ago' : '6 Days Ago'}</span>
          </div>
          <div className="wip-detail-row">
            <span className="wip-detail-label">Stack</span>
            <span className="wip-detail-val">{idx === 0 ? 'TS, Vite, Chrome MV3' : idx === 1 ? 'Swift, Postgres' : 'Next, Plaid API'}</span>
          </div>
          <div className="wip-detail-row">
            <span className="wip-detail-label">Open Issues</span>
            <span className="wip-detail-val">{idx === 0 ? '4' : idx === 1 ? '17' : '2 (Just Vibes)'}</span>
          </div>
          <div className="wip-detail-row">
            <span className="wip-detail-label">Note To Self</span>
            <span className="wip-detail-val" style={{ fontStyle: 'italic', color: 'var(--text-2)' }}>
              {idx === 0 ? '"Ship Friday Even If Onboarding Is Ugly."' :
               idx === 1 ? '"Stop Adding Features. Cut Two."' :
               '"Talk To Five Real People Before Writing Code."'}
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ============ Blog Posts (shared) ============ */
const POSTS = [
  {
    cat: 'BUILD LOG', title: 'How EssayCloner Learns A Voice In Three Samples',
    excerpt: 'I tried fine-tuning. I tried RAG. I tried a wild prompt sandwich. Here is what actually shipped, and what I threw out.',
    snippet: 'Fine-tuning GPT-4 on three essays is like teaching a pianist to play in your style by showing them three of your napkin doodles. It does not work. What works: a structured extraction pass that pulls out your sentence-length rhythm, your em-dash habits, the words you use when you are hedging versus when you are confident. Feed those as constraints, not examples. Draft quality jumps overnight.',
    date: 'Apr 17, 2026', read: '6 Min', words: '1,847', accent: '#fbbf24',
    tool: 'EssayCloner',
  },
  {
    cat: 'POSTMORTEM', title: 'I Killed My Second Product After Four Months',
    excerpt: 'It made $200 a month. People told me to keep it. I shut it down anyway. Honestly the best decision I made this year.',
    snippet: 'The product worked. It had 40 paying users. It was profitable on day one because I built it over a weekend. And I was miserable every time I opened the support inbox. Two hundred dollars a month is not worth the weight of something you do not care about. Killing it freed up a Tuesday, and that Tuesday became EssayCloner. That is the real math.',
    date: 'Apr 14, 2026', read: '9 Min', words: '2,634', accent: '#ef4444',
    tool: 'Deadpool',
  },
  {
    cat: 'THINKING', title: 'Why One-Person Companies Will Own The Next Decade',
    excerpt: 'Distribution got cheap. Building got cheaper. The bottleneck moved to taste, and taste does not scale with headcount.',
    snippet: 'Every advantage a big company had in 2015 is gone. Infrastructure is a credit card. Design is a prompt. Distribution is a TikTok. What is left is the thing that never scaled: knowing what to make. Five smart people in a room will always outvote one person with conviction. That is why the next decade belongs to people, not teams.',
    date: 'Apr 11, 2026', read: '11 Min', words: '3,102', accent: '#a78bfa',
    tool: null,
  },
  {
    cat: 'BUILD LOG', title: 'The Three Hour Window Where I Ship Everything',
    excerpt: 'I tried morning pages. I tried deep work blocks. The only thing that has ever worked is 11pm to 2am.',
    date: 'Apr 8, 2026', read: '4 Min', words: '1,204', accent: '#fbbf24',
    tool: null,
  },
  {
    cat: 'POSTMORTEM', title: 'Why Feastmate\'s First Launch Was A Disaster',
    excerpt: 'Hit the App Store. 800 downloads in a day. A 1.4 star rating by Friday. What I got wrong and what I rebuilt.',
    date: 'Apr 5, 2026', read: '7 Min', words: '2,088', accent: '#ef4444',
    tool: 'Feastmate',
  },
];
window.POSTS = POSTS;

/* ============ Blog Section — clean data table ============ */
function BlogSection() {
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [livePosts, setLivePosts] = useState(null);

  React.useEffect(() => {
    fetch('/blog-posts.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data) && data.length) setLivePosts(data); })
      .catch(() => {});
  }, []);

  const source = livePosts || POSTS;
  const totalWords = source.reduce((a, p) => a + (parseInt((p.words || '').replace(',', '')) || 0), 0);
  const totalPosts = source.length;
  const postsThisMonth = source.filter(p => p.date.includes('Apr')).length;

  const parseDate = (d) => new Date(d).getTime();
  const parseWords = (w) => parseInt((w || '0').replace(',', '')) || 0;

  const sorted = [...source].sort((a, b) => {
    let va, vb;
    if (sortKey === 'date') { va = parseDate(a.date); vb = parseDate(b.date); }
    else if (sortKey === 'words') { va = parseWords(a.words); vb = parseWords(b.words); }
    else if (sortKey === 'cat') { va = a.cat; vb = b.cat; }
    else { va = a.title; vb = b.title; }
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir(key === 'date' || key === 'words' ? 'desc' : 'asc'); }
  };

  const sortIcon = (key) => sortKey !== key ? '' : sortDir === 'asc' ? '↑' : '↓';

  return (
    <section className="section section-blog" id="writing">
      <div className="container">
        <Reveal>
          <div className="blog-head-new">
            <div>
              <div className="section-label">
                <span className="pulse-green" /> Devlog
              </div>
              <h2 className="section-title">The Brief · Synthesis Notes.</h2>
              <p className="section-desc">
                Research notes and explainers across the categories the tools in this directory touch. Editorial voice, not personal essays.
              </p>
            </div>

            <div className="blog-stats">
              <div className="blog-stat">
                <div className="blog-stat-num">{totalPosts}</div>
                <div className="blog-stat-label">Blogs</div>
              </div>
              <div className="blog-stat">
                <div className="blog-stat-num">{postsThisMonth}</div>
                <div className="blog-stat-label">This Month</div>
              </div>
              <div className="blog-stat">
                <div className="blog-stat-num">{(totalWords/1000).toFixed(1)}k</div>
                <div className="blog-stat-label">Words Written</div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="blog-table-wrap">
            <div className="blog-table-meta">
              <span className="blog-table-meta-title">
                <span className="blog-table-prompt">/</span> writing / all-posts
              </span>
              <span className="blog-table-meta-count">{sorted.length} Entries</span>
            </div>

            <div className="blog-table" role="table">
              <div className="blog-table-row blog-table-head" role="row">
                <button className="blog-th blog-th-date" onClick={() => toggleSort('date')}>
                  Date <span className="blog-th-icon">{sortIcon('date')}</span>
                </button>
                <button className="blog-th blog-th-cat" onClick={() => toggleSort('cat')}>
                  Type <span className="blog-th-icon">{sortIcon('cat')}</span>
                </button>
                <button className="blog-th blog-th-title" onClick={() => toggleSort('title')}>
                  Title <span className="blog-th-icon">{sortIcon('title')}</span>
                </button>
                <div className="blog-th blog-th-tool">Tool</div>
                <button className="blog-th blog-th-words" onClick={() => toggleSort('words')}>
                  <span className="blog-th-icon">{sortIcon('words')}</span> Words
                </button>
                <div className="blog-th blog-th-read">Read</div>
                <div className="blog-th blog-th-arrow" />
              </div>

              {sorted.slice(0, 5).map((p, i) => (
                <a key={p.slug || p.title} href={p.slug ? `/blog/${p.slug}` : '/blog'} target="_top" className="blog-table-row blog-table-body-row" role="row">
                  <div className="blog-td blog-td-date">{p.date.replace(', 2026', '')}</div>
                  <div className="blog-td blog-td-cat">
                    <span className="blog-cat-chip" style={{ color: p.accent, background: p.accent + '14', borderColor: p.accent + '33' }}>
                      <span className="blog-cat-dot" style={{ background: p.accent }} />
                      {p.cat}
                    </span>
                  </div>
                  <div className="blog-td blog-td-title">
                    <div className="blog-td-title-main">{p.title}</div>
                    <div className="blog-td-title-excerpt">{p.excerpt}</div>
                  </div>
                  <div className="blog-td blog-td-tool">{p.tool || '—'}</div>
                  <div className="blog-td blog-td-words">{p.words || '—'}</div>
                  <div className="blog-td blog-td-read">{p.read}</div>
                  <div className="blog-td blog-td-arrow">→</div>
                </a>
              ))}
            </div>

            <div className="blog-table-foot">
              <span className="blog-table-foot-note">Showing {Math.min(5, sorted.length)} of {sorted.length} blogs</span>
              <a href="/blog" target="_top" className="blog-table-foot-link">View All {sorted.length} Blogs →</a>
            </div>
          </div>
        </Reveal>

        {sorted.length > 5 && (
          <Reveal delay={120}>
            <div className="lib-viewall-wrap">
              <a href="/blog" target="_top" className="lib-viewall-btn">
                View All {sorted.length} Blogs →
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ============ App ============ */
function App() {
  const [navScrolled, setNavScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    const on = () => setNavScrolled(window.scrollY > 50);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);
  return (
    <>
      <nav className={`nav ${navScrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav-inner">
          <button
            className="nav-burger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
          <div className="nav-logo">
            <span className="nav-logo-dot" />
            <span>Aleko</span>
          </div>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="#tools">Tools</a>
            <a href="/blog">Blog</a>
            <a href="/affiliates">Affiliates</a>
          </div>
          <a href="/community#suggest" className="nav-cta">Suggest A Tool →</a>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} current="home" />

      <header className="hero">
        <div className="noise" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <div className="hero-eyebrow">
              <span className="pulse" /> Shipping Solo From My Bedroom
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h1>
              One Person, Building<br />
              <MorphingWord />
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="hero-sub">
              I'm Aleko, a high schooler making small AI tools by myself. I'm trying to ship
              one new thing every single day. So far the streak is holding.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <ShippingDashboard />
          </Reveal>
        </div>
      </header>

      {/* tool library */}
      <ToolLibrary />

      {/* suggestion form, directly below library */}
      <SuggestForm />

      {/* weekly community build */}
      <WeeklyCommunity />

      {/* collaborations */}
      <CollabSection />

      {/* writing */}
      <BlogSection />

      {/* in progress / editor — last */}
      <section className="section" id="building" style={{ paddingTop: 40 }}>
        <div className="container">
          <Reveal>
            <div className="section-label">In Progress</div>
            <h2 className="section-title">What's Open In My Editor This Week.</h2>
            <p className="section-desc">
              Click a card to see the actual state of things. Last commits, stack choices,
              and the messy notes I leave for myself.
            </p>
          </Reveal>

          <div className="wip-grid">
            {WIP.map((w, i) => (
              <WIPCard key={w.title} w={w} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="footer" id="about">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="nav-logo">
                <span className="nav-logo-dot" />
                <span>Aleko</span>
              </div>
              <p className="footer-tagline">
                Small, sharp AI tools.<br/>Shipped solo, from my bedroom.
              </p>
              <p className="footer-sub">
                A one-person studio shipping one focused AI tool every day. No VC money,
                no team, no roadmap committee. If something here is useful, tell someone.
                If something's broken, tell me.
              </p>
            </div>
            <div className="footer-col">
              <h4>Site</h4>
              <ul>
                <li><a href="/about" target="_top">About</a></li>
                <li><a href="/tools" target="_top">Tools</a></li>
                <li><a href="/blog" target="_top">Blog</a></li>
                <li><a href="/community" target="_top">Community</a></li>
                <li><a href="/community#suggest" target="_top">Suggest A Tool</a></li>
                <li><a href="/affiliates" target="_top">Affiliates</a></li>
                <li><a href="/changelog" target="_top">Changelog</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Follow</h4>
              <ul>
                <li><a href="https://tiktok.com/@alekokourtidis" target="_blank">TikTok</a></li>
                <li><a href="https://instagram.com/alekokourtidis" target="_blank">Instagram</a></li>
                <li><a href="https://youtube.com/@alekokourtidis" target="_blank">YouTube</a></li>
                <li><a href="https://x.com/alekokourtidis" target="_blank">X / Twitter</a></li>
                <li><a href="https://github.com/alekokourtidis" target="_blank">GitHub</a></li>
                <li><a href="/contact" target="_top">Contact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="/privacy" target="_top">Privacy Policy</a></li>
                <li><a href="/terms" target="_top">Terms of Service</a></li>
                <li><a href="/affiliates" target="_top">Affiliate Disclosure</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bot">
            <span>© 2026 Aleko Kourtidis · Built solo, shipped daily from Atlanta</span>
            <span>This site is open-source and open to feedback.</span>
          </div>
        </div>
      </footer>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
