import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { hardwareItems } from "@/lib/hardwareMedia";

export const metadata: Metadata = {
  title: "Hardware — servers, tills, printers & scanners",
  description:
    "Hostora software with installed hardware: Docker local servers (app + PostgreSQL), POS tills, tablet POS, payment terminals, thermal and receipt printers, barcode and QR scanners. Quoted with your pack.",
  alternates: { canonical: "/hardware" },
};

export default function HardwarePage() {
  return (
    <div className="px-6 pb-28 pt-20">
      <div className="mx-auto max-w-5xl">
        <FadeUp>
          <p className="eyebrow">Hardware</p>
          <h1 className="display mt-4 max-w-3xl text-5xl font-extrabold md:text-7xl">
            Hardware that{" "}
            <span className="text-accent">runs Hostora</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            A local Hostora server runs the full stack in Docker — software and
            PostgreSQL — so every device on the floor stays connected. Plus
            tills, tablets, printers, and scanners, installed for live service.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background transition hover:bg-accent-strong"
          >
            Book a demo
          </Link>
        </FadeUp>

        <section className="mt-20" aria-labelledby="kit-heading">
          <FadeUp>
            <h2
              id="kit-heading"
              className="display text-3xl font-bold md:text-4xl"
            >
              The kit
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              Generic hospitality-grade devices — Hostora installed, no OEM
              lock-in story. Quoted with your software package.
            </p>
          </FadeUp>

          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {hardwareItems.map((item, i) => (
              <FadeUp key={item.id} delay={(i % 3) * 0.05}>
                <article>
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#0B0B0C]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      priority={i < 3}
                    />
                  </div>
                  <h3 className="display mt-5 text-xl font-bold">{item.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.desc}
                  </p>
                </article>
              </FadeUp>
            ))}
          </div>
        </section>

        <FadeUp>
          <div className="mt-24 border-t border-border pt-16 text-center md:text-left">
            <h2 className="display text-3xl font-bold md:text-4xl">
              Software + kit, configured for your floor
            </h2>
            <p className="mt-4 max-w-2xl text-muted leading-relaxed md:mx-0 mx-auto">
              Tell us how many stations print, how many tills you need, and
              whether you want a local Docker server (Hostora + PostgreSQL on
              your network for all devices). We quote the kit with your Restaurant,
              Takeaway, or Events pack — or with a configured hotel F&amp;B / cart
              install.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background transition hover:bg-accent-strong"
            >
              Talk to sales
            </Link>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
