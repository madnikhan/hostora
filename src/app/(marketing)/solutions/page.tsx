import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { DeviceMock } from "@/components/DeviceMock";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { productMedia, pitchClips } from "@/lib/productMedia";

export const metadata: Metadata = {
  title: "Solutions for restaurants, hotels, takeaways & food carts",
  description:
    "Hostora Restaurant, Takeaway, and Events packs — plus hotel F&B and food carts configured to the operator. Hospitality ops software, not a bespoke build.",
  alternates: { canonical: "/solutions" },
};

const solutions = [
  {
    title: "Restaurant pack",
    body: "Replace till + kitchen tickets + booking widgets with one spine. Table maps, waiter workflows, kitchen routing, and guest QR — go-live in days after a short floor survey.",
    points: ["Floor & table control", "Multi-station kitchen", "Guest QR & seating", "Pack — not a rewrite"],
    media: productMedia.tables,
    video: pitchClips.till.video,
    poster: pitchClips.till.poster,
    frame: "Tables",
  },
  {
    title: "Takeaway pack",
    body: "Fast ticket flow, clear kitchen boards, and payment capture built for speed — a fixed pack operators can run Monday, without a custom project.",
    points: ["Rapid order entry", "Station printing", "End-of-day reports", "Pack — not a rewrite"],
    media: productMedia.kds,
    video: pitchClips.kitchen.video,
    poster: pitchClips.kitchen.poster,
    frame: "Kitchen",
  },
  {
    title: "Events pack",
    body: "Large covers, timed service, and live supervisor monitoring so private dining and events stay controlled — packaged for high-stakes service nights.",
    points: ["High-capacity service", "Supervisor alerts", "Staff & shift visibility", "Pack — not a rewrite"],
    media: productMedia.supervisor,
    video: pitchClips.control.video,
    poster: pitchClips.control.poster,
    frame: "Control",
  },
  {
    title: "Hotel F&B",
    body: "Hotel restaurants, room service, and banquet kitchens on one ops spine — configured to the property’s outlets and service style. Not a hotel PMS.",
    points: [
      "Room service & outlet tills",
      "Banquet / multi-station kitchen",
      "Staff & supervisor visibility",
      "Configured per property",
    ],
    media: productMedia.kds,
    video: pitchClips.guests.video,
    poster: pitchClips.guests.poster,
    frame: "Hotel F&B",
  },
  {
    title: "Food carts",
    body: "Mobile and street-food operators — till, tickets, and stock configured for a cart or trailer, not a full dining room.",
    points: [
      "Mobile till & payments",
      "Fast ticket flow",
      "Stock for a tight footprint",
      "Configured to the cart",
    ],
    media: productMedia.till,
    video: pitchClips.till.video,
    poster: pitchClips.till.poster,
    frame: "Cart till",
  },
];

const faqs = [
  {
    q: "What software does Hostora provide for restaurants?",
    a: "The Restaurant pack: POS/till, kitchen display, guest QR, payments, inventory, HR/attendance, and reporting — a packaged ops spine for live floor service, not a bespoke build.",
  },
  {
    q: "Do you offer hotel software?",
    a: "Yes for hotel F&B — restaurants, room service, and banquet kitchens, configured per property. Hostora is not a hotel PMS; rooms and front desk stay with your property system.",
  },
  {
    q: "Can takeaways and food carts use Hostora?",
    a: "Yes. Takeaways get the Takeaway pack (fast tickets + kitchen + reports). Food carts get a configured mobile setup — same product, not a rewrite.",
  },
  {
    q: "Who builds and sells Hostora?",
    a: "Hostora is a product brand of K WAZIR LTD (Companies House 17014542), sold across the US, UK and Europe. Restaurant / Takeaway / Events packs are quoted after demo; hotel F&B and carts get a configured quote.",
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
    <div className="pb-28">
      <JsonLd data={faqJsonLd} />
      <PageHero
        eyebrow="Solutions"
        title="Built for how hospitality actually works."
        description="Restaurant, Takeaway, and Events packs for operators who need a system that goes live in days — plus hotel F&B and food carts configured to the outlets or footprint."
      >
        <Button href="/contact">Book a demo</Button>
        <Button href="/product" variant="secondary">
          See the product
        </Button>
      </PageHero>

      <div className="mx-auto max-w-5xl px-6">
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
                    src={s.poster}
                    alt={s.media.alt}
                    video={s.video}
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
              className="inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background transition hover:bg-accent-strong"
            >
              Book a demo
            </Link>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
