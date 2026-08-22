import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Business IT & install services",
  description: `${company.legalName} — office hardware, site setup, network support, and install projects for corporate, NHS non-clinical sites, motor dealerships, and home offices. Hospitality venues use Hostora separately.`,
  alternates: { canonical: "/business-it" },
};

const scopes = [
  {
    title: "Corporate & home office",
    body: "PC and laptop setup, printers, Wi‑Fi and small-office networking, backup basics, and remote support when you need a reliable local partner — not a full MSP contract on day one.",
  },
  {
    title: "NHS non-clinical sites",
    body: "Admin offices, reception areas, staff cafés, and small-site hardware refresh. We do not sell clinical systems or chase NHS frameworks before a first small-site win.",
  },
  {
    title: "Motor & dealership offices",
    body: "Reception and back-office IT, display screens, and network setup. If the site has a café or food offer, hospitality floor ops may use Hostora — garage workflows do not.",
  },
  {
    title: "Hardware supply & install",
    body: "Sourced kit, on-site cabling where needed, and handover documentation. Prefer a paid pilot (£500–£2k setup) over free work so both sides commit.",
  },
];

const avoids = [
  "Selling Hostora as “garage software” or general NHS clinical IT",
  "Competing with large MSPs on enterprise SLAs before you have reference sites",
  "Mixing IT services messaging on the Hostora product homepage",
];

export default function BusinessItPage() {
  return (
    <div className="px-6 pb-28 pt-20">
      <div className="mx-auto max-w-3xl">
        <FadeUp>
          <p className="eyebrow">K WAZIR LTD · Business IT</p>
          <h1 className="display mt-4 text-5xl font-extrabold md:text-6xl">
            Business IT &amp; install
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            {company.legalName} also delivers hardware, site setup, and office
            support for corporate, NHS non-clinical, motor, and home-office
            buyers. This is a separate track from{" "}
            <Link href="/product" className="text-accent hover:underline">
              Hostora hospitality software
            </Link>
            .
          </p>
        </FadeUp>

        <FadeUp delay={0.04}>
          <dl className="mt-14 space-y-10 border-t border-border pt-10">
            {scopes.map((item) => (
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

        <FadeUp delay={0.08}>
          <div className="mt-14 border-t border-border pt-10">
            <h2 className="display text-xl font-bold text-foreground">
              Hospitality sites
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Restaurants, takeaways, hotel F&amp;B, event venues, and hospital
              cafés run on{" "}
              <Link href="/contact" className="text-accent hover:underline">
                Hostora
              </Link>
              . IT install for those sites is scoped around network, hardware,
              and optional on-prem Docker — not a generic office support
              contract.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="mt-14 border-t border-border pt-10">
            <h2 className="display text-xl font-bold text-foreground">
              What we avoid
            </h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
              {avoids.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </FadeUp>

        <FadeUp delay={0.12}>
          <div className="mt-14 flex flex-wrap gap-4 border-t border-border pt-10">
            <Link
              href="/contact?inquiry=it"
              className="inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background"
            >
              Book a 15-min call
            </Link>
            <a
              href={`mailto:${company.email}?subject=IT%20inquiry`}
              className="inline-flex rounded-full border border-border px-7 py-3.5 text-sm font-semibold transition hover:border-foreground/30"
            >
              Email sales — IT inquiry
            </a>
          </div>
          <p className="mt-6 text-sm text-muted">
            UK company {company.legalName} (company number {company.number}).
            Registered office: {company.registeredOffice}.{" "}
            <Link href="/company" className="text-accent hover:underline">
              Company information
            </Link>
            .
          </p>
        </FadeUp>
      </div>
    </div>
  );
}
