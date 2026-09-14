import { useState, useEffect } from 'react';
import { supabase } from './supabase';

const DASHBOARD_PIN = 'mibodamc2026';

type RsvpRow = {
  id: string;
  nombre: string;
  asiste: boolean;
  created_at: string;
};

export default function Dashboard() {
  const [pin, setPin] = useState('');
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState(false);
  const [rows, setRows] = useState<RsvpRow[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === DASHBOARD_PIN) {
      setAuth(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (!auth) return;

    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('rsvp_responses')
        .select('*')
        .order('created_at', { ascending: false });
      setRows(data ?? []);
      setLoading(false);
    };

    load();

    // Realtime updates
    const channel = supabase
      .channel('rsvp_live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvp_responses' }, payload => {
        setRows(prev => [payload.new as RsvpRow, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [auth]);

  const si = rows.filter(r => r.asiste).length;
  const no = rows.filter(r => !r.asiste).length;

  const fmt = (d: string) =>
    new Date(d).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  if (!auth) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FAF7F0', fontFamily: "'Montserrat', sans-serif",
      }}>
        <form onSubmit={handleLogin} style={{
          background: '#fff', borderRadius: 16, padding: '40px 32px',
          boxShadow: '0 4px 32px rgba(44,36,22,0.1)', width: '100%', maxWidth: 360,
          textAlign: 'center',
        }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#2C2416', marginBottom: 6 }}>
            Dashboard RSVP
          </h1>
          <p style={{ fontSize: 12, color: '#5A4A30', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 28 }}>
            María & Juanca · 19.12.2026
          </p>
          <input
            type="password"
            placeholder="Ingresa el PIN"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(false); }}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 8,
              border: `1.5px solid ${error ? '#c0392b' : '#C8BFA8'}`,
              fontFamily: 'inherit', fontSize: 15, outline: 'none',
              boxSizing: 'border-box', marginBottom: 12,
            }}
          />
          {error && (
            <p style={{ fontSize: 12, color: '#c0392b', marginBottom: 8 }}>PIN incorrecto</p>
          )}
          <button type="submit" style={{
            width: '100%', padding: '13px', background: '#A99261', color: '#fff',
            border: 'none', borderRadius: 8, fontFamily: 'inherit', fontSize: 14,
            fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
          }}>
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#FAF7F0', fontFamily: "'Montserrat', sans-serif", padding: '32px 16px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: '#2C2416', marginBottom: 4 }}>
            Confirmaciones RSVP
          </h1>
          <p style={{ fontSize: 12, color: '#5A4A30', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            María & Juanca · 19.12.2026
          </p>
        </div>

        {/* Contadores */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
          <div style={{
            flex: 1, background: '#fff', borderRadius: 12, padding: '20px 16px',
            textAlign: 'center', boxShadow: '0 2px 12px rgba(44,36,22,0.07)',
            borderTop: '3px solid #4A6644',
          }}>
            <p style={{ fontSize: 36, fontWeight: 700, color: '#4A6644', lineHeight: 1 }}>{si}</p>
            <p style={{ fontSize: 11, color: '#5A4A30', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 6 }}>Confirman</p>
          </div>
          <div style={{
            flex: 1, background: '#fff', borderRadius: 12, padding: '20px 16px',
            textAlign: 'center', boxShadow: '0 2px 12px rgba(44,36,22,0.07)',
            borderTop: '3px solid #8C6032',
          }}>
            <p style={{ fontSize: 36, fontWeight: 700, color: '#8C6032', lineHeight: 1 }}>{no}</p>
            <p style={{ fontSize: 11, color: '#5A4A30', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 6 }}>No asisten</p>
          </div>
          <div style={{
            flex: 1, background: '#fff', borderRadius: 12, padding: '20px 16px',
            textAlign: 'center', boxShadow: '0 2px 12px rgba(44,36,22,0.07)',
            borderTop: '3px solid #A99261',
          }}>
            <p style={{ fontSize: 36, fontWeight: 700, color: '#A99261', lineHeight: 1 }}>{rows.length}</p>
            <p style={{ fontSize: 11, color: '#5A4A30', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 6 }}>Total</p>
          </div>
        </div>

        {/* Lista */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(44,36,22,0.07)', overflow: 'hidden' }}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: 32, color: '#5A4A30', fontSize: 13 }}>Cargando...</p>
          ) : rows.length === 0 ? (
            <p style={{ textAlign: 'center', padding: 32, color: '#5A4A30', fontSize: 13 }}>
              Aún no hay confirmaciones
            </p>
          ) : rows.map((r, i) => (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: i < rows.length - 1 ? '1px solid #F2EDE2' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: r.asiste ? '#4A6644' : '#8C6032',
                }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#2C2416', margin: 0 }}>{r.nombre}</p>
                  <p style={{ fontSize: 11, color: '#9B8B70', margin: 0, marginTop: 2 }}>{fmt(r.created_at)}</p>
                </div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: r.asiste ? '#4A6644' : '#8C6032',
                background: r.asiste ? '#EBF2EA' : '#F5ECE4',
                padding: '4px 10px', borderRadius: 20,
              }}>
                {r.asiste ? 'Sí' : 'No'}
              </span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#C8BFA8', marginTop: 24, letterSpacing: '0.1em' }}>
          Se actualiza en tiempo real ·{' '}
          <a href="https://celebrarte.com" target="_blank" rel="noopener noreferrer"
            style={{ color: '#A99261', textDecoration: 'none', fontWeight: 600 }}>
            Celebrarte
          </a>
        </p>
      </div>
    </div>
  );
}
