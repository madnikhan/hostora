import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { HeroMediaBubbles } from "@/components/HeroMediaBubbles";
import { HomeBelowFold } from "@/components/HomeBelowFold";

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

      <HomeBelowFold />

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
                  d: "Pick your pack — covers, stations, printers.",
                },
                {
                  n: "02",
                  t: "Install pack",
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
                  d: "One spine under peak load — in days, not a project.",
                },
              ].map((step) => (
                <li key={step.n}>
                  <p className="text-xs text-accent">{step.n}</p>
                  <p className="display mt-2 text-xl font-bold">{step.t}</p>
                  <p className="mt-2 text-sm text-muted">{step.d}</p>
                </li>
              ))}
            </ol>
          </FadeUp>

          <FadeUp delay={0.06}>
            <div className="mt-16 border-t border-border pt-12">
              <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
                Why operators can verify us
              </p>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2">
                <li className="text-sm leading-relaxed text-muted">
                  <span className="font-semibold text-foreground">
                    UK company on record.
                  </span>{" "}
                  K WAZIR LTD — Companies House{" "}
                  <a
                    className="text-accent hover:underline"
                    href="https://find-and-update.company-information.service.gov.uk/company/17014542"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    17014542
                  </a>
                  . Full trading detail on{" "}
                  <Link href="/company" className="text-accent hover:underline">
                    /company
                  </Link>
                  .
                </li>
                <li className="text-sm leading-relaxed text-muted">
                  <span className="font-semibold text-foreground">
                    Live product, not slides.
                  </span>{" "}
                  Till, kitchen, guests, and control on this site — then a demo
                  with a private case walkthrough when you ask.
                </li>
                <li className="text-sm leading-relaxed text-muted">
                  <span className="font-semibold text-foreground">
                    Data handling you can read.
                  </span>{" "}
                  Optional on-prem Docker on the venue LAN — see{" "}
                  <Link
                    href="/security"
                    className="text-accent hover:underline"
                  >
                    /security
                  </Link>
                  . No invented SOC badges.
                </li>
                <li className="text-sm leading-relaxed text-muted">
                  <span className="font-semibold text-foreground">
                    Package quote, not a vanity price.
                  </span>{" "}
                  How quotes work on{" "}
                  <Link href="/pricing" className="text-accent hover:underline">
                    /pricing
                  </Link>
                  . Sales:{" "}
                  <a
                    className="text-accent hover:underline"
                    href="mailto:sales@hostorasoft.co.uk"
                  >
                    sales@hostorasoft.co.uk
                  </a>
                  .
                </li>
              </ul>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background transition hover:bg-accent-strong"
                >
                  Book a demo
                </Link>
                <Link
                  href="/contact#reference"
                  className="inline-flex rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition hover:border-foreground/30"
                >
                  Request a reference
                </Link>
              </div>
            </div>
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
            <p className="eyebrow">Packs & verticals</p>
            <h2 className="display mt-4 text-4xl font-bold md:text-6xl">
              Packs for venues. Configured where it must be.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              Restaurant, Takeaway, and Events packs share one ops spine — go
              live in days after a short floor survey. Hotel F&amp;B and food
              carts are configured to the outlets or footprint, not rewritten.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted">
              Serving operators across major cities in the UK, Europe, and USA —{" "}
              <Link href="/locations" className="text-accent hover:underline">
                see cities we serve
              </Link>
              .
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
