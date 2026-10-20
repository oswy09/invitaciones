import { useEffect, useRef, useState } from "react";

const WHATSAPP_CONTACTO = "573057502790";
const WHATSAPP_MENSAJE = "¡Hola! Tengo una duda sobre las invitaciones digitales de Celebrarte.";
const BRAND = "#5A1B5E";

function NavCategories() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const cats = [
    { label: "Baby Shower", href: "/baby-shower" },
    { label: "Bodas",       href: "/boda" },
    { label: "Cumpleaños",  href: "/cumpleanos" },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, fontWeight: 700, color: BRAND,
          display: "flex", alignItems: "center", gap: 5, padding: "4px 0",
        }}
      >
        Categorías
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        >
          <path d="M2 4l4 4 4-4" stroke={BRAND} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          background: "#fff", borderRadius: 14, border: "1px solid #ede0f5",
          boxShadow: "0 8px 32px rgba(90,27,94,0.15)", minWidth: 180,
          padding: "6px 0", zIndex: 300,
          animation: "sh-dropIn 0.18s ease",
        }}>
          {cats.map((c) => (
            <a
              key={c.href}
              href={c.href}
              onClick={() => setOpen(false)}
              style={{ display: "block", padding: "10px 18px", fontSize: 13, fontWeight: 600, color: "#3A1140", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f0fb")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {c.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close on route change (Astro navigation)
  useEffect(() => {
    const close = () => setMobileOpen(false);
    document.addEventListener("astro:after-swap", close);
    return () => document.removeEventListener("astro:after-swap", close);
  }, []);

  const navLinks = [
    { label: "Inicio",      href: "/" },
    { label: "Plantillas",  href: "/plantillas" },
    { label: "Baby Shower", href: "/baby-shower" },
    { label: "Bodas",       href: "/boda" },
    { label: "Cumpleaños",  href: "/cumpleanos" },
  ];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50, width: "100%",
      backgroundColor: "white", borderBottom: "1px solid #F0E0E8",
      boxShadow: "0 1px 4px rgba(90,27,94,0.07)",
    }}>
      <style>{`
        @keyframes sh-dropIn   { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }
        @keyframes sh-slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:none; } }
        .sh-desktop  { display:flex !important; }
        .sh-mobile   { display:none !important; }
        @media (max-width:640px) {
          .sh-desktop { display:none !important; }
          .sh-mobile  { display:flex !important; }
        }
      `}</style>

      <nav style={{
        maxWidth: 1000, margin: "0 auto", padding: "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        {/* Logo */}
        <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <img
            src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1783378436/logo-celebrarte_bxkmva.png"
            alt="Celebrarte"
            style={{ height: 28, width: "auto", display: "block" }}
          />
        </a>

        {/* Desktop links */}
        <div className="sh-desktop" style={{ alignItems: "center", gap: 20 }}>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>Home</a>
          <a href="/plantillas" style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>Plantillas</a>
          <NavCategories />
        </div>

        {/* Desktop WhatsApp */}
        <a
          href={`https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`}
          target="_blank" rel="noopener noreferrer"
          className="sh-desktop"
          style={{
            fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 99,
            border: `2px solid ${BRAND}`, color: BRAND, textDecoration: "none", whiteSpace: "nowrap",
          }}
        >
          Dudas
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="sh-mobile"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 6, borderRadius: 8, alignItems: "center", justifyContent: "center",
          }}
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BRAND} strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BRAND} strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, top: 53, zIndex: 200,
            background: "rgba(10,4,20,0.65)", backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
              boxShadow: "0 8px 32px rgba(90,27,94,0.2)",
              animation: "sh-slideDown 0.22s ease",
              overflow: "hidden",
            }}
          >
            {navLinks.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: "block", padding: "14px 24px",
                  fontSize: 15, fontWeight: 700, color: "#3A1140", textDecoration: "none",
                  borderBottom: i < navLinks.length - 1 ? "1px solid #f5eef8" : "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#faf6fd")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                {item.label}
              </a>
            ))}
            <div style={{ padding: "14px 20px 20px" }}>
              <a
                href={`https://wa.me/${WHATSAPP_CONTACTO}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "block", textAlign: "center", padding: "13px",
                  borderRadius: 12, background: BRAND, color: "#fff",
                  fontWeight: 700, fontSize: 14, textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(90,27,94,0.3)",
                }}
              >
                💬 Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
