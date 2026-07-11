import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { DeviceMock } from "@/components/DeviceMock";
import { JsonLd } from "@/components/JsonLd";
import { productMedia } from "@/lib/productMedia";

export const metadata: Metadata = {
  title: "Solutions for restaurants, hotels, takeaways & food carts",
  description:
    "Hostora hospitality software for restaurants, takeaways, event venues, hotel F&B, and food carts — packaged for venues, tailored for hotels and mobile operators.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: "Hostora solutions — restaurants to food carts",
    description:
      "One operations spine for restaurants, takeaways, events, hotel F&B, and food carts.",
  },
};

const solutions = [
  {
    title: "Restaurants",
    body: "Table maps, waiter workflows, kitchen routing, and guest QR — from quiet lunch to Saturday night chaos.",
    points: ["Floor & table control", "Multi-station kitchen", "Guest QR & seating"],
    media: productMedia.tables,
    frame: "Tables",
  },
  {
    title: "Takeaways",
    body: "Fast ticket flow, clear kitchen boards, and payment capture built for speed — without losing order accuracy.",
    points: ["Rapid order entry", "Station printing", "End-of-day reports"],
    media: productMedia.kds,
    frame: "Kitchen",
  },
  {
    title: "Event venues",
    body: "Large covers, timed service, and live supervisor monitoring so private dining and events stay controlled.",
    points: ["High-capacity service", "Supervisor alerts", "Staff & shift visibility"],
    media: productMedia.supervisor,
    frame: "Control",
  },
  {
    title: "Hotels",
    body: "Hotel restaurants, room service, and banquet kitchens on one ops spine — configured to the property’s outlets and service style.",
    points: [
      "Room service & outlet tills",
      "Banquet / multi-station kitchen",
      "Staff & supervisor visibility",
      "Tailored per property",
    ],
    media: productMedia.kds,
    frame: "Hotel F&B",
  },
  {
    title: "Food carts",
    body: "Mobile and street-food operators — till, tickets, and stock configured for a cart or trailer, not a full dining room.",
    points: [
      "Mobile till & payments",
      "Fast ticket flow",
      "Stock for a tight footprint",
      "Built to your cart setup",
    ],
    media: productMedia.till,
    frame: "Cart till",
  },
];

const faqs = [
  {
    q: "What software does Hostora provide for restaurants?",
    a: "Hostora is an all-in-one hospitality ops platform: POS/till, kitchen display, guest QR, payments, inventory, HR/attendance, and reporting — designed for live floor service.",
  },
  {
    q: "Do you offer hotel software?",
    a: "Yes for hotel F&B — restaurants, room service, and banquet kitchens. Hostora is not a hotel PMS; rooms and front desk stay with your property system. Hotel deployments are configured per property.",
  },
  {
    q: "Can takeaways and food carts use Hostora?",
    a: "Yes. Takeaways use packaged fast-ticket workflows. Food carts get a tailored setup for mobile till, tickets, payments, and tight-footprint stock.",
  },
  {
    q: "Who builds and sells Hostora?",
    a: "Hostora is a product brand of InvetiveByte LLC, sold across the US and Europe. Pricing is a custom quote per venue.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export default function SolutionsPage() {
  return (
    <div className="px-6 pb-28 pt-20">
      <JsonLd data={faqJsonLd} />
      <div className="mx-auto max-w-5xl">
        <FadeUp>
          <p className="eyebrow">Solutions</p>
          <h1 className="display mt-4 max-w-3xl text-5xl font-extrabold md:text-7xl">
            Built for how hospitality actually works.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
            Software for restaurants, takeaways, event venues, hotel F&amp;B, and
            food carts — one ops spine, configured for how each business runs.
          </p>
        </FadeUp>

        <div className="mt-16 space-y-10">
          {solutions.map((s, i) => (
            <FadeUp key={s.title} delay={i * 0.06}>
              <article className="rounded-[2rem] border border-border bg-surface p-8 md:p-12">
                <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
                  <div>
                    <h2 className="display text-3xl font-bold md:text-5xl">{s.title}</h2>
                    <p className="mt-4 max-w-xl text-lg text-muted leading-relaxed">
                      {s.body}
                    </p>
                    <ul className="mt-6 space-y-3 text-sm">
                      {s.points.map((p) => (
                        <li
                          key={p}
                          className="rounded-full border border-border bg-surface-2 px-4 py-2.5"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <DeviceMock
                    title={s.frame}
                    src={s.media.src}
                    alt={s.media.alt}
                    priority={i === 0}
                  />
                </div>
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp>
          <section className="mt-20 border-t border-border pt-16">
            <h2 className="display text-3xl font-bold md:text-4xl">
              Common questions
            </h2>
            <dl className="mt-10 space-y-8">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="text-lg font-semibold text-foreground">{f.q}</dt>
                  <dd className="mt-2 max-w-3xl text-muted leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </FadeUp>

        <FadeUp>
          <div className="mt-16 text-center">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background"
            >
              Book a demo
            </Link>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
