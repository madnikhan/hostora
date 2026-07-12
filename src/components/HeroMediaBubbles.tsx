"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { pitchClips, productMedia } from "@/lib/productMedia";

type Bubble = {
  id: string;
  video?: string;
  poster: string;
  size: string;
  className: string;
  duration: number;
  delay: number;
  x: number[];
  y: number[];
  rotate: number[];
};

const bubbles: Bubble[] = [
  {
    id: "till",
    video: pitchClips.till.video,
    poster: productMedia.till.src,
    size: "h-32 w-32 sm:h-40 sm:w-40 md:h-52 md:w-52 lg:h-60 lg:w-60",
    className: "left-[-6%] top-[14%] opacity-35 md:opacity-40",
    duration: 22,
    delay: 0,
    x: [0, 22, -14, 8, 0],
    y: [0, 36, -18, 24, 0],
    rotate: [0, 8, -5, 4, 0],
  },
  {
    id: "kitchen",
    video: pitchClips.kitchen.video,
    poster: productMedia.kds.src,
    size: "h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44 lg:h-52 lg:w-52",
    className: "right-[-5%] top-[8%] opacity-35 md:opacity-42",
    duration: 18,
    delay: 0.8,
    x: [0, -28, 16, -10, 0],
    y: [0, -30, 26, -12, 0],
    rotate: [0, -7, 6, -3, 0],
  },
  {
    id: "guests",
    video: pitchClips.guests.video,
    poster: productMedia.guestQr.src,
    size: "h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40",
    className: "left-[4%] bottom-[6%] opacity-32 md:opacity-38",
    duration: 26,
    delay: 1.4,
    x: [0, 18, -22, 12, 0],
    y: [0, -34, 20, -16, 0],
    rotate: [0, 5, -8, 3, 0],
  },
  {
    id: "sales",
    poster: productMedia.sales.src,
    size: "h-28 w-28 sm:h-36 sm:w-36 md:h-48 md:w-48 lg:h-56 lg:w-56",
    className: "right-[2%] bottom-[8%] opacity-30 md:opacity-40",
    duration: 20,
    delay: 0.4,
    x: [0, -20, 26, -8, 0],
    y: [0, 28, -32, 14, 0],
    rotate: [0, -6, 9, -4, 0],
  },
  {
    id: "control",
    poster: productMedia.supervisor.src,
    size: "h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32",
    className: "right-[12%] top-[38%] opacity-28 md:opacity-36",
    duration: 16,
    delay: 2.1,
    x: [0, 14, -24, 10, 0],
    y: [0, -22, 30, -10, 0],
    rotate: [0, 10, -6, 5, 0],
  },
  {
    id: "admin",
    video: pitchClips.open.video,
    poster: productMedia.admin.src,
    size: "h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36",
    className: "left-[10%] top-[44%] opacity-28 md:opacity-34",
    duration: 24,
    delay: 1.1,
    x: [0, -16, 20, -12, 0],
    y: [0, 24, -28, 18, 0],
    rotate: [0, -9, 7, -3, 0],
  },
  {
    id: "inventory",
    poster: productMedia.inventory.src,
    size: "h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-36 lg:w-36",
    className: "left-[-2%] top-[58%] hidden opacity-32 sm:block md:opacity-38",
    duration: 19,
    delay: 0.6,
    x: [0, 26, -10, 18, 0],
    y: [0, -20, 34, -14, 0],
    rotate: [0, 6, -10, 4, 0],
  },
  {
    id: "hr",
    poster: productMedia.hr.src,
    size: "h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28",
    className: "right-[-3%] top-[55%] hidden opacity-30 sm:block md:opacity-36",
    duration: 21,
    delay: 1.8,
    x: [0, -18, 22, -14, 0],
    y: [0, 32, -16, 22, 0],
    rotate: [0, -5, 8, -6, 0],
  },
  {
    id: "accounting",
    poster: productMedia.accounting.src,
    size: "h-20 w-20 md:h-32 md:w-32 lg:h-40 lg:w-40",
    className: "left-[2%] top-[2%] hidden opacity-28 md:block md:opacity-34",
    duration: 27,
    delay: 2.5,
    x: [0, 12, -28, 16, 0],
    y: [0, 18, -26, 12, 0],
    rotate: [0, 4, -7, 5, 0],
  },
  {
    id: "analytics",
    video: pitchClips.money.video,
    poster: productMedia.analyticsHourly.src,
    size: "h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32",
    className: "right-[8%] top-[1%] opacity-30 md:opacity-38",
    duration: 15,
    delay: 0.2,
    x: [0, -24, 14, -18, 0],
    y: [0, 26, -22, 16, 0],
    rotate: [0, 7, -9, 3, 0],
  },
  {
    id: "tables",
    poster: productMedia.tables.src,
    size: "h-16 w-16 md:h-24 md:w-24 lg:h-32 lg:w-32",
    className: "left-[18%] bottom-[18%] hidden opacity-26 lg:block lg:opacity-32",
    duration: 23,
    delay: 3,
    x: [0, -12, 28, -8, 0],
    y: [0, -28, 18, -22, 0],
    rotate: [0, -8, 5, -4, 0],
  },
  {
    id: "modifiers",
    poster: productMedia.modifiers.src,
    size: "h-14 w-14 md:h-24 md:w-24",
    className: "right-[20%] bottom-[22%] hidden opacity-26 lg:block lg:opacity-34",
    duration: 17,
    delay: 1.6,
    x: [0, 20, -16, 24, 0],
    y: [0, -18, 28, -12, 0],
    rotate: [0, 9, -5, 6, 0],
  },
];

export function HeroMediaBubbles() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className={`absolute will-change-transform ${b.size} ${b.className}`}
          initial={false}
          animate={
            reduce
              ? { x: 0, y: 0, rotate: 0 }
              : {
                  x: b.x,
                  y: b.y,
                  rotate: b.rotate,
                }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: b.duration,
                  delay: b.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.25, 0.5, 0.75, 1],
                }
          }
        >
          <div className="relative h-full w-full overflow-hidden rounded-full border border-accent/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-1 ring-white/15">
            {b.video && !reduce ? (
              <video
                className="h-full w-full scale-125 object-cover object-top"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={b.poster}
              >
                <source src={b.video} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={b.poster}
                alt=""
                fill
                sizes="240px"
                className="scale-125 object-cover object-top"
              />
            )}
          </div>
        </motion.div>
      ))}

      {/* Stronger center scrim so headline stays dominant */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,11,12,0.92)_0%,rgba(11,11,12,0.72)_38%,rgba(11,11,12,0.28)_62%,transparent_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/70 to-transparent" />
    </div>
  );
}
