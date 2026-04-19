// Shared nav + footer for secondary pages. Matches index homepage.

const { useState, useEffect, useRef } = React;

function SharedNav({ current }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 50);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="index.html" className="nav-logo">
          <span className="nav-logo-dot" />
          <span>Aleko</span>
        </a>
        <div className="nav-links">
          <a href="index.html" className={current === 'home' ? 'active' : ''}>Home</a>
          <a href="tools.html" className={current === 'tools' ? 'active' : ''}>Tools</a>
          <a href="blog.html" className={current === 'blog' ? 'active' : ''}>Blog</a>
          <a href="affiliates.html" className={current === 'affiliates' ? 'active' : ''}>Affiliates</a>
        </div>
        <a href="community.html#suggest" className="nav-cta">Suggest A Tool →</a>
      </div>
    </nav>
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
          </div>
          <div className="footer-col">
            <h4>Products</h4>
            <ul>
              <li><a href="tools.html">All Tools</a></li>
              <li><a href="community.html#suggest">Suggest A Tool</a></li>
              <li><a href="index.html#building">In Progress</a></li>
              <li><a href="changelog.html">Changelog</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>More</h4>
            <ul>
              <li><a href="blog.html">Writing</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="community.html">Community</a></li>
              <li><a href="affiliates.html">Affiliates</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Elsewhere</h4>
            <ul>
              <li><a href="#">Twitter / X</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Email</a></li>
              <li><a href="#">RSS</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <span>© 2026 Aleko. Built From My Bedroom.</span>
          <span className="footer-uptime"><span className="pulse-green" /> Uptime: 99.98%</span>
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
