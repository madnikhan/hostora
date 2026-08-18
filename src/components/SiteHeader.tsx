"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

const links = [
  { href: "/product", label: "Product" },
  { href: "/hardware", label: "Hardware" },
  { href: "/solutions", label: "Solutions" },
  { href: "/locations", label: "Locations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

function navClass(active: boolean) {
  return active
    ? "text-sm text-foreground underline decoration-accent decoration-2 underline-offset-4"
    : "text-sm text-muted transition hover:text-foreground";
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/mark.svg"
            alt=""
            width={32}
            height={32}
            className="rounded-lg"
            priority
          />
          <span className="display text-lg font-bold tracking-tight">
            Hostora
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={navClass(pathname === link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent-strong"
          >
            Book a demo
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:border-foreground/30 lg:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close" : "Menu"}</span>
            <span className="flex w-4 flex-col gap-1" aria-hidden>
              <span
                className={`h-0.5 w-full bg-foreground transition ${open ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-full bg-foreground transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-0.5 w-full bg-foreground transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id={panelId}
          className="border-t border-border bg-background lg:hidden"
        >
          <nav
            className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4"
            aria-label="Mobile"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-3 text-base transition hover:bg-surface ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-background"
              onClick={() => setOpen(false)}
            >
              Book a demo
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
