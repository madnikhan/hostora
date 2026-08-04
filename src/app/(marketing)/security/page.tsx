import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Security & data handling",
  description: `How ${company.legalName} handles Hostora hospitality software data — UK vendor entity, optional on-prem Docker on the venue LAN, and honest claims (no invented certifications).`,
  alternates: { canonical: "/security" },
};

const points = [
  {
    title: "UK trading entity",
    body: `${company.legalName} (company number ${company.number}) develops and sells Hostora Soft. Registered office in Gloucester, England — viewable on Companies House.`,
  },
  {
    title: "Optional on-prem Docker",
    body: "Packs can include a local Docker stack (Hostora app + PostgreSQL) so tills, kitchen displays, and printers stay online on the venue LAN. Operational data can remain on your network when you choose on-prem.",
  },
  {
    title: "Cloud deploy",
    body: "Cloud-hosted installs are available when a venue prefers managed hosting. Access is limited to authorised venue staff and Hostora support for the engagement.",
  },
  {
    title: "Payments",
    body: "Card payments run through payment terminals configured with the pack. Hostora is hospitality operations software — we do not claim to be a card acquirer or invent PCI certifications we have not obtained.",
  },
  {
    title: "Accounting framing",
    body: "Reporting is framed for HMRC-ready accounting workflows for UK / EU operators. Always confirm tax treatment with your accountant.",
  },
  {
    title: "What we do not claim",
    body: "We do not publish fake SOC 2, ISO, or “#1 security” badges. Ask sales for the current data-handling detail for your deploy model.",
  },
];

export default function SecurityPage() {
  return (
    <div className="px-6 pb-28 pt-20">
      <div className="mx-auto max-w-3xl">
        <FadeUp>
          <p className="eyebrow">Trust</p>
          <h1 className="display mt-4 text-5xl font-extrabold md:text-6xl">
            Security &amp; data handling
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Straight answers for operators comparing Hostora Soft to other
            hospitality platforms — what we can verify today, without invented
            certifications.
          </p>
        </FadeUp>

        <FadeUp delay={0.06}>
          <dl className="mt-14 space-y-10 border-t border-border pt-10">
            {points.map((item) => (
              <div key={item.title}>
                <dt className="display text-xl font-bold text-foreground">
                  {item.title}
                </dt>
                <dd className="mt-3 text-base leading-relaxed text-muted">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="mt-14 flex flex-wrap gap-4 border-t border-border pt-10">
            <Link
              href="/company"
              className="inline-flex rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition hover:border-foreground/30"
            >
              Company information
            </Link>
            <a
              href={company.companiesHouseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition hover:border-foreground/30"
            >
              Companies House
            </a>
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background transition hover:bg-accent-strong"
            >
              Ask sales about your deploy
            </Link>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
