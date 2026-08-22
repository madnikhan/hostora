import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { ContactDemoTeaser } from "@/components/ContactDemoTeaser";
import { DemoBookingForm } from "@/components/DemoBookingForm";
import { company } from "@/lib/company";
import type { InquiryType } from "@/lib/leads/types";

export const metadata: Metadata = {
  title: "Contact sales",
  description: `Book a Hostora hospitality demo or a business IT inquiry with ${company.legalName}. Restaurants, takeaways, hotel F&B, corporate sites, NHS non-clinical offices, and motor dealerships.`,
  alternates: { canonical: "/contact" },
};

const faqs = [
  {
    q: "We already have a till",
    a: "Hostora is operations — till plus kitchen, guest QR, and supervisor control in one spine, not another standalone till app.",
  },
  {
    q: "We don’t buy custom software",
    a: "Right. Restaurant, Takeaway, and Events packs are a fixed ops spine that go live in days after a short floor survey — not a bespoke rewrite. Hotel F&B and food carts are configured to the outlets or footprint, same product.",
  },
  {
    q: "Cloud POS is enough",
    a: "Real venues need station printing, local resilience, and floor-speed workflows. Packs can include a local Docker server (app + PostgreSQL) so every device stays online on your network.",
  },
  {
    q: "Do you do hotel PMS?",
    a: "No — Hostora runs hotel F&B and floor ops (outlets, kitchen, staff). Rooms and front desk stay with your PMS.",
  },
  {
    q: "Is this Fumari?",
    a: "Fumari is a client venue. Hostora is the product brand from K WAZIR LTD (UK).",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ inquiry?: string | string[] }>;
}) {
  const params = await searchParams;
  const inquiryRaw = Array.isArray(params.inquiry)
    ? params.inquiry[0]
    : params.inquiry;
  const defaultInquiryType: InquiryType =
    inquiryRaw?.toLowerCase() === "it" ||
    inquiryRaw?.toLowerCase() === "it_services"
      ? "it_services"
      : "hospitality";
  const isIt = defaultInquiryType === "it_services";

  return (
    <div className="px-6 pb-28 pt-20">
      <div className="mx-auto grid max-w-5xl gap-14 md:grid-cols-2">
        <FadeUp className="order-1 md:col-start-1">
          <p className="eyebrow">Contact</p>
          <h1 className="display mt-4 text-5xl font-extrabold md:text-6xl">
            {isIt ? "Book an IT call." : "Book a Hostora demo."}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            {isIt
              ? "Hardware, site setup, and office support from K WAZIR LTD — separate from Hostora hospitality software. Pick a slot and we will confirm by email."
              : "Pick a pack or a configured install. We'll confirm by email with a Google Meet link — name, email, company, phone, and business type required."}
          </p>
          <div className="mt-8">
            <ContactDemoTeaser />
          </div>
          <ul className="mt-8 space-y-2 text-sm text-muted">
            <li>
              <span className="text-accent">·</span> Sold across the{" "}
              <span className="text-foreground">{company.markets}</span>
            </li>
            <li>
              <span className="text-accent">·</span>{" "}
              <span className="text-foreground">HMRC-ready</span> accounting
              framing for UK / EU
            </li>
            <li>
              <span className="text-accent">·</span> Optional{" "}
              <span className="text-foreground">Docker local server</span> +
              floor hardware
            </li>
          </ul>
          {!isIt ? (
            <p className="mt-6">
              <a
                href="/sales/Hostora-Quote-Pack.pdf"
                download
                className="text-sm font-semibold text-accent transition hover:text-accent-strong"
              >
                Download quote pack →
              </a>
            </p>
          ) : null}
          <p className="mt-4 text-sm text-muted">
            {isIt ? (
              <>
                Hospitality floor ops?{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  Book a Hostora demo
                </Link>
                .
              </>
            ) : (
              <>
                Need business IT instead?{" "}
                <Link href="/business-it" className="text-accent hover:underline">
                  Business IT &amp; install
                </Link>{" "}
                or select it in the form.
              </>
            )}
          </p>
        </FadeUp>

        <FadeUp delay={0.1} className="order-2 md:col-start-2 md:row-span-2">
          <DemoBookingForm defaultInquiryType={defaultInquiryType} />
        </FadeUp>

        <FadeUp delay={0.05} className="order-3 md:col-start-1">
          <div className="space-y-4 text-sm text-muted">
            <p>
              Vendor:{" "}
              <span className="text-foreground">{company.legalName}</span>
            </p>
            <p>
              Product:{" "}
              <span className="text-foreground">{company.productBrand}</span>
            </p>
            <p>
              Company number:{" "}
              <span className="text-foreground">{company.number}</span>
            </p>
            <p>
              Registered office:{" "}
              <span className="text-foreground">{company.registeredOffice}</span>
            </p>
            <p>
              Email:{" "}
              <a
                className="text-accent hover:underline"
                href={`mailto:${company.email}?subject=Hostora%20demo%20request`}
              >
                {company.email}
              </a>
            </p>
            <p className="pt-2 text-xs leading-relaxed">
              Meetings are 30 minutes, weekdays 09:00–17:00 UK time, subject to
              calendar availability.
            </p>

            <div
              id="reference"
              className="scroll-mt-24 border-t border-border pt-8"
            >
              <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
                Request a reference
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                We do not invent customer logos or public rankings. On a demo we
                can walk a private case under live service load — and, where a
                venue has agreed, introduce a reference. Email{" "}
                <a
                  className="text-accent hover:underline"
                  href={`mailto:${company.email}?subject=Hostora%20reference%20request`}
                >
                  {company.email}
                </a>{" "}
                with &quot;reference request&quot; in the subject, or note it
                when you book a demo.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
                Common questions
              </p>
              <div className="mt-4 space-y-3">
                {faqs.map((item) => (
                  <details key={item.q} className="group">
                    <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="flex items-start justify-between gap-3">
                        {item.q}
                        <span className="text-accent transition group-open:rotate-45">
                          +
                        </span>
                      </span>
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
                Sales pack
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    className="font-medium text-foreground hover:text-accent"
                    href="/sales/Hostora-Quote-Pack.pdf"
                    download
                  >
                    Quote pack (PDF)
                  </a>
                </li>
                <li>
                  <a
                    className="text-foreground hover:text-accent"
                    href="/sales/Hostora-Sales-Presentation.pptx"
                    download
                  >
                    Sales presentation (PPTX)
                  </a>
                </li>
                <li>
                  <a
                    className="text-foreground hover:text-accent"
                    href="/sales/Hostora-Brochure.pdf"
                    download
                  >
                    Brochure (PDF)
                  </a>
                </li>
                <li>
                  <a
                    className="text-foreground hover:text-accent"
                    href="/sales/Hostora-Sales-Rep-Manual.pdf"
                    download
                  >
                    Sales rep manual (PDF)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
