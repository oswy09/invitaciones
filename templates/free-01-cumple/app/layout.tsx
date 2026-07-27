import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fredoka, Space_Mono } from 'next/font/google'
import './globals.css'

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
})

export const metadata: Metadata = {
  title: 'Invitación Digital de Cumpleaños Gratis · Celebrarte',
  description: 'Crea tu invitación digital de cumpleaños gratis en segundos. Personaliza con el nombre, fecha, lugar y color. Compártela por WhatsApp al instante. 100% gratis, sin registro.',
  generator: 'celebrarte',
  metadataBase: new URL('https://free-01.celebrarte.com.co'),
  alternates: { canonical: '/demo' },
  openGraph: {
    type: 'website',
    url: 'https://free-01.celebrarte.com.co/demo',
    title: 'Invitación Digital de Cumpleaños Gratis · Celebrarte',
    description: 'Crea tu invitación digital de cumpleaños gratis en segundos y compártela por WhatsApp.',
    images: [{ url: 'https://res.cloudinary.com/ddqbnr9vo/image/upload/v1780436162/Share_Redes_a2ow9q.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invitación Digital de Cumpleaños Gratis · Celebrarte',
    description: 'Crea tu invitación digital de cumpleaños gratis en segundos.',
    images: ['https://res.cloudinary.com/ddqbnr9vo/image/upload/v1780436162/Share_Redes_a2ow9q.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f6d365',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${fredoka.variable} ${spaceMono.variable}`}>
      <body className="antialiased font-sans">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
