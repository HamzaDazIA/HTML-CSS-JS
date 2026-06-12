// gram-dashboard.jsx — Dashboard view + Floor Plan view

const { useState, useEffect } = React;
const C = window.C;
const { Card, Badge } = window;

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

function StatCard({ label, value, trend, trendColor }) {
  return (
    <Card style={{ padding: '20px 22px', flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10, color: C.t3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.t1, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-1.5px', lineHeight: 1, marginBottom: 6 }}>{value}</div>
      {trend && <div style={{ fontSize: 12, color: trendColor || C.success, fontWeight: 500 }}>{trend}</div>}
    </Card>
  );
}

const HOURLY = [0, 0, 0, 380, 1240, 2760, 3180, 2640, 2140, 1980, 1480, 980, 540];

function Sparkline({ data }) {
  const max = Math.max(...data, 1);
  const W = 200, H = 52, pad = 2;
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (W - pad * 2),
    H - pad - ((v / max) * (H - pad * 2))
  ]);
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 56 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.accent} stopOpacity="0.22" />
          <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sg)" />
      <path d={line} fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill={C.accent} />
    </svg>
  );
}

const ORDERS = [
  { id: 'ORD-8842', table: 12, covers: 4, total: 87.50,  status: 'cooking', server: 'Ana L.',   age: 8 },
  { id: 'ORD-8841', table:  5, covers: 2, total: 44.00,  status: 'ready',   server: 'James K.', age: 14 },
  { id: 'ORD-8840', table:  9, covers: 4, total: 134.00, status: 'cooking', server: 'Ana L.',   age: 22 },
  { id: 'ORD-8839', table:  3, covers: 3, total: 62.00,  status: 'served',  server: 'Tom R.',   age: 31 },
  { id: 'ORD-8838', table:  7, covers: 3, total: 98.50,  status: 'billing', server: 'James K.', age: 45 },
  { id: 'ORD-8837', table: 14, covers: 5, total: 210.00, status: 'served',  server: 'Ana L.',   age: 52 },
  { id: 'ORD-8836', table:  2, covers: 2, total: 38.00,  status: 'served',  server: 'Tom R.',   age: 68 },
];
const STATUS_COLOR = { cooking: 'amber', ready: 'green', served: 'gray', billing: 'purple', new: 'blue' };

