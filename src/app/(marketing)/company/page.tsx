import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Company information",
  description: `${company.legalName} (company number ${company.number}) — UK private limited company behind Hostora Soft / hostorasoft hospitality operations software. Registered office: ${company.registeredOffice}.`,
  alternates: { canonical: "/company" },
};

const rows = [
  { label: "Legal name", value: company.legalName },
  { label: "Company number", value: company.number },
  { label: "Company type", value: "Private limited company" },
  { label: "Place of registration", value: company.placeOfRegistration },
  { label: "Registered office", value: company.registeredOffice },
  { label: "Nature of business", value: company.sic.join("; ") },
  { label: "Product brand", value: company.productBrand },
  { label: "Also known as", value: "Hostora Soft / hostorasoft" },
  { label: "Product category", value: "Hospitality operations / restaurant OS" },
  { label: "Markets served", value: company.markets },
  { label: "Contact email", value: company.email },
];

export default function CompanyPage() {
  return (
    <div className="px-6 pb-28 pt-20">
      <div className="mx-auto max-w-3xl">
        <FadeUp>
          <p className="eyebrow">Legal</p>
          <h1 className="display mt-4 text-5xl font-extrabold md:text-6xl">
            Company information
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Trading disclosures for {company.legalName}, the UK company that
            develops and sells Hostora Soft (hostorasoft) — hospitality
            operations software for restaurants, takeaways, events, hotel F&amp;B,
            and food carts.
          </p>
        </FadeUp>

        <FadeUp delay={0.04}>
          <div className="mt-10 space-y-4 text-base leading-relaxed text-muted">
            <p>
              <span className="text-foreground">Hostora</span>,{" "}
              <span className="text-foreground">Hostora Soft</span>, and{" "}
              <span className="text-foreground">hostorasoft</span> refer to the
              same product brand of {company.legalName}. Category: hospitality
              operations / restaurant OS (POS, kitchen display, guest QR,
              payments, inventory, HR) — not a hotel PMS.
            </p>
            <p>
              This is <span className="text-foreground">not</span> hostora.eu
              (a different brand). Official sites:{" "}
              <a
                className="text-accent hover:underline"
                href="https://www.hostorasoft.co.uk"
              >
                www.hostorasoft.co.uk
              </a>{" "}
              and hostorasoft.com. Markets and{" "}
              <Link href="/locations" className="text-accent hover:underline">
                cities we serve
              </Link>
              ; product detail on{" "}
              <Link href="/product" className="text-accent hover:underline">
                /product
              </Link>{" "}
              and long-form notes on{" "}
              <Link href="/blog" className="text-accent hover:underline">
                /blog
              </Link>
              .
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.06}>
          <dl className="mt-14 space-y-6 border-t border-border pt-10">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-6"
              >
                <dt className="text-sm text-muted">{row.label}</dt>
                <dd className="text-foreground">
                  {row.label === "Contact email" ? (
                    <a
                      className="text-accent hover:underline"
                      href={`mailto:${row.value}`}
                    >
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
            <div className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="text-sm text-muted">Companies House</dt>
              <dd>
                <a
                  className="text-accent hover:underline"
                  href={company.companiesHouseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View filing record (17014542)
                </a>
              </dd>
            </div>
          </dl>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="mt-12 text-sm leading-relaxed text-muted">
            These details are published to meet UK company trading disclosure and
            e-commerce information requirements. VAT registration will be shown
            here if and when the company is VAT-registered.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            {company.legalName} also offers{" "}
            <Link href="/business-it" className="text-accent hover:underline">
              business IT &amp; install services
            </Link>{" "}
            (corporate, NHS non-clinical sites, motor offices) — separate from
            the Hostora hospitality product.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background"
          >
            Contact sales
          </Link>
        </FadeUp>
      </div>
    </div>
  );
}
