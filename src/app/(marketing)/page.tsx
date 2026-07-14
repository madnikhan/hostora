import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { DeviceMock } from "@/components/DeviceMock";
import { HeroMediaBubbles } from "@/components/HeroMediaBubbles";
import { ProductDemoVideo } from "@/components/ProductDemoVideo";
import { StickyChapter } from "@/components/StickyChapter";
import { productMedia, pitchClips } from "@/lib/productMedia";

export default function HomePage() {
  return (
    <div className="grain">
      <section className="hero-glow relative overflow-hidden px-6 pb-28 pt-24 md:pt-32">
        <HeroMediaBubbles />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <FadeUp>
            <p className="eyebrow">Hospitality OS · US, UK & Europe</p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="display mx-auto mt-6 max-w-4xl text-5xl font-extrabold sm:text-6xl md:text-7xl lg:text-8xl">
              Run the floor.
              <span className="block text-accent">From booking to last pour.</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              Hostora is the all-in-one operations platform for restaurants,
              takeaways, event venues, hotels, and food carts — till, kitchen,
              bookings, payments, stock, and staff in one system.
            </p>
          </FadeUp>
          <FadeUp delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background transition hover:bg-accent-strong"
              >
                Book a demo
              </Link>
              <Link
                href="/product"
                className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition hover:border-foreground/30"
              >
                See the product
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <ProductDemoVideo />

      <StickyChapter
        eyebrow="01 · Till"
        title="Orders that keep pace with the room."
        body="Open tabs, split bills, modifiers, and payments without slowing the floor. Built for busy service — not demo day."
        visual={
          <DeviceMock
            title="Hostora Till"
            src={pitchClips.till.poster}
            alt={productMedia.till.alt}
            video={pitchClips.till.video}
            priority
          />
        }
      />

      <StickyChapter
        eyebrow="02 · Kitchen"
        title="Every station sees what matters."
        body="Kitchen display, bar tickets, and thermal printing routed by station — so food, drinks, and specialty stations stay in sync."
        visual={
          <DeviceMock
            title="Kitchen display"
            src={pitchClips.kitchen.poster}
            alt={productMedia.kds.alt}
            video={pitchClips.kitchen.video}
          />
        }
      />

      <StickyChapter
        eyebrow="03 · Guests"
        title="Guests order. You prepare."
        body="Table QR ordering, seating invites, and reservation flows that connect guests to service — without a patchwork of widgets."
        visual={
          <DeviceMock
            title="Guest QR & seating"
            src={pitchClips.guests.poster}
            alt={productMedia.guestQr.alt}
            video={pitchClips.guests.video}
          />
        }
      />

      <StickyChapter
        eyebrow="04 · Control"
        title="Supervisors see the floor live."
        body="Attendance, deletion audits, and admin visibility when service gets loud — so event nights and peak hours stay intentional."
        visual={
          <DeviceMock
            title="Supervisor & control"
            src={pitchClips.control.poster}
            alt={productMedia.supervisor.alt}
            video={pitchClips.control.video}
          />
        }
      />

      <section className="border-t border-border px-6 py-24 md:py-28">
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <p className="eyebrow">Proof</p>
            <h2 className="display mt-4 max-w-3xl text-3xl font-bold md:text-5xl">
              Patchwork tools out.{" "}
              <span className="text-accent">One spine in.</span>
            </h2>
            <p className="mt-5 max-w-xl text-muted leading-relaxed">
              Venues lose tickets and time switching between till apps, kitchen
              screens, and booking widgets. Hostora replaces the patchwork.
            </p>
          </FadeUp>

          <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
            <FadeUp>
              <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                Before
              </p>
              <ul className="mt-5 space-y-4 text-sm text-muted">
                <li className="border-b border-border pb-4">
                  Separate till app
                </li>
                <li className="border-b border-border pb-4">
                  Paper or orphan kitchen tickets
                </li>
                <li className="border-b border-border pb-4">
                  Booking widget bolted on
                </li>
              </ul>
            </FadeUp>
            <FadeUp delay={0.06}>
              <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
                After
              </p>
              <div className="mt-5 rounded-2xl border border-accent/30 bg-accent-soft px-6 py-8">
                <p className="display text-2xl font-bold text-foreground md:text-3xl">
                  Hostora
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  One operational spine — till, kitchen, guest QR, payments,
                  stock, and staff — on your network, with optional Docker
                  local server and kit.
                </p>
              </div>
            </FadeUp>
          </div>

          <FadeUp>
            <p className="mt-16 text-xs font-medium tracking-[0.2em] text-accent uppercase">
              Go-live
            </p>
            <ol className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  n: "01",
                  t: "Survey",
                  d: "Covers, stations, printers, vertical.",
                },
                {
                  n: "02",
                  t: "Configure",
                  d: "Software ± Docker server and floor kit.",
                },
                {
                  n: "03",
                  t: "Train",
                  d: "Floor and kitchen on the live workflows.",
                },
                {
                  n: "04",
                  t: "Live service",
                  d: "One spine under peak load.",
                },
              ].map((step) => (
                <li key={step.n}>
                  <p className="text-xs text-accent">{step.n}</p>
                  <p className="display mt-2 text-xl font-bold">{step.t}</p>
                  <p className="mt-2 text-sm text-muted">{step.d}</p>
                </li>
              ))}
            </ol>
            <Link
              href="/contact"
              className="mt-12 inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background transition hover:bg-accent-strong"
            >
              Book a demo
            </Link>
          </FadeUp>
        </div>
      </section>

      <section className="border-t border-border px-6 py-24">
        <FadeUp>
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow">Hardware</p>
            <h2 className="display mt-4 text-3xl font-bold md:text-5xl">
              Servers, tills, printers, scanners —{" "}
              <span className="text-accent">Hostora installed</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted">
              Optional kit with the software: local servers, POS and tablet
              stations, thermal printers, QR scanners, and payment terminals.
            </p>
            <Link
              href="/hardware"
              className="mt-8 inline-flex rounded-full border border-border px-7 py-3.5 text-sm font-semibold transition hover:border-foreground/30"
            >
              See hardware
            </Link>
          </div>
        </FadeUp>
      </section>

      <section className="border-t border-border px-6 py-28">
        <FadeUp>
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow">Built to sell</p>
            <h2 className="display mt-4 text-4xl font-bold md:text-6xl">
              One platform. Five businesses.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              Restaurants, takeaways, event venues, hotels, and food carts share
              the same operational spine — packaged for venues, tailored for
              hotel F&amp;B and mobile carts.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/solutions"
                className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background"
              >
                Explore solutions
              </Link>
              <Link
                href="/pitch"
                className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold"
              >
                Open sales pitch
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
