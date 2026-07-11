import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { DeviceMock } from "@/components/DeviceMock";
import { ProductDemoVideo } from "@/components/ProductDemoVideo";
import { StickyChapter } from "@/components/StickyChapter";
import { productMedia } from "@/lib/productMedia";

export default function HomePage() {
  return (
    <div className="grain">
      <section className="hero-glow relative overflow-hidden px-6 pb-28 pt-24 md:pt-32">
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <FadeUp>
            <p className="eyebrow">Hospitality OS · US & Europe</p>
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
            src={productMedia.till.src}
            alt={productMedia.till.alt}
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
            src={productMedia.kds.src}
            alt={productMedia.kds.alt}
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
            src={productMedia.guestQr.src}
            alt={productMedia.guestQr.alt}
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
            src={productMedia.supervisor.src}
            alt={productMedia.supervisor.alt}
          />
        }
      />

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
