// gram-shared.jsx — Color tokens + shared components

window.C = {
  bg:       '#0b0d13',
  s1:       '#10131e',
  s2:       '#161a28',
  s3:       '#1d2238',
  s4:       '#242844',
  border:   'rgba(255,255,255,0.065)',
  borderMd: 'rgba(255,255,255,0.11)',
  t1:       '#e8eaf4',
  t2:       '#7d8499',
  t3:       '#49506a',
  accent:   '#3d7fff',
  accentDim:'rgba(61,127,255,0.14)',
  success:  '#22b573',
  successDim:'rgba(34,181,115,0.12)',
  warning:  '#f0a418',
  warningDim:'rgba(240,164,24,0.12)',
  danger:   '#f04444',
  dangerDim:'rgba(240,68,68,0.12)',
  purple:   '#8b5cf6',
  purpleDim:'rgba(139,92,246,0.12)',
};

const C = window.C;

function Card({ children, style = {}, onClick, className = '' }) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 12, ...style }}
    >
      {children}
    </div>
  );
}

function Badge({ color = 'blue', children }) {
  const map = {
    blue:   { bg: C.accentDim,   text: C.accent },
    green:  { bg: C.successDim,  text: C.success },
    amber:  { bg: C.warningDim,  text: C.warning },
    red:    { bg: C.dangerDim,   text: C.danger },
    purple: { bg: C.purpleDim,   text: C.purple },
    gray:   { bg: 'rgba(255,255,255,0.07)', text: C.t2 },
  };
  const c = map[color] || map.blue;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 6,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.01em',
      background: c.bg, color: c.text, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

Object.assign(window, { Card, Badge });
