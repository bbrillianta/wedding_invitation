import type { SiteContent } from "@/types";

/**
 * Single source of truth for placeholder wedding content.
 * Swap the values below with real details when ready to launch —
 * no other file needs to change.
 */
export const siteContent: SiteContent = {
  couple: {
    brideName: "Amara",
    groomName: "Kavi",
    monogram: "A & K",
    tagline: "Two stars, one constellation",
  },
  weddingDateISO: "2027-06-19T09:00:00+07:00",
  hero: {
    heroImage: "/images/hero-placeholder.svg",
    subheading: "Together with our families, we invite you to celebrate our wedding",
  },
  events: {
    ceremony: {
      name: "Holy Matrimony",
      dateTimeISO: "2027-06-19T09:00:00+07:00",
      venueName: "St. Aurora Chapel",
      address: "Jl. Bintang Selatan No. 12, Jakarta",
      mapEmbedUrl:
        "https://www.google.com/maps?q=Jakarta&output=embed",
      mapLink: "https://maps.google.com/?q=Jakarta",
    },
    reception: {
      name: "Wedding Reception",
      dateTimeISO: "2027-06-19T12:00:00+07:00",
      venueName: "The Celestial Ballroom",
      address: "Jl. Galaksi Raya No. 8, Jakarta",
      mapEmbedUrl:
        "https://www.google.com/maps?q=Jakarta&output=embed",
      mapLink: "https://maps.google.com/?q=Jakarta",
    },
  },
  loveStory: [
    {
      dateLabel: "August 2021",
      title: "Under the Same Sky",
      description:
        "A chance meeting at a mutual friend's rooftop stargazing party — we talked until sunrise and never really stopped.",
      image: "/images/story-01-placeholder.svg",
    },
    {
      dateLabel: "March 2023",
      title: "The Question",
      description:
        "On a quiet hilltop far from city lights, surrounded by more stars than we'd ever seen, Kavi asked Amara to be his forever.",
      image: "/images/story-02-placeholder.svg",
    },
    {
      dateLabel: "June 2027",
      title: "Happily Ever After",
      description:
        "We're gathering the people we love most to celebrate the beginning of our next chapter together.",
      image: "/images/story-03-placeholder.svg",
    },
  ],
  gallery: [
    { src: "/images/gallery-01-placeholder.svg", alt: "Amara and Kavi placeholder photo 1" },
    { src: "/images/gallery-02-placeholder.svg", alt: "Amara and Kavi placeholder photo 2" },
    { src: "/images/gallery-03-placeholder.svg", alt: "Amara and Kavi placeholder photo 3" },
    { src: "/images/gallery-04-placeholder.svg", alt: "Amara and Kavi placeholder photo 4" },
    { src: "/images/gallery-05-placeholder.svg", alt: "Amara and Kavi placeholder photo 5" },
    { src: "/images/gallery-06-placeholder.svg", alt: "Amara and Kavi placeholder photo 6" },
  ],
  gift: {
    note:
      "Your presence is the greatest gift of all. For those who wish to send a token of love from afar, we've included our details below.",
    bankTransfers: [
      { bankName: "Bank Central Asia (BCA)", accountName: "Amara Putri", accountNumber: "1234567890" },
      { bankName: "Bank Mandiri", accountName: "Kavi Wirawan", accountNumber: "0987654321" },
    ],
    eWallets: [
      { provider: "GoPay", name: "Amara Putri", number: "0812-3456-7890" },
      { provider: "OVO", name: "Kavi Wirawan", number: "0898-7654-3210" },
    ],
  },
  rsvp: {
    deadlineISO: "2027-05-19T00:00:00+07:00",
    whatsappNumber: "6281234567890",
    whatsappDisplay: "+62 812-3456-7890",
    contactName: "Amara & Kavi",
    contactPhone: "+62 812-3456-7890",
    contactEmail: "hello@amara-kavi.wedding",
  },
  seo: {
    title: "Amara & Kavi's Wedding",
    description:
      "Join us as we celebrate the wedding of Amara and Kavi — under the stars, with the people we love most.",
    ogImageAlt: "Amara & Kavi Wedding Invitation",
  },
};
