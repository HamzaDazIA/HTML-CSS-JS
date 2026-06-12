// gram-pos.jsx — Point of Sale

const { useState } = React;
const C = window.C;
const { Card, Badge } = window;

const MENU = {
  Starters: [
    { id: 1,  name: 'Burrata & Heirloom',   price: 18, desc: 'Aged balsamic, basil oil' },
    { id: 2,  name: 'Beef Tartare',          price: 22, desc: 'Capers, cornichons, quail egg' },
    { id: 3,  name: 'French Onion Soup',     price: 16, desc: 'Gruyère, sourdough crouton' },
    { id: 4,  name: 'Lobster Bisque',        price: 24, desc: 'Crème fraîche, chive' },
    { id: 5,  name: 'Octopus Romesco',       price: 26, desc: 'Smoked paprika, chorizo oil' },
    { id: 6,  name: 'Steak Tartare',         price: 28, desc: 'Truffle, capers, egg yolk' },
  ],
  Mains: [
    { id: 7,  name: 'Ribeye 12oz',           price: 68, desc: 'Bone-in, garlic butter jus' },
    { id: 8,  name: 'Duck Confit',           price: 44, desc: 'Cherry reduction, lentils' },
    { id: 9,  name: 'Grilled Salmon',        price: 38, desc: 'Miso glaze, pak choi' },
    { id: 10, name: 'Truffle Tagliatelle',   price: 36, desc: 'Hand-rolled, 24mo parmesan' },
    { id: 11, name: 'Chicken Supreme',       price: 34, desc: 'Wild mushroom jus, gratin' },
    { id: 12, name: 'Vegetable Risotto',     price: 28, desc: 'Vegan, seasonal vegetables' },
  ],
  Drinks: [
    { id: 13, name: 'House Red 175ml',       price: 12, desc: 'Côtes du Rhône' },
    { id: 14, name: 'Chardonnay 175ml',      price: 14, desc: 'Burgundy 2022' },
    { id: 15, name: 'Seasonal Cocktail',     price: 16, desc: 'Ask your server' },
    { id: 16, name: 'Still Water 750ml',     price:  5, desc: 'Filtered' },
    { id: 17, name: 'Sparkling 750ml',       price:  5, desc: 'San Pellegrino' },
    { id: 18, name: 'Espresso',              price:  4, desc: 'Double shot' },
  ],
  Desserts: [
    { id: 19, name: 'Crème Brûlée',         price: 14, desc: 'Vanilla, seasonal fruit' },
    { id: 20, name: 'Chocolate Fondant',     price: 16, desc: 'Salted caramel ice cream' },
    { id: 21, name: 'Cheese Board',          price: 22, desc: '3 selections, quince, crackers' },
    { id: 22, name: 'Affogato',              price: 10, desc: 'Vanilla gelato, espresso' },
  ],
};

const TABLES = [1, 2, 3, 5, 7, 9, 10, 12, 14];

