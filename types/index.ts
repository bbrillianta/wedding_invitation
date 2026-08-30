export type EventDetail = {
  name: string;
  dateTimeISO: string;
  venueName: string;
  address: string;
  mapEmbedUrl: string;
  mapLink: string;
};

export type LoveStoryMilestone = {
  dateLabel: string;
  title: string;
  description: string;
  image: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type BankTransfer = {
  bankName: string;
  accountName: string;
  accountNumber: string;
};

export type EWallet = {
  provider: string;
  name: string;
  number: string;
};

export type Parents = {
  father: string;
  mother: string;
};

export type SiteContent = {
  couple: {
    brideName: string;
    brideFullName: string;
    bridePhoto: string;
    brideParents: Parents;
    groomName: string;
    groomFullName: string;
    groomPhoto: string;
    groomParents: Parents;
    monogram: string;
    tagline: string;
  };
  weddingDateISO: string;
  intro: {
    eyebrow: string;
    subheading: string;
    buttonLabel: string;
  };
  hero: {
    heroImage: string;
    subheading: string;
  };
  greeting: {
    bismillah: string;
    salam: string;
    verseArabic: string;
    verseTranslationId: string;
    verseReference: string;
  };
  events: {
    ceremony: EventDetail;
    reception: EventDetail;
  };
  loveStory: LoveStoryMilestone[];
  gallery: GalleryImage[];
  gift: {
    note: string;
    bankTransfers: BankTransfer[];
    eWallets: EWallet[];
  };
  rsvp: {
    deadlineISO: string;
    whatsappNumber: string;
    whatsappDisplay: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
  };
  ucapan: {
    description: string;
    namePlaceholder: string;
    messagePlaceholder: string;
    submitLabel: string;
  };
  seo: {
    title: string;
    description: string;
    ogImageAlt: string;
  };
};

/** Guest record shape shared between the Phase 1 static list and the Phase 2 database. */
export type Guest = {
  slug: string;
  name: string;
  groupLabel?: string;
  invitedGuestCount: number;
};
