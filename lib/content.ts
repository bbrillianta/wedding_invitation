import type { SiteContent } from "@/types";
import { withBasePath } from "@/lib/utils";

/**
 * Single source of truth for placeholder wedding content.
 * Swap the values below with real details when ready to launch —
 * no other file needs to change.
 */
export const siteContent: SiteContent = {
  couple: {
    brideName: "Mega",
    brideFullName: "Mega Putri Rahmawati Darta",
    bridePhoto: withBasePath("/images/couples/mega.jpeg"),
    brideParents: { father: "Alm. Sudarto Seputro", mother: "Endang Sumiati" },
    groomName: "Bintang",
    groomFullName: "Brillianta Bintang Virgantara",
    groomPhoto: withBasePath("/images/couples/bintang.jpeg"),
    groomParents: { father: "Dwi Nugroho Widi", mother: "Rini Setiawati" },
    monogram: "B & M",
    tagline: "Love as boundless as the sky",
  },
  weddingDateISO: "2026-11-28T09:00:00+07:00",
  intro: {
    eyebrow: "Anda Diundang",
    subheading: "dalam pernikahan",
    buttonLabel: "Buka Undangan",
  },
  hero: {
    heroImage: withBasePath("/images/hero-placeholder.svg"),
    subheading:
      "Bersama keluarga besar kami, dengan penuh syukur mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu.",
  },
  greeting: {
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    salam: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    verseArabic:
      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    verseTranslationId:
      "\"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.\"",
    verseReference: "QS. Ar-Rum: 21",
  },
  events: {
    ceremony: {
      name: "Akad",
      dateTimeISO: "2026-11-26T08:00:00+07:00",
      venueName: "Masjid Namira",
      address: "Lamongan, Jawa Timur",
      mapEmbedUrl: "https://www.google.com/maps?q=-7.1526463,112.4084817&output=embed",
      mapLink: "https://maps.app.goo.gl/NHtFBQSd9stBLU7Q7",
    },
    reception: {
      name: "Resepsi",
      dateTimeISO: "2026-11-28T11:00:00+07:00",
      venueName: "Gedung Wanita Candra Kencana",
      address: "Surabaya, Jawa Timur",
      mapEmbedUrl: "https://www.google.com/maps?q=-7.2878229,112.7618051&output=embed",
      mapLink: "https://maps.app.goo.gl/efn4TMUNne1WmWZC9",
    },
  },
  loveStory: [
    {
      dateLabel: "Agustus 2019",
      title: "Dipertemukan Dalam Satu Kampus",
      description:
        "Menjadi rekan satu kelas, bersama selama 3 tahun sebagai teman dekat di kampus.",
      image: withBasePath("/images/stories/beginning.jpeg"),
    },
    {
      dateLabel: "Maret 2024",
      title: "Dipertemukan Kembali",
      description:
        "Perjuangan Bintang yang tak berhenti mengejar Mega, membuat Mega untuk membuka hati dan saling mengenal lebih dalam.",
      image: withBasePath("/images/stories/graduate.jpg"),
    },
    {
      dateLabel: "Maret 2026",
      title: "Memutuskan menuju jenjang serius",
      description:
        "Setelah saling mengenal, Bintang memantapkan niat baiknya untuk melamar Mega bersama keluarga besarnya.",
      image: withBasePath("/images/stories/engagement.jpeg"),
    },
  ],
  gallery: [
    { src: withBasePath("/images/gallery-01-placeholder.svg"), alt: "Foto Bintang dan Mega 1" },
    { src: withBasePath("/images/gallery-02-placeholder.svg"), alt: "Foto Bintang dan Mega 2" },
    { src: withBasePath("/images/gallery-03-placeholder.svg"), alt: "Foto Bintang dan Mega 3" },
    { src: withBasePath("/images/gallery-04-placeholder.svg"), alt: "Foto Bintang dan Mega 4" },
    { src: withBasePath("/images/gallery-05-placeholder.svg"), alt: "Foto Bintang dan Mega 5" },
    { src: withBasePath("/images/gallery-06-placeholder.svg"), alt: "Foto Bintang dan Mega 6" },
  ],
  gift: {
    note:
      "Kehadiran Anda adalah hadiah terbesar bagi kami. Bagi yang ingin memberikan tanda kasih dari jauh, kami sertakan informasi berikut.",
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
  ucapan: {
    description:
      "Doa dan ucapan dari Anda sangat berarti bagi kami. Kirimkan lewat pesan singkat berikut.",
    namePlaceholder: "Nama Anda",
    messagePlaceholder: "Tuliskan ucapan dan doa Anda di sini...",
    submitLabel: "Kirim Ucapan",
  },
  seo: {
    title: "Pernikahan Bintang & Mega",
    description:
      "Bergabunglah bersama kami merayakan pernikahan Bintang dan Mega — di bawah bintang, bersama orang-orang yang kami cintai.",
    ogImageAlt: "Undangan Pernikahan Bintang & Mega",
  },
};
