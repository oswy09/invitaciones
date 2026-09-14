import { useState, useEffect } from 'react';
import { supabase, EVENTO_ID } from './supabase';

const DASHBOARD_PIN = 'mibodamc2026';

type RsvpRow = {
  id: string;
  nombre: string;
  asiste: boolean;
  created_at: string;
  evento_id: string;
};

const C = {
  bg: '#FAF5FB', surface: '#FFFFFF', border: '#EAD9ED',
  text: '#1A0A1C', muted: '#7A5880', subtle: '#B09AB5',
  brand: '#5A1B5E', brandBg: '#F3E8F5',
  warn: '#B54708', warnBg: '#FEF6EE',
  accent: '#8B3D90', accentBg: '#EDD9EE',
};
const font = "'Inter','Montserrat',system-ui,sans-serif";

export default function Dashboard() {
  const [pin, setPin] = useState('');
  const [auth, setAuth] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [rows, setRows] = useState<RsvpRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'si' | 'no'>('all');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === DASHBOARD_PIN) { setAuth(true); setPinError(false); }
    else setPinError(true);
  };

  useEffect(() => {
    if (!auth) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('evento_id', EVENTO_ID)
        .order('created_at', { ascending: false });
      setRows((data ?? []) as RsvpRow[]);
      setLoading(false);
    };
    load();
    const ch = supabase
      .channel('rsvp_live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvp_responses' }, p => {
        const row = p.new as RsvpRow;
        if (row.evento_id === EVENTO_ID) setRows(prev => [row, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [auth]);

  const si = rows.filter(r => r.asiste).length;
  const no = rows.filter(r => !r.asiste).length;
  const visible = filter === 'all' ? rows : rows.filter(r => r.asiste === (filter === 'si'));

  const fmt = (d: string) =>
    new Date(d).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  /* ── Login ── */
  if (!auth) return (
    <div style={{ minHeight: '100dvh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font, padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.brand, display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.brand }}>Celebrarte</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 6px' }}>Panel de confirmaciones</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Ingresa tu PIN para continuar</p>
        </div>

        <form onSubmit={handleLogin} style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '28px 24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            PIN de acceso
          </label>
          <input
            type="password"
            placeholder="••••••••••••"
            value={pin}
            autoComplete="off"
            onChange={e => { setPin(e.target.value); setPinError(false); }}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 8,
              border: `1.5px solid ${pinError ? '#F04438' : C.border}`,
              fontFamily: font, fontSize: 15, outline: 'none', color: C.text,
              background: '#FAFAFA', boxSizing: 'border-box',
              marginBottom: pinError ? 8 : 16,
            }}
          />
          {pinError && <p style={{ fontSize: 12, color: '#F04438', marginBottom: 14 }}>PIN incorrecto. Intenta de nuevo.</p>}
          <button type="submit" style={{
            width: '100%', padding: '12px', background: C.brand, color: '#fff',
            border: 'none', borderRadius: 8, fontFamily: font, fontSize: 14,
            fontWeight: 600, cursor: 'pointer',
          }}>
            Ingresar
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: C.subtle }}>
          Creado por:{' '}
          <a href="https://celebrarte.com.co/" target="_blank" rel="noopener noreferrer"
            style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>
            Celebrarte
          </a>
        </p>
      </div>
    </div>
  );

  /* ── Dashboard ── */
  return (
    <div style={{ minHeight: '100dvh', background: C.bg, fontFamily: font }}>

      {/* Topbar */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 54 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.brand, display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.brand }}>Celebrarte</span>
            <span style={{ color: C.border, margin: '0 2px' }}>|</span>
            <span style={{ fontSize: 13, color: C.muted }}>RSVP · María &amp; Juanca</span>
          </div>
          <span style={{ fontSize: 11, color: C.subtle, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#12B76A', display: 'inline-block', animation: 'pulse 2s ease infinite' }} />
            En vivo
          </span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 48px' }}>

        {/* Contadores */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Confirman', value: si, color: C.brand, bg: C.brandBg },
            { label: 'No asisten', value: no, color: C.warn, bg: C.warnBg },
            { label: 'Total', value: rows.length, color: C.accent, bg: C.accentBg },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: '16px 12px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <p style={{ fontSize: 32, fontWeight: 800, color, margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {(['all', 'si', 'no'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 14px', borderRadius: 20,
              border: `1.5px solid ${filter === f ? C.brand : C.border}`,
              background: filter === f ? C.brandBg : C.surface,
              color: filter === f ? C.brand : C.muted,
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: font,
            }}>
              {f === 'all' ? 'Todos' : f === 'si' ? '✓ Confirman' : '✗ No asisten'}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: 40, color: C.muted, fontSize: 13 }}>Cargando...</p>
          ) : visible.length === 0 ? (
            <p style={{ textAlign: 'center', padding: 40, color: C.subtle, fontSize: 13 }}>
              {rows.length === 0 ? 'Aún no hay confirmaciones' : 'Sin resultados'}
            </p>
          ) : visible.map((r, i) => (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '13px 18px',
              borderBottom: i < visible.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: r.asiste ? C.brandBg : C.warnBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700,
                  color: r.asiste ? C.brand : C.warn,
                }}>
                  {r.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{r.nombre}</p>
                  <p style={{ fontSize: 11, color: C.subtle, margin: '2px 0 0' }}>{fmt(r.created_at)}</p>
                </div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: r.asiste ? C.brand : C.warn,
                background: r.asiste ? C.brandBg : C.warnBg,
                padding: '4px 10px', borderRadius: 20,
              }}>
                {r.asiste ? 'Sí' : 'No'}
              </span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: C.subtle, marginTop: 20 }}>
          Creado por:{' '}
          <a href="https://celebrarte.com.co/" target="_blank" rel="noopener noreferrer"
            style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>
            Celebrarte
          </a>
        </p>
      </div>
    </div>
  );
}
