"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { siteContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Gallery() {
  const { gallery } = siteContent;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-20 sm:py-28">
      <Container className="max-w-4xl">
        <SectionHeading eyebrow="Momen Kami" title="Galeri" />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {gallery.map((image, i) => (
            // The Reveal takes over as the grid cell so the tiles keep
            // their square shape; the button fills it absolutely. Delays
            // ripple across the grid rather than firing all six at once.
            <Reveal
              key={image.src}
              className="relative aspect-square overflow-hidden rounded-lg border border-white/70"
              y={20}
              scale={0.92}
              delay={i * 0.07}
              duration={0.6}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Lihat ${image.alt}`}
                className="group absolute inset-0"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="(min-width: 640px) 33vw, 50vw"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </Container>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={gallery[openIndex].alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/85 p-6"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Tutup gambar"
            className="absolute top-6 right-6 rounded-full border border-white/50 p-2 text-white transition hover:bg-white/15"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-full max-h-[80vh] w-full max-w-2xl">
            <Image
              src={gallery[openIndex].src}
              alt={gallery[openIndex].alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}
