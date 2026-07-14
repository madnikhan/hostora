"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { productMedia } from "@/lib/productMedia";

/** Compact muted demo loop for the contact page. */
export function ContactDemoTeaser() {
  const reduce = useReducedMotion();
  const { src, poster } = productMedia.demoVideo;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative aspect-video bg-surface-2">
        {reduce ? (
          <Image
            src={poster}
            alt="Hostora product interface"
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
          />
        ) : (
          <video
            className="h-full w-full object-cover"
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
      </div>
      <p className="px-4 py-3 text-xs text-muted">
        Live till, kitchen, and reporting — same spine venues run under load.
      </p>
    </div>
  );
}
