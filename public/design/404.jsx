const { useState, useEffect } = React;

const TOOLS = [
  { id: 'essaycloner',  title: 'EssayCloner',   tag: 'ai-writer',    accent: '#fbbf24' },
  { id: 'studypebble',  title: 'Study Pebble',  tag: 'spaced-recall', accent: '#60a5fa' },
  { id: 'shadowshield', title: 'AI Shadow Shield', tag: 'detector',   accent: '#a78bfa' },
  { id: 'trafficguard', title: 'AI Traffic Guard', tag: 'anomaly',    accent: '#f97316' },
  { id: 'wholefed',     title: 'Wholefed',      tag: 'macros',        accent: '#22c55e' },
  { id: 'feastmate',    title: 'Feastmate',     tag: 'meal-planner',  accent: '#ef4444' },
];

const LINES = [
  { t: 0,    prompt: '$ ', cmd: 'aleko resolve ' + (typeof window !== 'undefined' ? window.location.pathname : '/lost'), tone: 'user' },
  { t: 220,  text: '[resolve] parsing route...',             tone: 'muted' },
  { t: 500,  text: '[resolve] checking sitemap.xml... ok',   tone: 'muted' },
  { t: 780,  text: '[resolve] checking redirects.conf... ok',tone: 'muted' },
  { t: 1060, text: '[resolve] checking tools registry...',   tone: 'muted' },
  { t: 1380, text: 'ERR no matching route found',            tone: 'err' },
  { t: 1620, text: '',                                        tone: 'muted' },
  { t: 1700, text: '>> exit code 404',                        tone: 'err-strong' },
  { t: 1900, text: '>> build step 3 of 4 failed',             tone: 'muted' },
  { t: 2100, text: '>> suggesting recoverable routes...',    tone: 'muted' },
];

function Terminal() {
  const [shown, setShown] = useState(0);
  const [caret, setCaret] = useState(true);
  useEffect(() => {
    const timers = LINES.map((l, i) =>
      setTimeout(() => setShown(s => Math.max(s, i + 1)), l.t)
    );
    const blink = setInterval(() => setCaret(c => !c), 520);
    return () => { timers.forEach(clearTimeout); clearInterval(blink); };
  }, []);
  return (
    <div className="nf-term">
      <div className="nf-term-chrome">
        <span className="nf-dot" style={{ background: '#ef4444' }} />
        <span className="nf-dot" style={{ background: '#fbbf24' }} />
        <span className="nf-dot" style={{ background: '#22c55e' }} />
        <span className="nf-term-title">aleko@bedroom : ~ / portfolio</span>
        <span className="nf-term-status">
          <span className="pulse-red" /> build failed
        </span>
      </div>
      <div className="nf-term-body">
        {LINES.slice(0, shown).map((l, i) => (
          <div key={i} className={`nf-line nf-line-${l.tone}`}>
            {l.prompt && <span className="nf-prompt">{l.prompt}</span>}
            <span>{l.cmd || l.text}</span>
          </div>
        ))}
        {shown >= LINES.length && (
          <div className="nf-line nf-line-user">
            <span className="nf-prompt">$ </span>
            <span>{caret ? '_' : ' '}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function RecoverCard({ t }) {
  return (
    <a className="nf-tool-card" href={`tool.html?id=${t.id}`} style={{ '--accent': t.accent }}>
      <div className="nf-tool-head">
        <span className="nf-tool-dot" />
        <span className="nf-tool-title">{t.title}</span>
      </div>
      <span className="nf-tool-tag">/{t.tag}</span>
      <span className="nf-tool-arrow">→</span>
    </a>
  );
}

function NotFound() {
  // Pick 3 random tools each render
  const pick = React.useMemo(() => {
    const copy = [...TOOLS].sort(() => Math.random() - 0.5);
    return copy.slice(0, 3);
  }, []);

  return (
    <>
      <SharedNav current="" />
      <main className="nf-page">
        <div className="nf-bg" aria-hidden>
          <span className="nf-glow-a" />
          <span className="nf-glow-b" />
        </div>
        <div className="container nf-inner">
          <div className="nf-meta">
            <span className="nf-meta-code">
              <span className="pulse-red" />
              <span>EXIT 404</span>
            </span>
            <span className="nf-meta-sep">·</span>
            <span className="nf-meta-txt">build step failed · route not in sitemap</span>
          </div>
          <h1 className="nf-title">
            This page <em>didn't compile.</em>
          </h1>
          <p className="nf-sub">
            Something tried to render a URL I never shipped. The build log is below. Three recoverable routes are attached.
          </p>

          <Terminal />

          <div className="nf-actions">
            <a className="nf-cta nf-cta-primary" href="index.html">← Back Home</a>
            <a className="nf-cta nf-cta-alt" href="index.html#tools">See All Tools</a>
            <a className="nf-cta nf-cta-ghost" href="changelog.html">Read The Build Log</a>
          </div>

          <div className="nf-recover">
            <div className="nf-recover-head">
              <span className="nf-recover-eyebrow">RECOVERABLE ROUTES</span>
              <span className="nf-recover-count">{pick.length} suggestions</span>
            </div>
            <div className="nf-recover-grid">
              {pick.map(t => <RecoverCard key={t.id} t={t} />)}
            </div>
          </div>
        </div>
      </main>
      <SharedFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<NotFound />);
