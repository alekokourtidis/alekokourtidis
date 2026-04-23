// Shared nav + footer for secondary pages. Matches index homepage.

const { useState, useEffect, useRef } = React;

/* ============ Shared Supabase tool_library fetcher ============
 * Both the homepage and /tools use this so new deployed tools show up
 * on every page automatically. Pass the hardcoded seed as the fallback
 * so the UI never blanks out if Supabase is unreachable.
 */
window.SB_URL = window.SB_URL || 'https://fdnbotpgodpcgqtojnrm.supabase.co';
window.SB_KEY = window.SB_KEY || 'sb_publishable_EXP_ArZJG1-dDSY240-ZdQ_91x4KdbQ';

window.useToolLibrarySupabase = function useToolLibrarySupabase(fallback, mapRow) {
  const [tools, setTools] = useState(fallback || []);
  useEffect(() => {
    let cancelled = false;
    // Newest-first (shipped_at DESC) is the correct default — when sort_order
    // ties (every tool defaults to 100), Postgres returns arbitrary order and
    // the user can't tell which tool is actually the most recent. created_at
    // is the tiebreaker when shipped_at is identical across same-day deploys.
    fetch(window.SB_URL + '/rest/v1/tool_library?select=*&visible=eq.true&order=shipped_at.desc,created_at.desc', {
      headers: { apikey: window.SB_KEY, Authorization: 'Bearer ' + window.SB_KEY },
      cache: 'no-store',
    })
      .then(r => r.ok ? r.json() : null)
      .then(rows => {
        if (cancelled || !Array.isArray(rows) || rows.length === 0) return;
        setTools(rows.map(mapRow));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return tools;
};

function MobileMenu({ open, onClose, current }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const links = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/tools', label: 'Tools', key: 'tools' },
    { href: '/blog', label: 'Blog', key: 'blog' },
    { href: '/affiliates', label: 'Affiliates', key: 'affiliates' },
    { href: '/about', label: 'About', key: 'about' },
  ];
  return (
    <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="mobile-menu-backdrop" onClick={onClose} />
      <aside className="mobile-menu-panel" role="dialog" aria-label="Menu">
        <div className="mobile-menu-head">
          <div className="nav-logo">
            <span className="nav-logo-dot" />
            <span>Aleko</span>
          </div>
          <button className="mobile-menu-close" aria-label="Close menu" onClick={onClose}>×</button>
        </div>
        <nav className="mobile-menu-links">
          {links.map(l => (
            <a
              key={l.key}
              href={l.href}
              className={current === l.key ? 'active' : ''}
              onClick={onClose}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a href="/community#suggest" className="mobile-menu-cta" onClick={onClose}>
          Suggest A Tool →
        </a>
      </aside>
    </div>
  );
}
window.MobileMenu = MobileMenu;

function SharedNav({ current }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 50);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);
  return (
    <>
      <nav className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav-inner">
          <button
            className="nav-burger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
          <a href="/" className="nav-logo">
            <span className="nav-logo-dot" />
            <span>Aleko</span>
          </a>
          <div className="nav-links">
            <a href="/" className={current === 'home' ? 'active' : ''}>Home</a>
            <a href="/tools" className={current === 'tools' ? 'active' : ''}>Tools</a>
            <a href="/blog" className={current === 'blog' ? 'active' : ''}>Blog</a>
            <a href="/affiliates" className={current === 'affiliates' ? 'active' : ''}>Affiliates</a>
          </div>
          <a href="/community#suggest" className="nav-cta">Suggest A Tool →</a>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} current={current} />
    </>
  );
}

function SharedFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-col footer-brand-col">
            <div className="footer-brand">
              <span className="nav-logo-dot" />
              <span>Aleko</span>
            </div>
            <p className="footer-tagline">
              Small, sharp AI tools. Shipped solo, from my bedroom.
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
              <li><a href="/about">About</a></li>
              <li><a href="/tools">All Tools</a></li>
              <li><a href="/blog">Writing</a></li>
              <li><a href="/community">Community</a></li>
              <li><a href="/community#suggest">Suggest A Tool</a></li>
              <li><a href="/affiliates">Affiliates</a></li>
              <li><a href="/changelog">Changelog</a></li>
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
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/affiliates">Affiliate Disclosure</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <span>© 2026 Aleko Kourtidis · Built solo, shipped daily from Atlanta</span>
          <span className="footer-uptime"><span className="pulse-green" /> All systems operational</span>
        </div>
      </div>
    </footer>
  );
}

/* Reveal — lightweight copy matching homepage */
function Reveal({ children, delay = 0, className = '', style = {}, as: Tag = 'div' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const reveal = () => setTimeout(() => setShown(true), delay);
    if (!el) { reveal(); return; }
    const r = el.getBoundingClientRect();
    // if in or near viewport, reveal immediately
    if (r.top < window.innerHeight + 200) { reveal(); return; }
    // else wait until it scrolls into view
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { reveal(); io.unobserve(el); } });
    }, { threshold: 0.01, rootMargin: '0px 0px 10% 0px' });
    io.observe(el);
    // hard fallback so nothing is ever permanently invisible
    const fb = setTimeout(() => setShown(true), 1200 + delay);
    return () => { io.disconnect(); clearTimeout(fb); };
  }, [delay]);
  return (
    <Tag ref={ref} className={className} style={{
      ...style,
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1)',
    }}>{children}</Tag>
  );
}

/* CardGlow — mouse-following radial glow */
function CardGlow({ children, className, accent, style = {} }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  };
  return (
    <div ref={ref} className={className} onMouseMove={onMove}
      style={{ ...(accent ? { '--accent': accent } : {}), ...style }}>
      {children}
    </div>
  );
}

Object.assign(window, { SharedNav, SharedFooter, Reveal, CardGlow });
