"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { InvitationCard } from "@/components/invitation-card"

function CardFromParams() {
  const params = useSearchParams()
  return (
    <InvitationCard
      saludo={params.get("saludo") ?? undefined}
      titulo={params.get("titulo") ?? undefined}
      frase={params.get("frase") ?? undefined}
      fecha={params.get("fecha") ?? undefined}
      hora={params.get("hora") ?? undefined}
      lugar={params.get("lugar") ?? undefined}
      bg={params.get("bg") ?? undefined}
    />
  )
}

export default function Page() {
  return (
    <main className="min-h-dvh">
      <Suspense fallback={<div className="min-h-dvh" style={{ backgroundColor: "#fef3c7" }} />}>
        <CardFromParams />
      </Suspense>
    </main>
  )
}
