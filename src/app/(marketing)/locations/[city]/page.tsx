import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeUp } from "@/components/FadeUp";
import { JsonLd } from "@/components/JsonLd";
import { company, siteUrl } from "@/lib/company";
import {
  getLocation,
  locationSlugs,
  type LocationCity,
} from "@/lib/locations";

type Props = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return locationSlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return { title: "Location" };

  const title = `Restaurant & hospitality software in ${loc.name}`;
  const description = `Hostora hospitality ops software for restaurants, takeaways, events, hotel F&B, and food carts serving operators in ${loc.name}, ${loc.country}. Book a demo.`;

  return {
    title,
    description,
    alternates: { canonical: `/locations/${loc.slug}` },
    openGraph: {
      title: `${title} | Hostora`,
      description,
      url: `${siteUrl}/locations/${loc.slug}`,
    },
  };
}

function cityJsonLd(loc: LocationCity) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Hostora",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${siteUrl}/locations/${loc.slug}`,
      description: `Hostora hospitality operations software serving operators in ${loc.name}, ${loc.country}.`,
      provider: {
        "@type": "Organization",
        name: company.legalName,
        url: siteUrl,
        brand: { "@type": "Brand", name: "Hostora Soft" },
      },
      areaServed: {
        "@type": "City",
        name: loc.name,
        containedInPlace: {
          "@type": "Country",
          name: loc.country,
        },
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GBP",
        description: "Package quote after demo — contact sales",
        url: `${siteUrl}/contact`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: company.legalName,
      brand: { "@type": "Brand", name: company.productBrand },
      url: siteUrl,
      areaServed: {
        "@type": "City",
        name: loc.name,
        addressCountry: loc.countryCode,
      },
    },
  ];
}

export default async function LocationCityPage({ params }: Props) {
  const { city: slug } = await params;
  const loc = getLocation(slug);
  if (!loc) notFound();

  return (
    <div className="px-6 pb-28 pt-20">
      <JsonLd data={cityJsonLd(loc)} />
      <div className="mx-auto max-w-3xl">
        <FadeUp>
          <p className="eyebrow">
            <Link href="/locations" className="hover:text-foreground">
              Locations
            </Link>
            {" · "}
            {loc.country}
          </p>
          <h1 className="display mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            Restaurant &amp; hospitality software in {loc.name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Hostora Soft serves operators in {loc.name} with packaged hospitality
            ops — not a walk-in shop on every street. Remote demos and pack
            installs from {company.legalName} ({loc.timezone}).
          </p>
        </FadeUp>

        <FadeUp delay={0.06}>
          <p className="mt-10 text-base leading-relaxed text-foreground">
            {loc.blurb}
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Choose a{" "}
            <Link href="/solutions" className="text-accent hover:underline">
              Restaurant, Takeaway, or Events pack
            </Link>
            , or configure hotel F&amp;B and food carts to the operator. Optional{" "}
            <Link href="/hardware" className="text-accent hover:underline">
              Docker local server and floor kit
            </Link>{" "}
            when the venue wants devices on the LAN. See the full{" "}
            <Link href="/product" className="text-accent hover:underline">
              product modules
            </Link>
            .
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted">
            We do not invent local storefronts or rankings. Service means demos,
            surveys, and go-live for businesses in {loc.name} — same packs sold
            across the {company.markets}.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background"
            >
              Book a demo for {loc.name}
            </Link>
            <Link
              href="/locations"
              className="inline-flex rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground"
            >
              All cities
            </Link>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
