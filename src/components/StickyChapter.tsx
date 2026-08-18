"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

export function StickyChapter({
  eyebrow,
  title,
  body,
  visual,
}: {
  eyebrow: string;
  title: string;
  body: string;
  visual: ReactNode;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    reduce ? [1, 1, 1, 1] : [0.35, 1, 1, 0.35],
  );

  return (
    <section
      ref={ref}
      className="relative grid min-h-[85vh] items-center gap-10 border-t border-border px-6 py-24 md:grid-cols-2 md:gap-16"
    >
      <div className="mx-auto w-full max-w-xl md:mx-0 md:justify-self-end">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display mt-4 text-4xl font-bold md:text-5xl lg:text-6xl">{title}</h2>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{body}</p>
      </div>
      <motion.div style={{ y, opacity }} className="mx-auto w-full max-w-lg">
        {visual}
      </motion.div>
    </section>
  );
}