function DashboardView() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const greeting = time.getHours() < 12 ? 'Good morning' : time.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', background: C.bg, display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.t1, letterSpacing: '-0.5px', margin: 0 }}>{greeting}</h1>
          <p style={{ fontSize: 13, color: C.t3, margin: '3px 0 0' }}>
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 500, color: C.t2, letterSpacing: '0.03em' }}>
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'flex', gap: 14 }}>
        <StatCard label="Revenue Today"   value="$12,480"  trend="▲ 8.3% vs yesterday"        trendColor={C.success} />
        <StatCard label="Covers"          value="164"      trend="Lunch 89 · Dinner 75"        trendColor={C.t2} />
        <StatCard label="Active Tables"   value="11 / 18"  trend="5 available · 2 reserved"    trendColor={C.t2} />
        <StatCard label="Avg Ticket Time" value="34 min"   trend="▲ 2 min above target"        trendColor={C.warning} />
      </div>

      {/* Content row */}
      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 380 }}>
        {/* Live orders */}
        <Card style={{ flex: 1.8, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Live Orders</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="gram-live-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: C.success, display: 'inline-block' }}></span>
              <span style={{ fontSize: 11, color: C.t3 }}>Updating live</span>
            </div>
          </div>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 52px 52px 82px 86px 80px', padding: '8px 20px', gap: 0 }}>
            {['Order', 'Table', 'Cvrs', 'Total', 'Server', 'Status'].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>
            ))}
          </div>
          {/* Rows */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {ORDERS.map((o, i) => (
              <div key={o.id} style={{
                display: 'grid', gridTemplateColumns: '1.3fr 52px 52px 82px 86px 80px',
                padding: '11px 20px', borderTop: `1px solid ${C.border}`, alignItems: 'center',
                background: i === 0 ? 'rgba(61,127,255,0.035)' : 'transparent',
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: C.accent }}>{o.id}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{o.table}</span>
                <span style={{ fontSize: 13, color: C.t2 }}>{o.covers}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: C.t1 }}>${o.total.toFixed(2)}</span>
                <span style={{ fontSize: 12, color: C.t3 }}>{o.server}</span>
                <Badge color={STATUS_COLOR[o.status]}>{o.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Right column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Sparkline */}
          <Card style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Revenue Today</div>
                <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>9 am → now, hourly</div>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, color: C.accent }}>$12,480</div>
            </div>
            <Sparkline data={HOURLY} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {['9a', '11a', '1p', '3p', '5p', '7p', '9p'].map(t => (
                <span key={t} style={{ fontSize: 10, color: C.t3, fontFamily: 'JetBrains Mono, monospace' }}>{t}</span>
              ))}
            </div>
          </Card>

          {/* Alerts */}
          <Card style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '13px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Alerts</span>
              <Badge color="red">3 active</Badge>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {[
                { dot: C.danger,  text: 'Table 5 — no order in 14 min',       sub: 'Server: James K. · Needs attention' },
                { dot: C.warning, text: 'Ribeye below par — 3 portions left',  sub: 'Inventory · Auto-reorder suggested' },
                { dot: C.warning, text: 'Table 9 seated 62 min, no check',     sub: 'Server: Ana L.' },
                { dot: C.success, text: 'Patel party confirmed for 8:00 PM',   sub: '6 guests · Table 13 reserved' },
                { dot: C.accent,  text: 'End-of-day report ready',             sub: 'Reports → Today\'s summary' },
              ].map((a, i) => (
                <div key={i} style={{ padding: '11px 18px', borderTop: i > 0 ? `1px solid ${C.border}` : 'none', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.dot, marginTop: 5, flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontSize: 12, color: C.t1, fontWeight: 500, lineHeight: 1.5 }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: C.t3, marginTop: 1 }}>{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── FLOOR PLAN ───────────────────────────────────────────────────────────────

const TABLES = [
  // Left wall 2-tops
  { id:  1, x: 50,  y: 60,  w: 58, h: 38, seats: 2, status: 'occupied', party: 2, seated: 28, server: 'Ana L.' },
  { id:  2, x: 50,  y: 130, w: 58, h: 38, seats: 2, status: 'empty' },
  { id:  3, x: 50,  y: 200, w: 58, h: 38, seats: 2, status: 'reserved', resTime: '7:30 PM', party: 2 },
  { id:  4, x: 50,  y: 270, w: 58, h: 38, seats: 2, status: 'empty' },
  // Center 4-tops row 1
  { id:  5, x: 190, y: 74,  w: 72, h: 52, seats: 4, status: 'occupied', party: 3, seated: 14, server: 'James K.', alert: true },
  { id:  6, x: 292, y: 74,  w: 72, h: 52, seats: 4, status: 'occupied', party: 4, seated: 42, server: 'Tom R.' },
  { id:  7, x: 394, y: 74,  w: 72, h: 52, seats: 4, status: 'occupied', party: 2, seated: 35, server: 'Ana L.' },
  { id:  8, x: 496, y: 74,  w: 72, h: 52, seats: 4, status: 'empty' },
  // Center 4-tops row 2
  { id:  9, x: 190, y: 194, w: 72, h: 52, seats: 4, status: 'occupied', party: 4, seated: 62, server: 'Ana L.' },
  { id: 10, x: 292, y: 194, w: 72, h: 52, seats: 4, status: 'occupied', party: 3, seated: 22, server: 'James K.' },
  { id: 11, x: 394, y: 194, w: 72, h: 52, seats: 4, status: 'reserved', resTime: '8:00 PM', party: 4 },
  { id: 12, x: 496, y: 194, w: 72, h: 52, seats: 4, status: 'occupied', party: 4, seated: 18, server: 'Tom R.' },
  // Back 6-tops
  { id: 13, x: 200, y: 313, w: 108, h: 58, seats: 6, status: 'empty' },
  { id: 14, x: 358, y: 313, w: 108, h: 58, seats: 6, status: 'occupied', party: 5, seated: 44, server: 'James K.' },
  // Bar rounds
  { id: 15, cx: 638, cy: 100, r: 26, seats: 2, status: 'occupied', party: 2, seated: 10, server: 'Ana L.',   round: true },
  { id: 16, cx: 690, cy: 185, r: 26, seats: 2, status: 'empty',                                               round: true },
  { id: 17, cx: 638, cy: 265, r: 26, seats: 2, status: 'occupied', party: 1, seated: 6,  server: 'Tom R.',   round: true },
  { id: 18, cx: 690, cy: 355, r: 26, seats: 2, status: 'empty',                                               round: true },
];

const ST = {
  empty:    { fill: '#141824', stroke: '#28304e' },
  occupied: { fill: '#0e1e3c', stroke: '#3d7fff' },
  reserved: { fill: '#1e1400', stroke: '#f0a418' },
  alert:    { fill: '#1e0808', stroke: '#f04444' },
};

function FloorView() {
  const [sel, setSel] = useState(null);
  const selT = TABLES.find(t => t.id === sel);

  function sk(t) { return t.alert ? 'alert' : t.status; }

  const occupied = TABLES.filter(t => t.status === 'occupied').length;
  const reserved = TABLES.filter(t => t.status === 'reserved').length;

  return (
    <div style={{ flex: 1, background: C.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 28px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, letterSpacing: '-0.3px' }}>Floor Plan</div>
          <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{occupied} occupied · {reserved} reserved · {18 - occupied - reserved} available</div>
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          {[['empty','Available'], ['occupied','Occupied'], ['reserved','Reserved'], ['alert','Needs Attention']].map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 13, height: 9, borderRadius: 3, background: ST[key].fill, border: `1.5px solid ${ST[key].stroke}` }}></div>
              <span style={{ fontSize: 11, color: C.t3 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* SVG floor */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          <svg viewBox="0 0 756 415" style={{ width: '100%', maxWidth: 756, display: 'block' }}>
            <rect x="36" y="36" width="692" height="362" rx="4" fill="#0d1018" stroke="#1d2236" strokeWidth="1.5" />
            <line x1="598" y1="48" x2="598" y2="390" stroke="#1d2236" strokeWidth="1.5" strokeDasharray="5,4" />
            <text x="305" y="27" textAnchor="middle" fontSize="8.5" fill="#2a3050" fontFamily="JetBrains Mono, monospace" letterSpacing="0.13em">MAIN DINING</text>
            <text x="666" y="27" textAnchor="middle" fontSize="8.5" fill="#2a3050" fontFamily="JetBrains Mono, monospace" letterSpacing="0.13em">BAR</text>
            <rect x="36" y="358" width="36" height="5" rx="2" fill="#3d7fff" opacity="0.25" />
            <text x="54" y="407" textAnchor="middle" fontSize="8" fill="#2a3050" fontFamily="JetBrains Mono">ENTRY</text>

            {TABLES.map(t => {
              const s = ST[sk(t)];
              const isSel = sel === t.id;
              const cx = t.round ? t.cx : t.x + t.w / 2;
              const cy = t.round ? t.cy : t.y + t.h / 2;
              return (
                <g key={t.id} onClick={() => setSel(t.id === sel ? null : t.id)} style={{ cursor: 'pointer' }}>
                  {t.round
                    ? <circle cx={t.cx} cy={t.cy} r={t.r} fill={s.fill} stroke={isSel ? '#fff' : s.stroke} strokeWidth={isSel ? 2.5 : 1.5} />
                    : <rect x={t.x} y={t.y} width={t.w} height={t.h} rx="6" fill={s.fill} stroke={isSel ? '#fff' : s.stroke} strokeWidth={isSel ? 2.5 : 1.5} />
                  }
                  <text x={cx} y={cy - (t.status !== 'empty' ? 6 : 4)} textAnchor="middle" fontSize={t.round ? 10 : 11} fontWeight="700" fill={s.stroke} fontFamily="JetBrains Mono, monospace">{t.id}</text>
                  {t.status === 'occupied' && (
                    <text x={cx} y={cy + 8} textAnchor="middle" fontSize="9" fill={s.stroke} opacity="0.85" fontFamily="Plus Jakarta Sans, sans-serif">{t.party}/{t.seats} · {t.seated}m</text>
                  )}
                  {t.status === 'reserved' && (
                    <text x={cx} y={cy + 8} textAnchor="middle" fontSize="9" fill={s.stroke} opacity="0.9">{t.resTime}</text>
                  )}
                  {t.alert && (
                    <circle cx={t.round ? t.cx + t.r - 3 : t.x + t.w - 3} cy={t.round ? t.cy - t.r + 3 : t.y + 3} r="5" fill={C.danger} stroke="#0d1018" strokeWidth="1.5" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        {selT && (
          <div style={{ width: 258, borderLeft: `1px solid ${C.border}`, background: C.s1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.t1 }}>Table {selT.id}</div>
                <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{selT.seats} seats · {selT.round ? 'Round' : 'Rectangle'}</div>
              </div>
              <Badge color={selT.alert ? 'red' : selT.status === 'occupied' ? 'blue' : selT.status === 'reserved' ? 'amber' : 'green'}>
                {selT.alert ? 'Alert' : selT.status === 'empty' ? 'Available' : selT.status}
              </Badge>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {selT.status === 'occupied' && (
                <>
                  <div>
                    <div style={{ fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5, fontWeight: 600 }}>Party</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: C.t1 }}>{selT.party} of {selT.seats} guests</div>
                    <div style={{ fontSize: 12, color: C.t3, marginTop: 3 }}>Seated {selT.seated} min ago</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5, fontWeight: 600 }}>Server</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{selT.server}</div>
                  </div>
                  {selT.alert && (
                    <div style={{ padding: '10px 12px', borderRadius: 8, background: C.dangerDim, border: `1px solid rgba(240,68,68,0.2)` }}>
                      <div style={{ fontSize: 12, color: C.danger, fontWeight: 600 }}>Needs Attention</div>
                      <div style={{ fontSize: 11, color: C.t2, marginTop: 2 }}>No order placed in 14 min</div>
                    </div>
                  )}
                </>
              )}
              {selT.status === 'reserved' && (
                <div>
                  <div style={{ fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5, fontWeight: 600 }}>Reservation</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.warning }}>{selT.resTime}</div>
                  <div style={{ fontSize: 12, color: C.t3, marginTop: 3 }}>Party of {selT.party}</div>
                </div>
              )}
              {selT.status === 'empty' && (
                <div style={{ fontSize: 12, color: C.t3 }}>Table is available for seating.</div>
              )}
            </div>

            <div style={{ padding: '12px 18px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selT.status === 'occupied' && (
                <>
                  <button style={{ padding: '9px 14px', background: C.accent, border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>Open Order</button>
                  <button style={{ padding: '9px 14px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, color: C.t2, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>Print Check</button>
                  <button style={{ padding: '9px 14px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, color: C.t2, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>Transfer Table</button>
                </>
              )}
              {selT.status === 'reserved' && (
                <button style={{ padding: '9px 14px', background: C.accent, border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>Seat Now</button>
              )}
              {selT.status === 'empty' && (
                <button style={{ padding: '9px 14px', background: C.accent, border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>Open New Order</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { DashboardView, FloorView });
