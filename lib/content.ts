import type { SiteContent } from "@/types";
import { withBasePath } from "@/lib/utils";

/**
 * Single source of truth for placeholder wedding content.
 * Swap the values below with real details when ready to launch —
 * no other file needs to change.
 */
export const siteContent: SiteContent = {
  couple: {
    brideName: "Bintang",
    groomName: "Mega",
    monogram: "B & M",
    tagline: "Two stars, one constellation",
  },
  weddingDateISO: "2026-11-28T09:00:00+07:00",
  intro: {
    eyebrow: "You're Invited",
    subheading: "to the wedding of",
    buttonLabel: "Open Invitation",
  },
  hero: {
    heroImage: withBasePath("/images/hero-placeholder.svg"),
    subheading: "Together with our families, we invite you to celebrate our wedding",
  },
  events: {
    ceremony: {
      name: "Akad",
      dateTimeISO: "2026-11-26T08:00:00+07:00",
      venueName: "Masjid Namira",
      address: "Gresik, Jawa Timur",
      mapEmbedUrl: "https://www.google.com/maps?q=-7.1526463,112.4084817&output=embed",
      mapLink: "https://maps.app.goo.gl/NHtFBQSd9stBLU7Q7",
    },
    reception: {
      name: "Resepsi",
      dateTimeISO: "2026-11-28T11:00:00+07:00",
      venueName: "Gedung Wanita Candra Kencana",
      address: "Sidoarjo, Jawa Timur",
      mapEmbedUrl: "https://www.google.com/maps?q=-7.2878229,112.7618051&output=embed",
      mapLink: "https://maps.app.goo.gl/efn4TMUNne1WmWZC9",
    },
  },
  loveStory: [
    {
      dateLabel: "August 2021",
      title: "Under the Same Sky",
      description:
        "A chance meeting at a mutual friend's rooftop stargazing party — we talked until sunrise and never really stopped.",
      image: withBasePath("/images/story-01-placeholder.svg"),
    },
    {
      dateLabel: "March 2023",
      title: "The Question",
      description:
        "On a quiet hilltop far from city lights, surrounded by more stars than we'd ever seen, Bintang and Mega promised each other forever.",
      image: withBasePath("/images/story-02-placeholder.svg"),
    },
    {
      dateLabel: "November 2026",
      title: "Happily Ever After",
      description:
        "We're gathering the people we love most to celebrate the beginning of our next chapter together.",
      image: withBasePath("/images/story-03-placeholder.svg"),
    },
  ],
  gallery: [
    { src: withBasePath("/images/gallery-01-placeholder.svg"), alt: "Bintang and Mega placeholder photo 1" },
    { src: withBasePath("/images/gallery-02-placeholder.svg"), alt: "Bintang and Mega placeholder photo 2" },
    { src: withBasePath("/images/gallery-03-placeholder.svg"), alt: "Bintang and Mega placeholder photo 3" },
    { src: withBasePath("/images/gallery-04-placeholder.svg"), alt: "Bintang and Mega placeholder photo 4" },
    { src: withBasePath("/images/gallery-05-placeholder.svg"), alt: "Bintang and Mega placeholder photo 5" },
    { src: withBasePath("/images/gallery-06-placeholder.svg"), alt: "Bintang and Mega placeholder photo 6" },
  ],
  gift: {
    note:
      "Your presence is the greatest gift of all. For those who wish to send a token of love from afar, we've included our details below.",
    bankTransfers: [
      { bankName: "Bank Central Asia (BCA)", accountName: "Bintang Putri", accountNumber: "1234567890" },
      { bankName: "Bank Mandiri", accountName: "Mega Wirawan", accountNumber: "0987654321" },
    ],
    eWallets: [
      { provider: "GoPay", name: "Bintang Putri", number: "0812-3456-7890" },
      { provider: "OVO", name: "Mega Wirawan", number: "0898-7654-3210" },
    ],
  },
  rsvp: {
    deadlineISO: "2026-11-14T00:00:00+07:00",
    whatsappNumber: "6281234567890",
    whatsappDisplay: "+62 812-3456-7890",
    contactName: "Bintang & Mega",
    contactPhone: "+62 812-3456-7890",
    contactEmail: "hello@bintang-mega.wedding",
  },
  seo: {
    title: "Bintang & Mega's Wedding",
    description:
      "Join us as we celebrate the wedding of Bintang and Mega — under the stars, with the people we love most.",
    ogImageAlt: "Bintang & Mega Wedding Invitation",
  },
};
