import Link from "next/link";
import { company } from "@/lib/company";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <p className="display text-2xl font-bold">Hostora</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Hospitality operations for restaurants, takeaways, events, hotels,
            and food carts. A product of {company.legalName}. Sold across the{" "}
            {company.markets}.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-muted">
          <Link href="/product" className="hover:text-foreground">
            Product
          </Link>
          <Link href="/hardware" className="hover:text-foreground">
            Hardware
          </Link>
          <Link href="/solutions" className="hover:text-foreground">
            Solutions
          </Link>
          <Link href="/locations" className="hover:text-foreground">
            Locations
          </Link>
          <Link href="/pricing" className="hover:text-foreground">
            Pricing
          </Link>
          <Link href="/security" className="hover:text-foreground">
            Security
          </Link>
          <Link href="/blog" className="hover:text-foreground">
            Blog
          </Link>
          <Link href="/pitch" className="hover:text-foreground">
            Sales pitch
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
          <Link href="/company" className="hover:text-foreground">
            Company information
          </Link>
          <Link href="/business-it" className="hover:text-foreground">
            Business IT
          </Link>
        </div>
      </div>
      <div className="border-t border-border px-6 py-6 text-xs leading-relaxed text-muted">
        <div className="mx-auto max-w-6xl space-y-2 text-center md:text-left">
          <p>
            © {new Date().getFullYear()} {company.legalName}. Hostora is a
            product brand of {company.legalName}.
          </p>
          <p>
            {company.legalName} · Company number {company.number} · Registered
            in {company.placeOfRegistration}
          </p>
          <p>Registered office: {company.registeredOffice}</p>
          <p>
            <a
              className="text-accent hover:underline"
              href={`mailto:${company.email}`}
            >
              {company.email}
            </a>
            {" · "}
            <a
              className="text-accent hover:underline"
              href={company.companiesHouseUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Companies House
            </a>
            {" · "}
            <Link href="/company" className="text-accent hover:underline">
              Company information
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
