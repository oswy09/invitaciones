export interface WeddingData {
  couple: {
    bride: string;
    groom: string;
    monogram: string;
    fullNameBride: string;
    fullNameGroom: string;
  };
  date: {
    display: string;
    subDisplay: string;
    isoDate: string; // for countdown
    dayName: string;
    dayNumber: string;
    monthYear: string;
    time: string;
  };
  parents: {
    brideParents: string[];
    groomParents: string[];
    blessingText: string;
  };
  ceremony: {
    name: string;
    time: string;
    address: string;
    city: string;
    mapUrl: string;
    description: string;
  };
  reception: {
    name: string;
    time: string;
    address: string;
    city: string;
    mapUrl: string;
    description: string;
  };
  program: Array<{
    time: string;
    title: string;
    description: string;
    icon: 'welcome' | 'ceremony' | 'cocktail' | 'dinner' | 'party' | 'toast';
  }>;
  dressCode: {
    title: string;
    subtitle: string;
    description: string;
    note: string;
    colors: Array<{ name: string; hex: string }>;
  };
  gifts: {
    title: string;
    description: string;
    bankName: string;
    accountType: string;
    accountNumber: string;
    accountHolder: string;
    documentId: string;
  };
  rsvp: {
    deadline: string;
    phone: string;
    message: string;
  };
}
