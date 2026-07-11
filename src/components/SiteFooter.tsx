import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <p className="display text-2xl font-bold">Hostora</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Hospitality operations for restaurants, takeaways, events, and
            hotels. Built by InvetiveByte LLC. Sold across the US and Europe.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-muted">
          <Link href="/product" className="hover:text-foreground">
            Product
          </Link>
          <Link href="/solutions" className="hover:text-foreground">
            Solutions
          </Link>
          <Link href="/pitch" className="hover:text-foreground">
            Sales pitch
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
      <div className="border-t border-border px-6 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} InvetiveByte LLC. Hostora is a product brand of
        InvetiveByte LLC.
      </div>
    </footer>
  );
}
