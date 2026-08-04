import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { JsonLd } from "@/components/JsonLd";
import { company, siteUrl } from "@/lib/company";
import {
  locations,
  locationsByRegion,
  regionLabels,
  type LocationRegion,
} from "@/lib/locations";

export const metadata: Metadata = {
  title: "Cities we serve — UK, Europe & USA",
  description: `Hostora hospitality software for operators in ${locations.length} major cities across the UK, Europe, and USA. Demos and pack installs — not fake storefronts.`,
  alternates: { canonical: "/locations" },
};

const regions: LocationRegion[] = ["uk", "europe", "usa"];

const hubJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Hostora cities we serve",
  url: `${siteUrl}/locations`,
  description:
    "Cities where Hostora Soft serves restaurant and hospitality operators across the UK, Europe, and USA.",
  isPartOf: {
    "@type": "WebSite",
    name: "Hostora",
    url: siteUrl,
  },
  about: {
    "@type": "Organization",
    name: company.legalName,
    brand: { "@type": "Brand", name: "Hostora Soft" },
    areaServed: ["GB", "EU", "US"],
  },
};

export default function LocationsHubPage() {
  return (
    <div className="px-6 pb-28 pt-20">
      <JsonLd data={hubJsonLd} />
      <div className="mx-auto max-w-4xl">
        <FadeUp>
          <p className="eyebrow">Markets</p>
          <h1 className="display mt-4 text-5xl font-extrabold md:text-6xl">
            Cities we serve
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Hostora Soft demos and installs for restaurant and hospitality
            operators in major cities across the UK, Europe, and USA. Remote-first
            packs from {company.legalName} — not a physical shop in every city.
          </p>
        </FadeUp>

        {regions.map((region, i) => {
          const cities = locationsByRegion(region);
          return (
            <FadeUp key={region} delay={0.04 + i * 0.04}>
              <section className="mt-16">
                <h2 className="display text-2xl font-bold">
                  {regionLabels[region]}
                </h2>
                <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
                  {cities.map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={`/locations/${city.slug}`}
                        className="text-accent hover:underline"
                      >
                        {city.name}
                      </Link>
                      <span className="text-sm text-muted">
                        {" "}
                        · {city.country}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </FadeUp>
          );
        })}

        <FadeUp delay={0.16}>
          <p className="mt-16 text-sm leading-relaxed text-muted">
            Registered office remains Gloucester, England. City pages mean we
            serve operators there — book a demo from{" "}
            <Link href="/contact" className="text-accent hover:underline">
              contact
            </Link>
            .
          </p>
        </FadeUp>
      </div>
    </div>
  );
}
