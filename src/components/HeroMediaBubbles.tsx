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
  y: number;
  rotate: number;
};

const bubbles: Bubble[] = [
  {
    id: "till",
    video: pitchClips.till.video,
    poster: productMedia.till.src,
    size: "h-36 w-36 md:h-48 md:w-48 lg:h-56 lg:w-56",
    className: "left-[-4%] top-[18%] hidden opacity-30 md:block md:opacity-35",
    duration: 18,
    delay: 0,
    y: 28,
    rotate: 6,
  },
  {
    id: "kitchen",
    video: pitchClips.kitchen.video,
    poster: productMedia.kds.src,
    size: "h-28 w-28 md:h-40 md:w-40 lg:h-48 lg:w-48",
    className: "right-[-2%] top-[12%] opacity-25 md:opacity-35",
    duration: 22,
    delay: 1.2,
    y: -32,
    rotate: -5,
  },
  {
    id: "guests",
    video: pitchClips.guests.video,
    poster: productMedia.guestQr.src,
    size: "h-24 w-24 md:h-36 md:w-36",
    className: "left-[6%] bottom-[8%] opacity-20 md:opacity-30",
    duration: 20,
    delay: 0.6,
    y: 22,
    rotate: 4,
  },
  {
    id: "sales",
    poster: productMedia.sales.src,
    size: "h-32 w-32 md:h-44 md:w-44 lg:h-52 lg:w-52",
    className: "right-[4%] bottom-[10%] hidden opacity-30 lg:block",
    duration: 24,
    delay: 2,
    y: -24,
    rotate: -7,
  },
  {
    id: "control",
    poster: productMedia.supervisor.src,
    size: "h-20 w-20 md:h-28 md:w-28",
    className: "right-[18%] top-[42%] hidden opacity-25 xl:block",
    duration: 16,
    delay: 1.5,
    y: 18,
    rotate: 5,
  },
  {
    id: "admin",
    poster: productMedia.admin.src,
    size: "h-20 w-20 md:h-28 md:w-28",
    className: "left-[16%] top-[48%] hidden opacity-20 xl:block",
    duration: 19,
    delay: 0.3,
    y: -16,
    rotate: -4,
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
          className={`absolute ${b.size} ${b.className}`}
          initial={false}
          animate={
            reduce
              ? { y: 0, rotate: 0 }
              : {
                  y: [0, b.y, 0],
                  rotate: [0, b.rotate, 0],
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
                }
          }
        >
          <div className="relative h-full w-full overflow-hidden rounded-full border border-accent/25 shadow-[0_20px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
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
                sizes="220px"
                className="scale-125 object-cover object-top"
              />
            )}
          </div>
        </motion.div>
      ))}

      {/* Center scrim so headline stays dominant */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,11,12,0.88)_0%,rgba(11,11,12,0.55)_42%,rgba(11,11,12,0.15)_70%,transparent_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
