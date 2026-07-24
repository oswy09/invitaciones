import { InvitationCard } from "@/components/invitation-card"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <main className="min-h-dvh">
      <InvitationCard
        saludo={params.saludo}
        titulo={params.titulo}
        frase={params.frase}
        fecha={params.fecha}
        hora={params.hora}
        lugar={params.lugar}
        bg={params.bg}
      />
    </main>
  )
}
