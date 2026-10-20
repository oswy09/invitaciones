import React, { useState } from 'react';
import { GatefoldIntro } from './components/GatefoldIntro';
import { MusicPlayer } from './components/MusicPlayer';
import { HeroSection } from './components/HeroSection';
import { FloralWelcome } from './components/FloralWelcome';
import { FallingLeaves } from './components/FallingLeaves';
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

const weddingData: WeddingData = {
  couple: {
    bride: 'Camila',
    groom: 'Eduardo',
    monogram: 'C & E',
    fullNameBride: 'Camila Mendoza',
    fullNameGroom: 'Eduardo Villalobos',
  },
  date: {
    display: 'Domingo · 15 de Noviembre de 2026',
    subDisplay: '15 · 11 · 2026',
    isoDate: '2026-11-15T16:00:00',
    dayName: 'Domingo',
    dayNumber: '15',
    monthYear: 'Noviembre 2026',
    time: '16:00 hrs',
  },
  parents: {
    blessingText: 'Con la bendición de Dios y el amor incondicional de nuestras familias',
    brideParents: ['Roberto Mendoza', 'Elena Visconti'],
    groomParents: ['Alessandro Villalobos', 'Francesca Moretti'],
  },
  ceremony: {
    name: 'Ceremonia Solemne',
    time: '16:00 hrs',
    address: 'Calle 2 # 8-56',
    city: 'Ariguaní · Pueblo Bello, Cesar',
    mapUrl: 'https://maps.google.com/?q=Calle+2+%23+8-56+Pueblo+Bello+Cesar',
    description: 'La ceremonia solemne se celebrará con la presencia de nuestros seres queridos.',
  },
  reception: {
    name: 'Recepción & Banquete de Gala',
    time: '18:30 hrs',
    address: 'Calle 2 # 8-56',
    city: 'Ariguaní · Pueblo Bello, Cesar',
    mapUrl: 'https://maps.google.com/?q=Calle+2+%23+8-56+Pueblo+Bello+Cesar',
    description: 'Brindis de honor, cena de gala y velada con música en vivo.',
  },
  program: [
    {
      time: '15:30',
      title: 'Aperitivo de bienvenida',
      subtitle: 'de la villa',
      description: 'Llegada y bienvenida en los jardines de la villa.',
      icon: 'welcome',
    },
    {
      time: '16:00',
      title: 'Ceremonia Solemne',
      subtitle: 'y bendición nupcial',
      description: 'Lectura de votos matrimoniales y entrega de argollas.',
      icon: 'ceremony',
    },
    {
      time: '17:30',
      title: 'Cóctel & Brindis',
      subtitle: 'de celebración',
      description: 'Brindis de honor y aperitivos con música en vivo.',
      icon: 'cocktail',
    },
    {
      time: '18:30',
      title: 'Cena & Banquete',
      subtitle: 'de gala',
      description: 'Banquete nupcial bajo las estrellas.',
      icon: 'dinner',
    },
    {
      time: '21:00',
      title: 'Primer Vals & Fiesta',
      subtitle: 'hasta el amanecer',
      description: 'Apertura de baile y celebración con orquesta.',
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
    bankName: 'Bancolombia / Banco Davivienda',
    accountType: 'Cuenta de Ahorros',
    accountNumber: '418-450200-05',
    accountHolder: 'Camila',
    documentId: 'BODA-CAMILA-EDUARDO',
  },
  rsvp: {
    deadline: '25 de Octubre de 2026',
    phone: '573158953019',
    message: `¡Hola Camila y Eduardo! Con mucha alegría confirmo mi asistencia a su boda el 15 de noviembre de 2026. Nombre: ${GUEST_NAME}`,
  },
};

export default function App() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [startMusic, setStartMusic] = useState(false);

  const handleEnvelopeOpen = () => {
    setEnvelopeOpened(true);
    setStartMusic(true);
  };

  return (
    <>
      <GatefoldIntro
        onOpenStart={handleEnvelopeOpen}
      >
        {/* ── Slot / Placeholder para el contenido interior de la invitación ── */}
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
          {/* 1. Primera Sección: Hero con Villa al Atardecer */}
          <HeroSection data={weddingData} />

          {/* 2. Secciones siguientes con fondo de textura tipo sobre blanco aclarado */}
          <div
            style={{
              position: 'relative',
              backgroundImage: 'url(/img/textura-sobre.jpg)',
              backgroundRepeat: 'repeat',
              backgroundSize: '480px auto',
              backgroundColor: '#FAF9F6',
            }}
          >
            {/* Velo blanco luminoso para aclarar la textura de papel y maximizar la legibilidad directa */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255, 255, 255, 0.74)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* 1. Cuenta Regresiva */}
              <CountdownSection targetDate={weddingData.date.isoDate} />

              {/* 2. Ramo de Boda Artístico con Movimiento y Bolitas Flotantes después de la cuenta */}
              <FloralWelcome />

              <ParentsSection data={weddingData} />
              <DetailsSection data={weddingData} />
              <ProgramSection program={weddingData.program} />
              <DressCodeSection dressCode={weddingData.dressCode} />
              <GiftsSection gifts={weddingData.gifts} />
              <RsvpSection rsvp={weddingData.rsvp} />
              <FooterSection couple={weddingData.couple} dateDisplay={weddingData.date.subDisplay} />
            </div>
          </div>
        </main>
      </GatefoldIntro>

      {/* Floating Music Player: sólo visible cuando se abre el sobre */}
      <MusicPlayer autoPlayTrigger={startMusic} visible={envelopeOpened} />

      {/* Hojas delicadas cayendo mientras se escrollea */}
      <FallingLeaves active={envelopeOpened} />
    </>
  );
}
