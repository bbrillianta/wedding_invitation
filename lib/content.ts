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
    // His face sits higher in the frame than Mega's; this lines their eyes up.
    groomPhotoPosition: "50% 26%",
    groomParents: { father: "Dwi Nugroho Widi", mother: "Rini Setiawati" },
    monogram: "B & M",
    tagline: "Love as boundless as the sky",
  },
  weddingDateISO: "2026-11-28T10:00:00+07:00",
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
  loveStory: [
    {
      dateLabel: "Agustus 2019",
      title: "Cinta pada Pandangan Pertama",
      description:
        "Berawal dari teman sekelas D3 Teknik Informatika PENS, Bintang diam-diam jatuh hati pada Mega. Sayangnya, cinta Bintang kala itu bertepuk sebelah tangan.",
      image: withBasePath("/images/stories/beginning-circle.jpg"),
    },
    {
      dateLabel: "Maret 2024",
      title: "Kesempatan Kedua",
      description:
        "Setelah berpisah jalan—Mega melanjutkan D4 dan Bintang merantau ke Jakarta—takdir mempertemukan mereka kembali. Bintang mencoba mengetuk hati Mega sekali lagi, bahkan hadir di hari wisudanya.",
      image: withBasePath("/images/stories/graduate-circle.jpg"),
    },
    {
      dateLabel: "Maret 2026",
      title: "Awal Selamanya",
      description:
        "Kehadiran dan kesungguhan Bintang perlahan membuat Mega yakin. Hingga akhirnya, Bintang datang bersama keluarganya untuk melamar Mega.",
      image: withBasePath("/images/stories/engagement-circle.jpg"),
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
    messagePlaceholder: "Tuliskan ucapan dan doa Anda di sini...",
    submitLabel: "Kirim Ucapan",
    successMessage: "Terima kasih! Ucapan & doa Anda telah kami terima.",
  },
  seo: {
    title: "Pernikahan Bintang & Mega",
    description:
      "Bergabunglah bersama kami merayakan pernikahan Bintang dan Mega — di bawah bintang, bersama orang-orang yang kami cintai.",
    ogImageAlt: "Undangan Pernikahan Bintang & Mega",
  },
};
