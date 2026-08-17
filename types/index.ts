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

export type SiteContent = {
  couple: {
    brideName: string;
    groomName: string;
    monogram: string;
    tagline: string;
  };
  weddingDateISO: string;
  hero: {
    heroImage: string;
    subheading: string;
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
