"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { siteContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Gallery() {
  const { gallery } = siteContent;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-20 sm:py-28">
      <Container className="max-w-4xl">
        <SectionHeading eyebrow="Moments" title="Gallery" />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {gallery.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative aspect-square overflow-hidden rounded-lg border border-gold-400/15"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-110"
                sizes="(min-width: 640px) 33vw, 50vw"
              />
            </button>
          ))}
        </div>
      </Container>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={gallery[openIndex].alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-950/90 p-6"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close image"
            className="absolute top-6 right-6 rounded-full border border-gold-400/40 p-2 text-gold-300 transition hover:bg-gold-400/10"
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
