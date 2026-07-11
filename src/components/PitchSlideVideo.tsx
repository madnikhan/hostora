"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";

export function PitchSlideVideo({
  video,
  poster,
  label,
  active,
}: {
  video: string;
  poster: string;
  label: string;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (active) {
      el.currentTime = 0;
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [active, reduce, video]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
        <span className="ml-3 text-xs text-muted">{label}</span>
      </div>
      <div className="relative aspect-video overflow-hidden bg-surface-2">
        {reduce ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 520px"
            className="object-cover object-top"
            priority={active}
          />
        ) : (
          <motion.div
            className="absolute inset-0"
            animate={
              active
                ? { scale: [1, 1.04, 1] }
                : { scale: 1 }
            }
            transition={
              active
                ? { duration: 12, repeat: Infinity, ease: "linear" }
                : { duration: 0.3 }
            }
          >
            <video
              ref={ref}
              className="h-full w-full object-cover object-top"
              muted
              playsInline
              loop
              preload={active ? "auto" : "metadata"}
              poster={poster}
              aria-label={label}
            >
              <source src={video} type="video/mp4" />
            </video>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
