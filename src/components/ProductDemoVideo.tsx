"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { productMedia } from "@/lib/productMedia";
import { FadeUp } from "@/components/FadeUp";

export function ProductDemoVideo() {
  const reduce = useReducedMotion();
  const { src, poster } = productMedia.demoVideo;

  return (
    <section className="border-t border-border px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <FadeUp>
          <p className="eyebrow">Product demo</p>
          <h2 className="display mt-4 max-w-2xl text-3xl font-bold md:text-5xl">
            See Hostora on the floor.
          </h2>
          <p className="mt-4 max-w-xl text-muted leading-relaxed">
            A short look at live till, kitchen, and reporting workflows — the same
            spine venues run under service load.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
              <span className="ml-3 text-xs text-muted">Hostora · live service</span>
            </div>
            <div className="relative aspect-video bg-surface-2">
              {reduce ? (
                <Image
                  src={poster}
                  alt="Hostora product interface"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover object-top"
                />
              ) : (
                <video
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={poster}
                >
                  <source src={src} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
