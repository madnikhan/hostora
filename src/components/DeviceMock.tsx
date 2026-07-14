"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function DeviceMock({
  title,
  src,
  alt,
  video,
  priority = false,
}: {
  title: string;
  src: string;
  alt: string;
  video?: string;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Widen margin so we start loading slightly before sticky chapter is centered
  const nearView = useInView(frameRef, {
    amount: 0.15,
    margin: "200px 0px 200px 0px",
  });
  const inView = useInView(frameRef, {
    amount: 0.35,
    margin: "0px 0px -10% 0px",
  });
  const playVideo = Boolean(video) && !reduce;
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (nearView && playVideo) setShouldLoad(true);
  }, [nearView, playVideo]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !playVideo || !shouldLoad) return;
    if (inView) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView, playVideo, shouldLoad, video]);

  return (
    <motion.div
      ref={frameRef}
      initial={reduce ? false : { opacity: 0.85, scale: 0.985 }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
        <span className="ml-3 text-xs text-muted">{title}</span>
      </div>
      <div className="relative aspect-16/10 bg-surface-2">
        {playVideo && shouldLoad ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-top"
            muted
            playsInline
            loop
            preload="metadata"
            poster={src}
            aria-label={alt}
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover object-top"
          />
        )}
      </div>
    </motion.div>
  );
}
