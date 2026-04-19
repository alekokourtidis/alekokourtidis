// Each mini-demo is a self-contained React component.
// Color only lives INSIDE these — the rest of the site is strict monochrome.

const { useState, useEffect, useRef } = React;

/* ===================== EssayCloner — voice morph ===================== */
function EssayClonerDemo() {
  const aiText = "Social media fundamentally impacts adolescent development through algorithmic engagement patterns.";
  const youText = "social media kind of messes with how kids grow up, the algorithms just keep them hooked honestly.";
  const [t, setT] = useState(0); // 0..1
  const [dir, setDir] = useState(1);

  useEffect(() => {
    let raf;
    const step = () => {
      setT(prev => {
        let next = prev + dir * 0.006;
        if (next >= 1) { setDir(-1); next = 1; }
        if (next <= 0) { setDir(1); next = 0; }
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [dir]);

  // blend at the word level
  const aiWords = aiText.split(' ');
  const youWords = youText.split(' ');
  const words = [];
  const maxLen = Math.max(aiWords.length, youWords.length);
  for (let i = 0; i < maxLen; i++) {
    // each word switches at a different threshold so the morph flows left-to-right
    const thresh = i / maxLen;
    const showYou = t > thresh;
    const w = showYou ? (youWords[i] || '') : (aiWords[i] || '');
    const fade = Math.min(1, Math.abs(t - thresh) * 8);
    words.push({ w, showYou, fade });
  }

  const styleLabel = (active) => ({
    fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'lowercase',
    padding: '5px 10px', borderRadius: 6,
    border: '1px solid ' + (active ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.06)'),
    color: active ? '#fafafa' : '#71717a',
    background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
    transition: 'all .3s ease',
    fontVariantNumeric: 'tabular-nums',
  });

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={styleLabel(t < 0.5)}>ai voice</span>
          <span style={{ color: '#52525b', alignSelf: 'center' }}>→</span>
          <span style={styleLabel(t >= 0.5)}>your voice</span>
        </div>
        <div style={{ fontSize: 11, color: '#71717a', fontVariantNumeric: 'tabular-nums' }}>
          match {Math.round(t * 94 + 4)}%
        </div>
      </div>

      <div style={{
        background: 'rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        padding: 22,
        fontSize: 17,
        lineHeight: 1.55,
        letterSpacing: '-0.005em',
        minHeight: 130,
        fontFamily: '"Inter", sans-serif',
        color: '#e4e4e7',
      }}>
        {words.map((obj, i) => (
          <span key={i} style={{
            display: 'inline-block',
            marginRight: 5,
            opacity: 0.4 + obj.fade * 0.6,
            transition: 'opacity .3s ease',
            color: obj.showYou ? '#fafafa' : '#a1a1aa',
          }}>
            {obj.w}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: `${t * 100}%`,
            background: 'linear-gradient(90deg, #71717a, #fafafa)',
            borderRadius: 2,
          }} />
        </div>
        <span style={{ fontSize: 11, color: '#71717a', fontVariantNumeric: 'tabular-nums', minWidth: 44, textAlign: 'right' }}>
          gen {(t * 2.4).toFixed(1)}s
        </span>
      </div>
    </div>
  );
}

/* ===================== Study Acorn — MCQ ===================== */
function StudyAcornDemo() {
  const options = [
    { k: 'A', t: 'Mitochondria' },
    { k: 'B', t: 'Ribosomes' },
    { k: 'C', t: 'Golgi apparatus' },
    { k: 'D', t: 'Endoplasmic reticulum' },
  ];
  const correct = 'A';
  const [picked, setPicked] = useState(null);
  const [revealed, setRevealed] = useState(false);

  // self-demo if no interaction
  useEffect(() => {
    if (picked !== null) return;
    const id = setTimeout(() => {
      setPicked('B');
      setRevealed(true);
      setTimeout(() => {
        setPicked('A');
        setTimeout(() => { setPicked(null); setRevealed(false); }, 1600);
      }, 1400);
    }, 1800);
    return () => clearTimeout(id);
  }, [picked]);

  const pick = (k) => {
    setPicked(k);
    setRevealed(true);
  };

  const optStyle = (k) => {
    const isPicked = picked === k;
    const isCorrect = revealed && k === correct;
    const isWrong = revealed && isPicked && k !== correct;
    let bg = 'rgba(255,255,255,0.02)';
    let border = 'rgba(255,255,255,0.06)';
    let color = '#e4e4e7';
    if (isCorrect) { bg = 'rgba(34,197,94,0.08)'; border = 'rgba(34,197,94,0.38)'; color = '#86efac'; }
    else if (isWrong) { bg = 'rgba(239,68,68,0.08)'; border = 'rgba(239,68,68,0.38)'; color = '#fca5a5'; }
    return {
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 14px',
      borderRadius: 10,
      border: '1px solid ' + border,
      background: bg,
      color,
      fontSize: 13.5,
      cursor: 'pointer',
      transition: 'all .2s ease',
      textAlign: 'left',
      width: '100%',
    };
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: '#71717a',
          padding: '4px 8px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4,
        }}>ap biology · q 147</span>
        <span style={{ fontSize: 11, color: '#71717a', fontVariantNumeric: 'tabular-nums' }}>4.5 ★ · 12s</span>
      </div>
      <div style={{ fontSize: 14, color: '#fafafa', lineHeight: 1.5, fontWeight: 500 }}>
        Which organelle is the primary site of ATP production in eukaryotic cells?
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {options.map(o => (
          <button key={o.k} style={optStyle(o.k)} onClick={() => pick(o.k)}>
            <span style={{
              minWidth: 22, height: 22, borderRadius: 5,
              border: '1px solid rgba(255,255,255,0.14)',
              display: 'grid', placeItems: 'center',
              fontSize: 11, fontWeight: 600, color: '#a1a1aa',
              fontVariantNumeric: 'tabular-nums',
            }}>{o.k}</span>
            <span>{o.t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===================== Shadow Shield — scan ===================== */
function ShadowShieldDemo() {
  const [phase, setPhase] = useState(0); // 0 scan, 1 result
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let id;
    if (phase === 0) {
      setProgress(0);
      id = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { setPhase(1); return 100; }
          return p + 2.5;
        });
      }, 60);
    } else {
      id = setTimeout(() => { setPhase(0); }, 3400);
    }
    return () => { clearInterval(id); clearTimeout(id); };
  }, [phase]);

  const services = [
    { n: 'Slack workspace', s: phase === 1 ? 'safe' : 'scan', d: 4 },
    { n: 'Notion docs',    s: phase === 1 ? 'risk' : 'scan', d: 8 },
    { n: 'Google Drive',    s: phase === 1 ? 'safe' : 'scan', d: 14 },
    { n: 'Zoom transcripts', s: phase === 1 ? 'risk' : 'scan', d: 20 },
  ];

  const stateColor = (s) => s === 'safe' ? '#22c55e' : s === 'risk' ? '#ef4444' : '#71717a';
  const stateLabel = (s) => s === 'safe' ? 'clean' : s === 'risk' ? 'training detected' : 'scanning…';

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: phase === 1 ? '#ef4444' : '#fafafa',
            boxShadow: phase === 1 ? '0 0 10px #ef4444' : '0 0 8px rgba(255,255,255,0.4)',
            transition: 'all .3s',
          }} />
          {phase === 0 ? 'scanning connected apps' : '2 risks surfaced'}
        </span>
        <span style={{ fontSize: 11, color: '#71717a', fontVariantNumeric: 'tabular-nums' }}>
          {phase === 0 ? `${Math.round(progress)}%` : 'just now'}
        </span>
      </div>

      <div style={{
        height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${phase === 0 ? progress : 100}%`,
          background: phase === 1 ? 'linear-gradient(90deg, #ef4444, #ef4444)' : 'linear-gradient(90deg, #52525b, #fafafa)',
          transition: 'width .1s linear, background .3s ease',
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {services.map((svc, i) => {
          const revealed = phase === 1 || progress > (i + 1) * 25;
          return (
            <div key={svc.n} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 8,
              fontSize: 13,
            }}>
              <span style={{ color: '#e4e4e7' }}>{svc.n}</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11, color: revealed ? stateColor(svc.s) : '#52525b',
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: revealed ? stateColor(svc.s) : '#52525b',
                }} />
                {revealed ? stateLabel(svc.s) : 'pending'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== Traffic Guard — keyword chart ===================== */
function TrafficGuardDemo() {
  const [hovered, setHovered] = useState(2);
  const data = [
    { k: 'best crm for startups', before: 84, after: 71 },
    { k: 'how to cold email',     before: 92, after: 48 },
    { k: 'saas pricing models',   before: 68, after: 63 },
    { k: 'b2b landing page tips', before: 77, after: 29 },
    { k: 'ga4 setup guide',       before: 55, after: 52 },
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setHovered(h => (h + 1) % data.length);
    }, 1800);
    return () => clearInterval(id);
  }, [data.length]);

  const max = 100;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#a1a1aa' }}>ai overview cannibalization · 30d</span>
        <span style={{ fontSize: 11, color: '#ef4444', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          −48% clicks
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.map((d, i) => {
          const active = hovered === i;
          const drop = d.before - d.after;
          return (
            <div key={d.k}
              onMouseEnter={() => setHovered(i)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 60px',
                gap: 12,
                alignItems: 'center',
                opacity: active ? 1 : 0.72,
                transition: 'opacity .2s ease',
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: '#e4e4e7', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{d.k}</span>
                </div>
                <div style={{ position: 'relative', height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 2 }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${(d.before / max) * 100}%`,
                    background: 'rgba(255,255,255,0.16)',
                    borderRadius: 2,
                    transition: 'all .4s ease',
                  }} />
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${(d.after / max) * 100}%`,
                    background: active ? '#ef4444' : 'rgba(239,68,68,0.6)',
                    borderRadius: 2,
                    transition: 'all .4s ease',
                    boxShadow: active ? '0 0 12px rgba(239,68,68,0.4)' : 'none',
                  }} />
                </div>
              </div>
              <div style={{
                fontSize: 12, color: drop > 20 ? '#ef4444' : '#71717a',
                textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500,
              }}>−{drop}%</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 14, fontSize: 11, color: '#71717a' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 3, background: 'rgba(255,255,255,0.3)' }} /> before
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 3, background: '#ef4444' }} /> after ai overviews
        </span>
      </div>
    </div>
  );
}

/* ===================== Wholefed — food score ===================== */
function WholefedDemo() {
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState(0);
  const target = 72;

  useEffect(() => {
    let raf;
    const tick = () => {
      setScore(s => {
        if (phase === 0) {
          if (s < target) return s + 2;
          setTimeout(() => setPhase(1), 900);
          return target;
        }
        if (phase === 1) {
          setTimeout(() => { setScore(0); setPhase(0); }, 2200);
          return s;
        }
        return s;
      });
      raf = requestAnimationFrame(tick);
    };
    const id = setInterval(tick, 60);
    return () => clearInterval(id);
  }, [phase]);

  const scoreColor = score < 40 ? '#ef4444' : score < 65 ? '#eab308' : '#22c55e';

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#a1a1aa' }}>lunch · poke bowl</span>
        <span style={{ fontSize: 11, color: '#71717a', fontVariantNumeric: 'tabular-nums' }}>today · 12:41</span>
      </div>

      {/* the "photo" — striped placeholder with food label overlay */}
      <div style={{
        position: 'relative',
        height: 130,
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        background: `
          repeating-linear-gradient(135deg,
            #1a1a1d 0, #1a1a1d 10px,
            #222226 10px, #222226 20px)
        `,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.08), transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          fontSize: 10, color: '#52525b', letterSpacing: '0.12em',
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        }}>[ user photo ]</div>

        {/* animated score chip */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 10,
          padding: '8px 12px',
          display: 'flex', alignItems: 'center', gap: 10,
          opacity: score > 0 ? 1 : 0,
          transform: score > 0 ? 'scale(1)' : 'scale(0.9)',
          transition: 'all .3s ease',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: `conic-gradient(${scoreColor} ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
            display: 'grid', placeItems: 'center',
            transition: 'all .15s linear',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: '#111113',
              display: 'grid', placeItems: 'center',
              fontSize: 10, fontWeight: 600, color: scoreColor,
              fontVariantNumeric: 'tabular-nums',
            }}>{score}</div>
          </div>
          <div style={{ fontSize: 10, color: '#a1a1aa', textTransform: 'lowercase', letterSpacing: '0.1em' }}>
            health score
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[
          { k: 'protein', v: 'high', good: true },
          { k: 'sodium', v: 'watch', good: false },
          { k: 'fiber', v: 'good', good: true },
        ].map(f => (
          <div key={f.k} style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 12, color: '#a1a1aa',
            padding: '5px 0',
            borderBottom: '1px dashed rgba(255,255,255,0.04)',
          }}>
            <span>{f.k}</span>
            <span style={{ color: f.good ? '#86efac' : '#fca5a5', fontWeight: 500 }}>{f.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== Feastmate — macro bars ===================== */
function FeastmateDemo() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf;
    const step = () => {
      setT(p => {
        const next = p + 0.012;
        return next > 1.4 ? 0 : next;
      });
      raf = requestAnimationFrame(step);
    };
    const id = setInterval(step, 50);
    return () => clearInterval(id);
  }, []);

  const macros = [
    { k: 'protein',  target: 42, unit: 'g', color: '#60a5fa' },
    { k: 'carbs',    target: 58, unit: 'g', color: '#fbbf24' },
    { k: 'fat',      target: 18, unit: 'g', color: '#f472b6' },
  ];
  const kcal = 540;
  const progress = Math.min(1, t);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 14, color: '#fafafa', fontWeight: 600, marginBottom: 3 }}>
            miso-glazed salmon bowl
          </div>
          <div style={{ fontSize: 11, color: '#71717a', letterSpacing: '0.04em' }}>
            fits 540 kcal · 42p / 58c / 18f
          </div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 600, color: '#86efac',
          padding: '4px 8px', border: '1px solid rgba(34,197,94,0.3)',
          background: 'rgba(34,197,94,0.06)',
          borderRadius: 4, letterSpacing: '0.1em',
        }}>match</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {macros.map(m => (
          <div key={m.k}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
              <span style={{ color: '#a1a1aa', letterSpacing: '0.04em' }}>{m.k}</span>
              <span style={{ color: '#e4e4e7', fontVariantNumeric: 'tabular-nums' }}>
                {Math.round(m.target * progress)}<span style={{ color: '#52525b' }}>/{m.target}{m.unit}</span>
              </span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progress * 100}%`,
                background: m.color,
                borderRadius: 3,
                transition: 'width .1s linear',
                boxShadow: `0 0 8px ${m.color}66`,
              }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '10px 0 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontSize: 11, color: '#71717a',
      }}>
        <span>15 min · 1 serving</span>
        <span style={{ color: '#a1a1aa' }}>{kcal} kcal</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  EssayClonerDemo, StudyAcornDemo, ShadowShieldDemo,
  TrafficGuardDemo, WholefedDemo, FeastmateDemo,
});
