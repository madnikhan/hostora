import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/product", label: "Product" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pitch", label: "Pitch" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/mark.svg"
            alt=""
            width={32}
            height={32}
            className="rounded-lg"
            priority
          />
          <span className="display text-lg font-bold tracking-tight">Hostora</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent-strong"
        >
          Book a demo
        </Link>
      </div>
    </header>
  );
}
