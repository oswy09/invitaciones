export type ItineraryIconType = 'church' | 'cocktail' | 'entrance' | 'dinner' | 'party' | 'farewell';

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  icon: ItineraryIconType;
}

export interface LocationDetail {
  id: string;
  time: string;
  title: string;
  placeName: string;
  address: string;
  cityState: string;
  mapQuery: string;
  lat: number;
  lng: number;
  googleMapsUrl?: string;
  wazeUrl?: string;
}

export interface BankAccountInfo {
  bank: string;
  accountType: string;
  accountNumber: string;
  accountHolder: string;
  idNumber?: string;
  nequi?: string;
  daviplata?: string;
}

export interface LovingInvitationData {
  bibleQuote: {
    text: string;
    reference: string;
  };
  monogram: {
    left: string;
    right: string;
    subtitle: string;
  };
  welcomeText: string;
  groomParents: {
    label: string;
    names: string;
  };
  brideParents: {
    label: string;
    names: string;
  };
  brideName: string;
  groomName: string;
  inviteHonorText: string;
  date: {
    month: string;
    dayOfWeek: string;
    day: string;
    year: string;
    fullDateISO: string;
  };
  ceremony: LocationDetail;
  reception: LocationDetail;
  itinerary: ItineraryItem[];
  reservedSeatsCount: number;
  giftSuggestion: {
    title: string;
    message: string;
    bankAccounts: BankAccountInfo[];
  };
  confirmation: {
    title: string;
    deadlineText: string;
    whatsappPhone: string;
  };
  adultsOnlyNote: {
    title: string;
    message: string;
    footerSignOff: string;
  };
  musicUrl: string;
  musicTitle: string;
  photos: {
    bench: string;
    wagon: string;
  };
  brandText: string;
  guestName: string;
}
