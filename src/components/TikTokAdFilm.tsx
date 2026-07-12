"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  tiktokVariants,
  type MotifCard,
  type TikTokVariant,
  type TikTokVariantId,
} from "@/lib/tiktokAdVariants";

const W = 1080;
const H = 1920;
const TOTAL_MS = 20_000;

const scenes = [
  { id: "hook", start: 0, end: 3000 },
  { id: "product", start: 3000, end: 7000 },
  { id: "grid", start: 7000, end: 12000 },
  { id: "benefit", start: 12000, end: 16000 },
  { id: "cta", start: 16000, end: 20000 },
] as const;

function MotifIcon({ motif }: { motif: MotifCard["motif"] }) {
  const stroke = "#e8a54b";
  const fill = "rgba(232,165,75,0.15)";
  const common = { width: 56, height: 56, viewBox: "0 0 56 56", fill: "none" as const };
  switch (motif) {
    case "pos":
      return (
        <svg {...common}>
          <rect x="8" y="10" width="40" height="30" rx="4" stroke={stroke} strokeWidth="2" fill={fill} />
          <path d="M16 44h24M20 18h16M20 24h12" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "kitchen":
      return (
        <svg {...common}>
          <rect x="10" y="12" width="36" height="28" rx="3" stroke={stroke} strokeWidth="2" fill={fill} />
          <circle cx="20" cy="26" r="4" fill={stroke} />
          <circle cx="36" cy="26" r="4" fill={stroke} />
          <path d="M14 48h28" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "qr":
      return (
        <svg {...common}>
          <rect x="10" y="10" width="16" height="16" rx="2" stroke={stroke} strokeWidth="2" fill={fill} />
          <rect x="30" y="10" width="16" height="16" rx="2" stroke={stroke} strokeWidth="2" fill={fill} />
          <rect x="10" y="30" width="16" height="16" rx="2" stroke={stroke} strokeWidth="2" fill={fill} />
          <path d="M32 32h6v6h-6zM42 32h4M32 42h4M40 40h6v6" stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M12 40V16M12 40h32" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <path d="M18 34v-8M26 34V20M34 34V24M42 34V14" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="10" y="14" width="36" height="30" rx="4" stroke={stroke} strokeWidth="2" fill={fill} />
          <path d="M10 22h36M20 10v8M36 10v8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <circle cx="22" cy="32" r="2.5" fill={stroke} />
          <circle cx="34" cy="32" r="2.5" fill={stroke} />
        </svg>
      );
    case "tables":
      return (
        <svg {...common}>
          <circle cx="28" cy="26" r="12" stroke={stroke} strokeWidth="2" fill={fill} />
          <circle cx="28" cy="26" r="3" fill={stroke} />
          <path d="M14 44h28" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "staff":
      return (
        <svg {...common}>
          <circle cx="28" cy="18" r="8" stroke={stroke} strokeWidth="2" fill={fill} />
          <path d="M12 44c2-10 10-14 16-14s14 4 16 14" stroke={stroke} strokeWidth="2" fill={fill} />
        </svg>
      );
    case "outlet":
      return (
        <svg {...common}>
          <path d="M12 40V20l16-8 16 8v20" stroke={stroke} strokeWidth="2" fill={fill} />
          <rect x="22" y="28" width="12" height="12" stroke={stroke} strokeWidth="2" fill="rgba(11,11,12,0.6)" />
        </svg>
      );
  }
}

function ChaosIcons() {
  const items = [
    { x: 8, y: 22, r: -12 },
    { x: 28, y: 18, r: 8 },
    { x: 52, y: 24, r: -6 },
    { x: 14, y: 48, r: 10 },
    { x: 42, y: 52, r: -14 },
    { x: 68, y: 40, r: 5 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p, i) => (
        <motion.div
          key={i}
          className="absolute h-16 w-16 rounded-2xl border border-[#ff6b4a]/40 bg-[#ff6b4a]/10"
          style={{ left: `${p.x}%`, top: `${p.y}%`, rotate: p.r }}
          animate={{ y: [0, -16, 6, 0], opacity: [0.35, 0.7, 0.4] }}
          transition={{ duration: 2 + i * 0.1, repeat: Infinity, delay: i * 0.12 }}
        >
          <div className="flex h-full items-center justify-center">
            <div className="h-2 w-8 rounded bg-[#ff6b4a]/80" />
          </div>
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(194,59,46,0.25),transparent_55%)]" />
    </div>
  );
}

function FauxDashboard() {
  const rows = [72, 48, 88, 36, 64];
  return (
    <motion.div
      className="w-full max-w-[880px] overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
      initial={{ opacity: 0, y: 48, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="ml-3 text-sm text-muted">Hostora · Live floor</span>
      </div>
      <div className="grid grid-cols-3 gap-3 p-5">
        {["Orders", "Kitchen", "Pay"].map((label, i) => (
          <motion.div
            key={label}
            className="rounded-2xl border border-border bg-surface-2 p-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.12 }}
          >
            <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
            <p className="display mt-2 text-3xl font-bold text-accent">{[24, 11, "£2.4k"][i]}</p>
          </motion.div>
        ))}
      </div>
      <div className="space-y-3 px-5 pb-6">
        {rows.map((w, i) => (
          <motion.div
            key={i}
            className="h-3 rounded-full bg-white/10"
            initial={{ width: "8%" }}
            animate={{ width: `${w}%` }}
            transition={{ delay: 0.45 + i * 0.08, duration: 0.55 }}
            style={{ background: i % 2 === 0 ? "rgba(232,165,75,0.35)" : "rgba(244,241,234,0.12)" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function MotifCardView({ card, delay }: { card: MotifCard; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-center rounded-3xl border border-border bg-surface/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
      initial={{ opacity: 0, y: 28, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.45 }}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-soft">
        <MotifIcon motif={card.motif} />
      </div>
      <p className="text-center text-lg font-semibold text-foreground">{card.title}</p>
    </motion.div>
  );
}

function RisingBars() {
  const heights = [40, 58, 76, 52, 90, 68, 98];
  return (
    <div className="mt-12 flex h-52 items-end justify-center gap-3">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="w-11 rounded-t-xl bg-gradient-to-t from-[#c23b2e] to-accent shadow-[0_0_28px_rgba(232,165,75,0.4)]"
          initial={{ height: 10 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 1.15, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

function FadeScene({
  active,
  children,
  className = "",
}: {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className={`absolute inset-0 flex flex-col items-center justify-center px-12 ${className}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Film({ variant }: { variant: TikTokVariant }) {
  const [t, setT] = useState(0);

  useEffect(() => {
    const started = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      setT((now - started) % TOTAL_MS);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const active = (id: string) => {
    const s = scenes.find((x) => x.id === id);
    return Boolean(s && t >= s.start && t < s.end);
  };

  return (
    <div
      className="flex min-h-dvh items-center justify-center bg-black"
      data-tiktok-ad
      data-variant={variant.id}
    >
      <div
        className="relative overflow-hidden grain"
        style={{
          width: W,
          height: H,
          backgroundImage:
            "radial-gradient(ellipse 90% 45% at 50% -8%, rgba(232,165,75,0.24), transparent 55%), radial-gradient(ellipse 55% 40% at 90% 20%, rgba(194,59,46,0.16), transparent 50%), #0b0b0c",
        }}
        data-ad-canvas
      >
        <FadeScene active={active("hook")}>
          <ChaosIcons />
          <motion.p
            className="relative z-10 max-w-[920px] text-center display text-6xl font-extrabold leading-[1.05]"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {variant.hook}
          </motion.p>
          <motion.p
            className="relative z-10 mt-8 text-sm font-medium uppercase tracking-[0.22em] text-[#ff6b4a]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {variant.eyebrow}
          </motion.p>
        </FadeScene>

        <FadeScene active={active("product")} className="justify-end pb-16 pt-14">
          <div className="mb-auto w-full max-w-[900px] text-center">
            <p className="eyebrow">Hostora</p>
            <motion.h2
              className="display mt-4 text-6xl font-extrabold"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {variant.productTitle}
            </motion.h2>
            <p className="mt-4 text-xl text-muted">{variant.productSub}</p>
          </div>
          <FauxDashboard />
        </FadeScene>

        <FadeScene active={active("grid")} className="justify-start pt-20 pb-16">
          <p className="mb-10 max-w-[960px] text-center display text-4xl font-bold leading-tight">
            {variant.gridTitle}
          </p>
          <div className="grid w-full max-w-[960px] grid-cols-2 gap-5">
            {variant.cards.map((card, i) => (
              <MotifCardView key={card.title} card={card} delay={0.08 * i} />
            ))}
          </div>
        </FadeScene>

        <FadeScene active={active("benefit")}>
          <motion.h2
            className="display max-w-[920px] text-center text-6xl font-extrabold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Save Time.
            <span className="mt-2 block text-accent">Increase Sales.</span>
          </motion.h2>
          <p className="mt-6 text-xl text-muted">{variant.benefitSub}</p>
          <RisingBars />
        </FadeScene>

        <FadeScene active={active("cta")}>
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Image
              src="/brand/mark.svg"
              alt=""
              width={104}
              height={104}
              className="rounded-2xl shadow-[0_0_48px_rgba(232,165,75,0.4)]"
              priority
            />
            <p className="display mt-8 text-6xl font-extrabold">Hostora</p>
            <motion.div
              className="mt-10 rounded-full bg-accent px-12 py-5 text-xl font-semibold text-background"
              animate={{
                boxShadow: [
                  "0 0 24px rgba(232,165,75,0.35)",
                  "0 0 60px rgba(232,165,75,0.75)",
                  "0 0 24px rgba(232,165,75,0.35)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Book Your Free Demo Today
            </motion.div>
            <p className="mt-10 text-2xl font-medium">www.hostorasoft.co.uk</p>
            <p className="mt-2 text-xl text-muted">www.hostorasoft.com</p>
          </motion.div>
        </FadeScene>
      </div>
    </div>
  );
}

export function TikTokAdFilm({
  variantId = "restaurant",
}: {
  variantId?: TikTokVariantId;
}) {
  return <Film variant={tiktokVariants[variantId]} />;
}
