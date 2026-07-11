"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { productMedia } from "@/lib/productMedia";

type Slide = {
  eyebrow: string;
  title: string;
  accent?: string;
  body: string;
  cta?: boolean;
  image?: { src: string; alt: string; label: string };
};

const slides: Slide[] = [
  {
    eyebrow: "Hostora",
    title: "Run the floor.",
    accent: "From booking to last pour.",
    body: "Hospitality operations for restaurants, takeaways, event venues, and hotels — US & Europe.",
  },
  {
    eyebrow: "The problem",
    title: "Busy nights break patchwork tools.",
    body: "Separate till apps, kitchen screens, booking widgets, and spreadsheets create missed tickets, slow service, and no single source of truth.",
  },
  {
    eyebrow: "Who it's for",
    title: "Four businesses. One spine.",
    body: "Restaurants · Takeaways · Event venues · Hotels — packaged for venues; hotel F&B configured and tailored to each property’s outlets.",
  },
  {
    eyebrow: "The product",
    title: "One platform for the whole service.",
    body: "POS, kitchen display, guest QR, payments, inventory, HR, accounting, and supervisor controls — together.",
  },
  {
    eyebrow: "Till",
    title: "Orders that keep pace with the room.",
    body: "Open tabs, modifiers, split bills, and payments designed for real floor pressure — not demo day.",
    image: {
      src: productMedia.till.src,
      alt: productMedia.till.alt,
      label: "Till",
    },
  },
  {
    eyebrow: "Kitchen & print",
    title: "Every station sees what matters.",
    body: "Live KDS by area, thermal routing for food / bar / specialty stations, and busy-period reliability.",
    image: {
      src: productMedia.kds.src,
      alt: productMedia.kds.alt,
      label: "Kitchen display",
    },
  },
  {
    eyebrow: "Guests & QR",
    title: "Guests order. You prepare.",
    body: "Table ordering QR, seating invites, and reservation flows that connect guests to service.",
    image: {
      src: productMedia.guestQr.src,
      alt: productMedia.guestQr.alt,
      label: "Guest QR",
    },
  },
  {
    eyebrow: "Money & insight",
    title: "Payments and reporting operators trust.",
    body: "Sales reports, hourly analytics, and day / week / month views — framed for US and European operators.",
    image: {
      src: productMedia.sales.src,
      alt: productMedia.sales.alt,
      label: "Sales reports",
    },
  },
  {
    eyebrow: "Control",
    title: "Stock, staff, and supervisors.",
    body: "Inventory thresholds, HR and attendance, deletion audits, and live monitoring when the floor gets loud.",
    image: {
      src: productMedia.supervisor.src,
      alt: productMedia.supervisor.alt,
      label: "Control",
    },
  },
  {
    eyebrow: "Deploy",
    title: "Built for real venues.",
    body: "On-prem printing, multi-station kitchens, and operational controls — not a cloud-only slideware POS.",
  },
  {
    eyebrow: "Proof",
    title: "Proven under live service load.",
    body: "Hostora is the commercial brand for a platform already running multi-station hospitality venues. Ask for a private case walkthrough.",
    image: {
      src: productMedia.accounting.src,
      alt: productMedia.accounting.alt,
      label: "Accounting",
    },
  },
  {
    eyebrow: "Next step",
    title: "Book a Hostora demo.",
    body: "Per-venue licensing. Custom quotes for multi-site. Sales reps: leave this slide open and take discovery notes.",
    cta: true,
  },
];

export default function PitchPage() {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const slide = slides[index];

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      }
      if (e.key === "Home") setIndex(0);
      if (e.key === "End") setIndex(total - 1);
      if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) {
          void document.documentElement.requestFullscreen?.();
        } else {
          void document.exitFullscreen?.();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, total]);

  const hasImage = Boolean(slide.image);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background hero-glow">
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/brand/mark.svg" alt="" width={28} height={28} className="rounded-md" />
          <span className="display text-base font-bold">Hostora</span>
        </Link>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span>
            {index + 1} / {total}
          </span>
          <span className="hidden sm:inline">← → navigate · F fullscreen</span>
          <Link href="/" className="hover:text-foreground">
            Exit
          </Link>
        </div>
      </div>

      <div className="relative flex flex-1 items-center px-6 pb-24 md:px-12 lg:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`mx-auto w-full ${hasImage ? "max-w-6xl" : "max-w-5xl"}`}
          >
            <div
              className={
                hasImage
                  ? "grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14"
                  : ""
              }
            >
              <div>
                <motion.p
                  className="eyebrow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  {slide.eyebrow}
                </motion.p>
                <h1 className="display mt-6 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
                  {slide.title}
                  {slide.accent ? (
                    <span className="mt-2 block text-accent">{slide.accent}</span>
                  ) : null}
                </h1>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
                  {slide.body}
                </p>
                {slide.cta ? (
                  <div className="mt-10 flex flex-wrap gap-4">
                    <Link
                      href="/contact"
                      className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background"
                    >
                      Book a demo
                    </Link>
                    <a
                      href="mailto:sales@hostora.io"
                      className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold"
                    >
                      sales@hostora.io
                    </a>
                  </div>
                ) : null}
              </div>

              {slide.image ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
                >
                  <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
                    <span className="ml-3 text-xs text-muted">{slide.image.label}</span>
                  </div>
                  <div className="relative aspect-16/10">
                    <Image
                      src={slide.image.src}
                      alt={slide.image.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 520px"
                      className="object-cover object-top"
                      priority={index < 6}
                    />
                  </div>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 py-6 md:px-10">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          className="rounded-full border border-border px-5 py-2.5 text-sm disabled:opacity-30"
        >
          Back
        </button>
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-accent" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          disabled={index === total - 1}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}
