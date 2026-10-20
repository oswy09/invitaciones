import { LovingInvitationData } from './types';

export const DEFAULT_LOVING_INVITATION: LovingInvitationData = {
  bibleQuote: {
    text: '«Así que ya no son dos, sino una sola carne. Por tanto, lo que Dios ha unido, ningún hombre lo separe.»',
    reference: 'Mateo 19:6',
  },
  monogram: {
    left: 'D',
    right: 'M',
    subtitle: 'NUESTRA BODA',
  },
  welcomeText:
    'Con inmenso gozo y corazones agradecidos, junto con nuestros padres, te invitamos a compartir la celebración de nuestro amor al unirnos en matrimonio.',
  groomParents: {
    label: 'PADRES DEL NOVIO',
    names: 'Sr. Carlos Mendes\n& Sra. Lucia Neira',
  },
  brideParents: {
    label: 'PADRES DE LA NOVIA',
    names: 'Sr. André Souza\n& Sra. Juliana Castellanos',
  },
  brideName: 'Mayi',
  groomName: 'Daniel',
  inviteHonorText: 'Nos complace invitarte a nuestra boda',
  date: {
    month: 'MARZO',
    dayOfWeek: 'SÁBADO',
    day: '21',
    year: '2026',
    fullDateISO: '2026-03-21',
  },
  ceremony: {
    id: 'ceremony',
    time: '5:00 PM',
    title: 'CEREMONIA RELIGIOSA',
    placeName: 'Parroquia San Bartolomé Apóstol',
    address: 'Av. Suba #128A-51, Suba',
    cityState: 'Bogotá, Colombia',
    mapQuery: 'Parroquia San Bartolome Apostol Av Suba 128A-51 Bogota',
    lat: 4.7418,
    lng: -74.0832,
  },
  reception: {
    id: 'reception',
    time: '6:30 PM',
    title: 'RECEPCIÓN',
    placeName: 'Casa Quinta La Enlomada',
    address: 'Cra. 90 #159a-46, Suba',
    cityState: 'Bogotá, Colombia',
    mapQuery: 'Casa Quinta La Enlomada Cra 90 159a-46 Suba Bogota',
    lat: 4.7605,
    lng: -74.0933,
  },
  itinerary: [
    { id: '1', time: '5:00 PM', title: 'Ceremonia', icon: 'church' },
    { id: '2', time: '6:30 PM', title: 'Cóctel de bienvenida', icon: 'cocktail' },
    { id: '3', time: '7:45 PM', title: 'Entrada de los novios', icon: 'entrance' },
    { id: '4', time: '8:00 PM', title: 'Cena', icon: 'dinner' },
    { id: '5', time: '9:00 PM', title: 'Fiesta', icon: 'party' },
    { id: '6', time: '3:30 AM', title: 'Despedida', icon: 'farewell' },
  ],
  reservedSeatsCount: 2,
  giftSuggestion: {
    title: 'LLUVIA DE SOBRES',
    message:
      'Tu presencia es el mayor regalo. Sin embargo, si deseas honrarnos con un obsequio, una contribución monetaria será muy apreciada.',
    bankAccounts: [
      {
        bank: 'Bancolombia',
        accountType: 'Cuenta de Ahorros',
        accountNumber: '123-456789-00',
        accountHolder: 'Mayi Souza & Daniel Mendes',
        nequi: '305 750 2790',
        daviplata: '305 750 2790',
      },
    ],
  },
  confirmation: {
    title: 'CONFIRMACIÓN',
    deadlineText: 'Por favor confirma tu asistencia antes del 1 de marzo de 2025.',
    whatsappPhone: '573057502790',
  },
  adultsOnlyNote: {
    title: 'SOLO ADULTOS',
    message: 'Esperamos comprensión: nuestra celebración es exclusivamente para adultos.',
    footerSignOff: '¡LOS ESPERAMOS CON MUCHO AMOR!',
  },
  musicUrl: 'https://youtu.be/2Vv-BfVoq4g',
  musicTitle: 'Perfect - Ed Sheeran',
  photos: {
    bench: '/images/portada-novios.JPG',
    wagon: '/images/foto-studio-novios.JPG',
  },
  brandText: 'dedicandote.com',
  guestName: 'Alberto Giraldo',
};
