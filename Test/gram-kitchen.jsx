// gram-kitchen.jsx — Kitchen Display System with live timers

const { useState, useEffect } = React;
const C = window.C;
const { Card, Badge } = window;

function fmt(ms) {
  const s = Math.floor(Math.max(0, ms) / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
function urg(ms) {
  const m = ms / 60000;
  return m < 8 ? 'ok' : m < 16 ? 'warn' : 'crit';
}
const UG = {
  ok:   { border: '#22b573', text: '#22b573', bg: 'rgba(34,181,115,0.10)',  bar: '#22b573' },
  warn: { border: '#f0a418', text: '#f0a418', bg: 'rgba(240,164,24,0.10)',  bar: '#f0a418' },
  crit: { border: '#f04444', text: '#f04444', bg: 'rgba(240,68,68,0.10)',   bar: '#f04444' },
};

function ago(m) { return Date.now() - m * 60000; }

const INIT = [
  { id: 'K-441', table: 12, server: 'Ana L.',   start: ago(8),  stage: 'new',       station: 'grill',
    items: [{ q:1, n:'Ribeye 12oz',        m:'Med-rare'    }, { q:1, n:'Caesar Salad',     m:'No croutons' }, { q:2, n:'Truffle Fries',    m:'' }] },
  { id: 'K-440', table:  5, server: 'James K.', start: ago(14), stage: 'preparing',  station: 'grill',
    items: [{ q:1, n:'Grilled Salmon',     m:'No butter'   }, { q:1, n:'Vegetable Risotto', m:'Vegan'      }] },
  { id: 'K-439', table:  9, server: 'Ana L.',   start: ago(22), stage: 'preparing',  station: 'prep',
    items: [{ q:2, n:'Burrata Starter',    m:''            }, { q:1, n:'Beef Tartare',      m:'Extra capers'}, { q:1, n:'Duck Confit', m:'' }, { q:2, n:'Truffle Tagliatelle', m:'+Parmesan' }] },
  { id: 'K-438', table:  7, server: 'Tom R.',   start: ago(5),  stage: 'new',        station: 'prep',
    items: [{ q:1, n:'French Onion Soup',  m:'Extra cheese'}, { q:1, n:'Chicken Supreme',  m:'Sauce aside' }] },
  { id: 'K-437', table: 14, server: 'James K.', start: ago(29), stage: 'ready',      station: 'expo',
    items: [{ q:2, n:'Wagyu Strip',        m:'Med'         }, { q:1, n:'Lobster Bisque',    m:''           }] },
  { id: 'K-436', table:  3, server: 'Tom R.',   start: ago(3),  stage: 'new',        station: 'grill',
    items: [{ q:1, n:'Chicken Supreme',    m:''            }] },
];

function Ticket({ t, now, onBump, onServe }) {
  const elapsed = now - t.start;
  const u = urg(elapsed);
  const uc = UG[u];

  return (
    <div style={{ background: C.s2, border: `1px solid ${uc.border}`, borderRadius: 10, overflow: 'hidden', boxShadow: `0 0 0 0 ${uc.border}` }}>
      {/* Urgency bar */}
      <div style={{ height: 3, background: uc.bar, opacity: u === 'crit' ? 1 : u === 'warn' ? 0.7 : 0.4 }}></div>
      {/* Header */}
      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.025)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: C.t1, fontFamily: 'JetBrains Mono, monospace' }}>T{t.table}</span>
          <span style={{ fontSize: 11, color: C.t3 }}>{t.server}</span>
          <span style={{ fontSize: 10, color: C.t3, fontFamily: 'JetBrains Mono, monospace', opacity: 0.6 }}>{t.id}</span>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: uc.text, background: uc.bg, padding: '3px 9px', borderRadius: 6 }}>
          {fmt(elapsed)}
        </div>
      </div>
      {/* Items */}
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {t.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700, color: uc.text, minWidth: 18, flexShrink: 0 }}>{item.q}×</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>{item.n}</div>
              {item.m && <div style={{ fontSize: 10, color: C.t3, marginTop: 1 }}>{item.m}</div>}
            </div>
          </div>
        ))}
      </div>
      {/* Action */}
      <div style={{ padding: '8px 12px', borderTop: `1px solid ${C.border}` }}>
        {t.stage === 'new' && (
          <button onClick={() => onBump(t.id)} style={{ width: '100%', padding: '8px', background: C.accent, border: 'none', borderRadius: 7, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Start Cooking
          </button>
        )}
        {t.stage === 'preparing' && (
          <button onClick={() => onBump(t.id)} style={{ width: '100%', padding: '8px', background: C.warning, border: 'none', borderRadius: 7, color: '#1a1000', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Mark Ready
          </button>
        )}
        {t.stage === 'ready' && (
          <button onClick={() => onServe(t.id)} style={{ width: '100%', padding: '8px', background: C.success, border: 'none', borderRadius: 7, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Serve &amp; Clear ✓
          </button>
        )}
      </div>
    </div>
  );
}

function KitchenView() {
  const [tickets, setTickets] = useState(INIT);
  const [station, setStation] = useState('all');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const bump  = id => setTickets(p => p.map(t => t.id !== id ? t : { ...t, stage: t.stage === 'new' ? 'preparing' : 'ready' }));
  const serve = id => setTickets(p => p.filter(t => t.id !== id));

  const filtered = stage => tickets.filter(t => t.stage === stage && (station === 'all' || t.station === station));

  const avgMin = tickets.length
    ? Math.round(tickets.reduce((s, t) => s + (now - t.start) / 60000, 0) / tickets.length)
    : 0;

  const COLS = [
    { stage: 'new',       label: 'New Tickets',    dot: C.accent },
    { stage: 'preparing', label: 'Preparing',       dot: C.warning },
    { stage: 'ready',     label: 'Ready to Serve',  dot: C.success },
  ];

  return (
    <div style={{ flex: 1, background: C.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, letterSpacing: '-0.3px' }}>Kitchen Display</div>
          <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{tickets.length} active tickets · Avg {avgMin} min</div>
        </div>

        {/* Station tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all','All Stations'], ['grill','Grill'], ['prep','Prep'], ['expo','Expo']].map(([id, label]) => (
            <button key={id} onClick={() => setStation(id)} style={{
              padding: '6px 14px', borderRadius: 8,
              border: `1px solid ${station === id ? C.accent : C.border}`,
              background: station === id ? C.accentDim : 'transparent',
              color: station === id ? C.accent : C.t2,
              fontSize: 12, fontWeight: station === id ? 600 : 400,
              cursor: 'pointer', fontFamily: 'Plus Jakarta Sans',
            }}>{label}</button>
          ))}
        </div>

        {/* Live clock */}
        <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 15, color: C.t2 }}>
          {new Date(now).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      {/* KDS Columns */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', overflow: 'hidden' }}>
        {COLS.map(({ stage, label, dot }, si) => (
          <div key={stage} style={{ borderRight: si < 2 ? `1px solid ${C.border}` : 'none', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Column header */}
            <div style={{ padding: '12px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.015)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot, boxShadow: `0 0 6px ${dot}55` }}></div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{label}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: C.t3 }}>
                {filtered(stage).length}
              </span>
            </div>
            {/* Tickets */}
            <div style={{ flex: 1, overflow: 'auto', padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered(stage).length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', fontSize: 12, color: C.t3 }}>No tickets</div>
              ) : (
                filtered(stage).map(t => (
                  <Ticket key={t.id} t={t} now={now} onBump={bump} onServe={serve} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { KitchenView });