function POSView() {
  const [cat, setCat]       = useState('Starters');
  const [cart, setCart]     = useState([]);
  const [table, setTable]   = useState(3);
  const [sent, setSent]     = useState(false);
  const [note, setNote]     = useState('');

  const add = item => setCart(p => {
    const ex = p.find(c => c.id === item.id);
    return ex ? p.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c) : [...p, { ...item, qty: 1 }];
  });

  const remove = id => setCart(p => {
    const it = p.find(c => c.id === id);
    return it.qty === 1 ? p.filter(c => c.id !== id) : p.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c);
  });

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const tax      = subtotal * 0.085;
  const total    = subtotal + tax;

  const sendToKitchen = () => {
    if (!cart.length) return;
    setSent(true);
    setCart([]);
    setNote('');
    setTimeout(() => setSent(false), 2800);
  };

  const btnBase = { border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Plus Jakarta Sans', padding: '11px 0', width: '100%' };

  return (
    <div style={{ flex: 1, background: C.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ padding: '14px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, letterSpacing: '-0.3px' }}>Point of Sale</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: C.t3 }}>Table</span>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {TABLES.map(n => (
              <button key={n} onClick={() => { setTable(n); setCart([]); }} style={{
                width: 34, height: 30, borderRadius: 7,
                border: `1px solid ${table === n ? C.accent : C.border}`,
                background: table === n ? C.accentDim : 'transparent',
                color: table === n ? C.accent : C.t2,
                fontSize: 13, fontWeight: table === n ? 700 : 400,
                cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
                transition: 'all 0.1s',
              }}>{n}</button>
            ))}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>A</div>
          <span style={{ fontSize: 12, color: C.t2, fontWeight: 500 }}>Ana L.</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Menu panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Category tabs */}
          <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 6 }}>
            {Object.keys(MENU).map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '7px 18px', borderRadius: 8,
                border: `1px solid ${cat === c ? C.accent : C.border}`,
                background: cat === c ? C.accentDim : 'transparent',
                color: cat === c ? C.accent : C.t2,
                fontSize: 13, fontWeight: cat === c ? 600 : 400,
                cursor: 'pointer', fontFamily: 'Plus Jakarta Sans',
                transition: 'all 0.1s',
              }}>{c}</button>
            ))}
          </div>

          {/* Items grid */}
          <div style={{ flex: 1, overflow: 'auto', padding: '18px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(192px, 1fr))', gap: 10 }}>
              {MENU[cat].map(item => {
                const inCart = cart.find(c => c.id === item.id);
                return (
                  <button key={item.id} className="gram-menu-item" onClick={() => add(item)} style={{
                    background: inCart ? 'rgba(61,127,255,0.08)' : C.s2,
                    border: `1px solid ${inCart ? 'rgba(61,127,255,0.3)' : C.border}`,
                    borderRadius: 10, padding: '14px 16px',
                    textAlign: 'left', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', gap: 4,
                    transition: 'all 0.1s', position: 'relative',
                  }}>
                    {inCart && (
                      <span style={{ position: 'absolute', top: 9, right: 10, background: C.accent, color: '#fff', borderRadius: 8, fontSize: 11, fontWeight: 700, padding: '1px 7px', fontFamily: 'JetBrains Mono, monospace' }}>
                        {inCart.qty}
                      </span>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.t1, fontFamily: 'Plus Jakarta Sans', paddingRight: inCart ? 30 : 0, lineHeight: 1.35 }}>{item.name}</span>
                    {item.desc && <span style={{ fontSize: 11, color: C.t3 }}>{item.desc}</span>}
                    <span style={{ fontSize: 16, fontWeight: 700, color: C.accent, fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>${item.price}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order cart */}
        <div style={{ width: 298, borderLeft: `1px solid ${C.border}`, background: C.s1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Cart header */}
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>Order — Table {table}</span>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} style={{ fontSize: 11, color: C.danger, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>Clear all</button>
            )}
          </div>

          {/* Cart body */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {sent ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.successDim, border: `1px solid ${C.success}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: C.success }}>✓</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.success }}>Sent to Kitchen</div>
                <div style={{ fontSize: 12, color: C.t3 }}>Table {table} · New ticket created</div>
              </div>
            ) : cart.length === 0 ? (
              <div style={{ padding: '52px 20px', textAlign: 'center', fontSize: 12, color: C.t3 }}>
                Tap items from the menu<br />to build the order
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{ padding: '11px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: C.t3, fontFamily: 'JetBrains Mono, monospace', marginTop: 1 }}>
                        ×{item.qty} · ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
                      <button onClick={() => add(item)}    style={{ width: 22, height: 22, borderRadius: 5, background: C.s3, border: 'none', color: C.t1, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      <button onClick={() => remove(item.id)} style={{ width: 22, height: 22, borderRadius: 5, background: C.s3, border: 'none', color: C.t1, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    </div>
                  </div>
                ))}
                {/* Note field */}
                <div style={{ padding: '10px 18px', borderBottom: `1px solid ${C.border}` }}>
                  <input
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Add kitchen note…"
                    style={{ width: '100%', background: C.s3, border: `1px solid ${C.border}`, borderRadius: 7, padding: '7px 10px', fontSize: 12, color: C.t1, fontFamily: 'Plus Jakarta Sans', outline: 'none' }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Totals + actions */}
          {cart.length > 0 && !sent && (
            <>
              <div style={{ padding: '14px 18px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.t3 }}>
                  <span>Subtotal</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.t3 }}>
                  <span>Tax (8.5%)</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>${tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: C.t1, paddingTop: 8, borderTop: `1px solid ${C.border}`, marginTop: 2 }}>
                  <span>Total</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: C.accent }}>${total.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ padding: '10px 18px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={sendToKitchen} style={{ ...btnBase, background: C.accent, color: '#fff' }}>
                  Send to Kitchen
                </button>
                <button style={{ ...btnBase, background: C.success, color: '#fff' }}>
                  Charge ${total.toFixed(2)}
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button style={{ ...btnBase, padding: '8px 0', background: 'transparent', border: `1px solid ${C.border}`, color: C.t2, fontSize: 12 }}>
                    Split Check
                  </button>
                  <button style={{ ...btnBase, padding: '8px 0', background: 'transparent', border: `1px solid ${C.border}`, color: C.t2, fontSize: 12 }}>
                    Print Check
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { POSView });
