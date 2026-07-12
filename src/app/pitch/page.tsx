"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PitchSlideVideo } from "@/components/PitchSlideVideo";
import { pitchClips } from "@/lib/productMedia";

const SWIPE_THRESHOLD_PX = 56;

type Slide = {
  eyebrow: string;
  title: string;
  accent?: string;
  body: string;
  cta?: boolean;
  media: {
    video: string;
    poster: string;
    label: string;
  };
};

const slides: Slide[] = [
  {
    eyebrow: "Hostora",
    title: "Run the floor.",
    accent: "From booking to last pour.",
    body: "Hospitality operations for restaurants, takeaways, event venues, hotels, and food carts — US & Europe.",
    media: pitchClips.open,
  },
  {
    eyebrow: "The problem",
    title: "Busy nights break patchwork tools.",
    body: "Separate till apps, kitchen screens, booking widgets, and spreadsheets create missed tickets, slow service, and no single source of truth.",
    media: pitchClips.problem,
  },
  {
    eyebrow: "Who it's for",
    title: "Five businesses. One spine.",
    body: "Restaurants · Takeaways · Event venues · Hotels · Food carts — packaged for venues; hotel F&B and carts configured and built to each operator.",
    media: pitchClips.icp,
  },
  {
    eyebrow: "The product",
    title: "One platform for the whole service.",
    body: "POS, kitchen display, guest QR, payments, inventory, HR, accounting, and supervisor controls — together.",
    media: pitchClips.product,
  },
  {
    eyebrow: "Till",
    title: "Orders that keep pace with the room.",
    body: "Open tabs, modifiers, split bills, and payments designed for real floor pressure — not demo day.",
    media: pitchClips.till,
  },
  {
    eyebrow: "Kitchen & print",
    title: "Every station sees what matters.",
    body: "Live KDS by area, thermal routing for food / bar / specialty stations, and busy-period reliability.",
    media: pitchClips.kitchen,
  },
  {
    eyebrow: "Guests & QR",
    title: "Guests order. You prepare.",
    body: "Table ordering QR, seating invites, and reservation flows that connect guests to service.",
    media: pitchClips.guests,
  },
  {
    eyebrow: "Money & insight",
    title: "Payments and reporting operators trust.",
    body: "Sales reports, hourly analytics, and day / week / month views — framed for US and European operators.",
    media: pitchClips.money,
  },
  {
    eyebrow: "Control",
    title: "Stock, staff, and supervisors.",
    body: "Inventory thresholds, HR and attendance, deletion audits, and live monitoring when the floor gets loud.",
    media: pitchClips.control,
  },
  {
    eyebrow: "Deploy",
    title: "Built for real venues.",
    body: "On-prem printing, multi-station kitchens, and operational controls — not a cloud-only slideware POS.",
    media: pitchClips.deploy,
  },
  {
    eyebrow: "Proof",
    title: "Proven under live service load.",
    body: "Hostora is the commercial brand for a platform already running multi-station hospitality venues. Ask for a private case walkthrough.",
    media: pitchClips.proof,
  },
  {
    eyebrow: "Next step",
    title: "Book a Hostora demo.",
    body: "Per-venue licensing. Custom quotes for multi-site. Sales reps: leave this slide open and take discovery notes.",
    cta: true,
    media: pitchClips.cta,
  },
];

export default function PitchPage() {
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      tracking = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking || e.changedTouches.length !== 1) {
        tracking = false;
        return;
      }
      tracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
      if (Math.abs(dx) <= Math.abs(dy)) return;
      if (dx < 0) next();
      else prev();
    };

    const onTouchCancel = () => {
      tracking = false;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchCancel, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [next, prev]);

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-dvh flex-col overflow-hidden bg-background hero-glow"
    >
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/brand/mark.svg" alt="" width={28} height={28} className="rounded-md" />
          <span className="display text-base font-bold">Hostora</span>
        </Link>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span>
            {index + 1} / {total}
          </span>
          <span className="sm:hidden">Swipe</span>
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
            className="mx-auto w-full max-w-6xl"
          >
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
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
                      href="mailto:sales@hostorasoft.co.uk"
                      className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold"
                    >
                      sales@hostorasoft.co.uk
                    </a>
                  </div>
                ) : null}
              </div>

              <PitchSlideVideo
                key={slide.media.video}
                video={slide.media.video}
                poster={slide.media.poster}
                label={slide.media.label}
                active
              />
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
