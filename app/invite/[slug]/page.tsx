import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuestBySlug, getAllGuestSlugs } from "@/lib/guests";
import { siteContent } from "@/lib/content";
import { WeddingInvitation } from "@/components/WeddingInvitation";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllGuestSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);
  const name = guest?.groupLabel ?? guest?.name;

  const title = name
    ? `Anda diundang, ${name}! — ${siteContent.seo.title}`
    : siteContent.seo.title;

  return {
    title,
    description: siteContent.seo.description,
    openGraph: { title, description: siteContent.seo.description },
  };
}

export default async function InvitePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);

  if (!guest) {
    notFound();
  }

  return <WeddingInvitation guest={guest} />;
}
