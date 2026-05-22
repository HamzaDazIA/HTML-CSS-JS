// gram-sidebar.jsx — Navigation sidebar

const C = window.C;

const Icon = {
  Dashboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  Floor: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
    </svg>
  ),
  Kitchen: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
      <line x1="6" x2="18" y1="17" y2="17"/>
    </svg>
  ),
  POS: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/>
      <path d="M9 7h6M9 11h6M9 15h4"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Box: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
};

const PRIMARY_NAV = [
  { id: 'dashboard', label: 'Dashboard',     icon: Icon.Dashboard },
  { id: 'floor',     label: 'Tables',        icon: Icon.Floor },
  { id: 'kitchen',   label: 'Kitchen',       icon: Icon.Kitchen, badge: '5', badgeColor: C.danger },
  { id: 'pos',       label: 'Point of Sale', icon: Icon.POS },
];

const SECONDARY_NAV = [
  { id: 'reservations', label: 'Reservations', icon: Icon.Calendar, badge: '3', badgeColor: C.warning },
  { id: 'inventory',    label: 'Inventory',    icon: Icon.Box,      badge: '!', badgeColor: C.danger },
  { id: 'reports',      label: 'Reports',      icon: Icon.BarChart },
];

function NavItem({ id, label, icon: Ico, badge, badgeColor, isActive, onClick }) {
  return (
    <button
      className="gram-nav-btn"
      onClick={() => onClick(id)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
        fontSize: 13, fontWeight: isActive ? 600 : 400,
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        color: isActive ? C.t1 : C.t2,
        background: isActive ? C.s3 : 'transparent',
        textAlign: 'left', transition: 'all 0.12s',
      }}
    >
      <span style={{ color: isActive ? C.accent : 'inherit', flexShrink: 0, display: 'flex' }}>
        <Ico />
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          background: badgeColor, color: '#fff', borderRadius: 10,
          fontSize: 10, fontWeight: 700, padding: '1px 6px',
          fontFamily: 'JetBrains Mono, monospace',
        }}>{badge}</span>
      )}
    </button>
  );
}

function Sidebar({ active, onNav }) {
  return (
    <aside style={{
      width: 220, flexShrink: 0, height: '100vh',
      background: C.s1, borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column', userSelect: 'none',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 26px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'linear-gradient(135deg, #3d7fff 0%, #6a40ff 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, color: '#fff',
          fontFamily: 'JetBrains Mono, monospace',
          boxShadow: '0 2px 14px rgba(61,127,255,0.4)',
        }}>G</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.t1, letterSpacing: '-0.3px' }}>GRAM</div>
          <div style={{ fontSize: 10, color: C.t3, letterSpacing: '0.09em', textTransform: 'uppercase', marginTop: -1 }}>Restaurant OS</div>
        </div>
      </div>

      {/* Primary nav */}
      <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ padding: '0 10px 7px', fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Operations</div>
        {PRIMARY_NAV.map(item => (
          <NavItem key={item.id} {...item} isActive={active === item.id} onClick={onNav} />
        ))}
      </div>

      <div style={{ margin: '16px 20px', borderTop: `1px solid ${C.border}` }}></div>

      {/* Secondary nav */}
      <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ padding: '0 10px 7px', fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Management</div>
        {SECONDARY_NAV.map(item => (
          <NavItem key={item.id} {...item} isActive={active === item.id} onClick={onNav} />
        ))}
      </div>

      <div style={{ flex: 1 }}></div>

      {/* Location + user */}
      <div style={{ padding: '12px 10px 14px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.success, flexShrink: 0, animation: 'pulse 2.5s ease-in-out infinite' }}></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.t1 }}>Main Location</div>
            <div style={{ fontSize: 10, color: C.t3 }}>Downtown · Open now</div>
          </div>
          <span style={{ color: C.t3, display: 'flex' }}><Icon.ChevronDown /></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>M</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>Marco R.</div>
            <div style={{ fontSize: 10, color: C.t3 }}>Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

Object.assign(window, { Sidebar, Icon });
