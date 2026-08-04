import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Pricing — how Hostora quotes work",
  description:
    "Hostora Soft uses package quotes after demo for Restaurant, Takeaway, and Events packs — configured quotes for hotel F&B and food carts. No public rate card; see what drives the quote.",
  alternates: { canonical: "/pricing" },
};

const drivers = [
  {
    title: "Vertical pack",
    body: "Restaurant, Takeaway, or Events packs share one ops spine with packaging that matches the floor. Hotel F&B and food carts are configured to outlets or footprint — same product, configured quote.",
  },
  {
    title: "Stations & printers",
    body: "How many till, kitchen, and bar stations you need — and how tickets route — drives software and kit scope after a short floor survey.",
  },
  {
    title: "Optional hardware",
    body: "Local Docker server, tills, tablets, thermal printers, scanners, and payment terminals are quoted with the package when you want Hostora installed on the floor — not required if you bring compatible devices.",
  },
  {
    title: "Go-live & support",
    body: "Survey, install, train, live service. Multi-site discounts by agreement. Exact figures are confirmed after demo — not published as a vanity price list.",
  },
];

export default function PricingPage() {
  return (
    <div className="px-6 pb-28 pt-20">
      <div className="mx-auto max-w-3xl">
        <FadeUp>
          <p className="eyebrow">Commercial</p>
          <h1 className="display mt-4 text-5xl font-extrabold md:text-6xl">
            Pricing guidance
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Hostora Soft is sold as a{" "}
            <span className="text-foreground">package quote after demo</span> —
            not a till-app monthly sticker you can compare in a spreadsheet
            without knowing stations and kit. {company.legalName} quotes for
            operators across the {company.markets}.
          </p>
        </FadeUp>

        <FadeUp delay={0.05}>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div className="border-t border-border pt-6">
              <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
                Packs
              </p>
              <p className="display mt-3 text-xl font-bold">
                Restaurant · Takeaway · Events
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Fixed ops spine. Package quote after demo — go live in days
                after a short floor survey.
              </p>
            </div>
            <div className="border-t border-border pt-6">
              <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
                Configured
              </p>
              <p className="display mt-3 text-xl font-bold">
                Hotel F&amp;B · Food carts
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Same product configured to outlets or cart footprint — not a
                hotel PMS, not a bespoke rewrite.
              </p>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <h2 className="display mt-16 text-2xl font-bold md:text-3xl">
            What drives the quote
          </h2>
          <ul className="mt-8 space-y-8">
            {drivers.map((item) => (
              <li key={item.title} className="border-b border-border pb-8">
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="mt-12 rounded-2xl border border-accent/30 bg-accent-soft px-6 py-8">
            <p className="display text-xl font-bold text-foreground">
              Not another cheap till app
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Quote the package against lost tickets and staff time — not
              against the cheapest standalone till. We do not publish public
              monthly £/$ rates on this site; book a demo for a package quote
              sized to your floor.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background transition hover:bg-accent-strong"
            >
              Book a demo for a package quote
            </Link>
            <Link
              href="/solutions"
              className="inline-flex rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition hover:border-foreground/30"
            >
              See packs &amp; verticals
            </Link>
            <a
              href="/sales/Hostora-Quote-Pack.pdf"
              download
              className="inline-flex rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition hover:border-foreground/30"
            >
              Download quote pack
            </a>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
