import React, { useState } from 'react';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { MusicPlayer } from './components/MusicPlayer';
import { HeroSection } from './components/HeroSection';
import { CountdownSection } from './components/CountdownSection';
import { ParentsSection } from './components/ParentsSection';
import { DetailsSection } from './components/DetailsSection';
import { ProgramSection } from './components/ProgramSection';
import { DressCodeSection } from './components/DressCodeSection';
import { GiftsSection } from './components/GiftsSection';
import { RsvpSection } from './components/RsvpSection';
import { FooterSection } from './components/FooterSection';
import { WeddingData } from './types';

const searchParams = new URLSearchParams(window.location.search);
const GUEST_NAME = searchParams.get('guest') || 'Familia & Amigos';
const SKIP_INTRO = searchParams.get('skip') === 'true';

const weddingData: WeddingData = {
  couple: {
    bride: 'Laura',
    groom: 'Marco',
    monogram: 'L & M',
    fullNameBride: 'Laura Bianchi',
    fullNameGroom: 'Marco Rossi',
  },
  date: {
    display: 'Sábado · 19 de Junio de 2027',
    subDisplay: '19 · 06 · 2027',
    isoDate: '2027-06-19T16:00:00',
    dayName: 'Sábado',
    dayNumber: '19',
    monthYear: 'Junio 2027',
    time: '16:00 hrs',
  },
  parents: {
    blessingText: 'Con la bendición de Dios y el amor incondicional de nuestras familias',
    brideParents: ['Roberto Bianchi', 'Elena Visconti'],
    groomParents: ['Alessandro Rossi', 'Francesca Moretti'],
  },
  ceremony: {
    name: 'Villa Carlotta',
    time: '16:00 hrs',
    address: 'Via Regina 2, Tremezzo (CO)',
    city: 'Lago di Como · Italia',
    mapUrl: 'https://maps.google.com/?q=Villa+Carlotta+Tremezzo',
    description: 'La ceremonia solemne se celebrará en la sala de los frescos y los jardines botánicos.',
  },
  reception: {
    name: 'Grand Hotel Tremezzo',
    time: '18:30 hrs',
    address: 'Via Regina 8, Tremezzo (CO)',
    city: 'Lago di Como · Italia',
    mapUrl: 'https://maps.google.com/?q=Grand+Hotel+Tremezzo',
    description: 'Brindis de honor, banquete sobre el lago y velada con música sinfónica en vivo.',
  },
  program: [
    {
      time: '15:30',
      title: 'Recepción de Invitados',
      description: 'Aperitivo de bienvenida en el jardín histórico de la villa.',
      icon: 'welcome',
    },
    {
      time: '16:00',
      title: 'Ceremonia Solemne',
      description: 'Lectura de votos matrimoniales y bendición en el salón noble.',
      icon: 'ceremony',
    },
    {
      time: '17:30',
      title: 'Cóctel & Brindis',
      description: 'Música de cuerdas y aperitivos junto a la orilla del lago.',
      icon: 'cocktail',
    },
    {
      time: '18:30',
      title: 'Cena de Gala',
      description: 'Banquete de bodas en la terraza panorámica con orquesta.',
      icon: 'dinner',
    },
    {
      time: '21:00',
      title: 'Primer Vals & Celebración',
      description: 'Apertura de baile, barra de cócteles y fiesta inolvidable.',
      icon: 'party',
    },
  ],
  dressCode: {
    title: 'Código de Vestimenta',
    subtitle: 'Etiqueta Rigurosa',
    description: 'Agradecemos asistir en traje formal de noche / esmoquin para caballeros y vestido largo de gala para damas.',
    note: 'Por favor, reservar el blanco exclusivamente para la novia.',
    colors: [
      { name: 'Negro Clásico', hex: '#1C1B1A' },
      { name: 'Azul Noche', hex: '#1C2738' },
      { name: 'Oro Viejo', hex: '#9E7B3B' },
      { name: 'Verde Oliva', hex: '#4E573C' },
      { name: 'Champán', hex: '#E5D6BF' },
    ],
  },
  gifts: {
    title: 'Lluvia de Sobres',
    description: 'El mayor regalo es compartir este día con ustedes. Para quienes deseen acompañarnos con un detalle, hemos dispuesto una cuenta para nuestro viaje de novios.',
    bankName: 'Banca Nazionale / Banco Santander',
    accountType: 'Cuenta Corriente',
    accountNumber: 'ES91 2100 0418 4502 0005 1324',
    accountHolder: 'Laura Bianchi & Marco Rossi',
    documentId: 'BODA-LAURA-MARCO',
  },
  rsvp: {
    deadline: '1 de Mayo de 2027',
    phone: '573158953019',
    message: `¡Hola Laura y Marco! Con mucha alegría confirmo mi asistencia a su boda. Nombre: ${GUEST_NAME}`,
  },
};

export default function App() {
  const [showIntro, setShowIntro] = useState(!SKIP_INTRO);
  const [startMusic, setStartMusic] = useState(false);

  const handleEnvelopeOpen = () => {
    setShowIntro(false);
  };

  const handleStartAudio = () => {
    setStartMusic(true);
  };

  return (
    <>
      {showIntro && (
        <EnvelopeIntro
          onOpen={handleEnvelopeOpen}
          onStartAudio={handleStartAudio}
          guestName={GUEST_NAME}
          monogram={weddingData.couple.monogram}
          weddingDate={weddingData.date.subDisplay}
        />
      )}

      {/* Main Invitation Container */}
      <main
        style={{
          maxWidth: 480,
          margin: '0 auto',
          minHeight: '100vh',
          backgroundColor: '#FAF8F5',
          boxShadow: '0 0 35px rgba(0, 0, 0, 0.04)',
          position: 'relative',
        }}
      >
        <HeroSection data={weddingData} />
        <CountdownSection targetDate={weddingData.date.isoDate} />
        <ParentsSection data={weddingData} />
        <DetailsSection data={weddingData} />
        <ProgramSection program={weddingData.program} />
        <DressCodeSection dressCode={weddingData.dressCode} />
        <GiftsSection gifts={weddingData.gifts} />
        <RsvpSection rsvp={weddingData.rsvp} />
        <FooterSection couple={weddingData.couple} dateDisplay={weddingData.date.subDisplay} />
      </main>

      {/* Floating Music Player */}
      <MusicPlayer autoPlayTrigger={startMusic} />
    </>
  );
}
