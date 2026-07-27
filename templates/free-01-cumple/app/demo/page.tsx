"use client"

import { InvitationCard } from "@/components/invitation-card"

export default function DemoPage() {
  return (
    <main className="min-h-dvh">
      <InvitationCard
        saludo="¡Estás invitado!"
        titulo="Cumpleaños de Valeria 🎂"
        frase="Ven a celebrar este día tan especial con nosotros"
        fecha="Sábado 23 de Agosto, 2025"
        hora="4:00 PM"
        lugar="Salón Jardín, Calle 45 #12-30, Bogotá"
        bg="fce7f3"
      />

      {/* CTA flotante — solo en demo */}
      <a
        href="https://celebrarte.com.co/plantillas?open=free-01-cumple"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.25rem",
          borderRadius: "9999px",
          fontWeight: 700,
          fontSize: "0.875rem",
          color: "white",
          background: "linear-gradient(135deg,#f59e0b,#ec4899)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          whiteSpace: "nowrap",
          textDecoration: "none",
        }}
      >
        🎉 Crear mi invitación gratis →
      </a>
    </main>
  )
}
