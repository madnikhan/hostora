import type { Metadata } from "next";
import { FadeUp } from "@/components/FadeUp";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Book a demo",
  description: `Book a Hostora demo for your restaurant, takeaway, event venue, hotel F&B, or food cart. Contact ${company.legalName} sales across the ${company.markets}.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Book a Hostora demo",
    description:
      "Tell us about your venue — restaurant, takeaway, events, hotel F&B, or food cart.",
  },
};

export default function ContactPage() {
  return (
    <div className="px-6 pb-28 pt-20">
      <div className="mx-auto grid max-w-5xl gap-14 md:grid-cols-2">
        <FadeUp>
          <p className="eyebrow">Contact</p>
          <h1 className="display mt-4 text-5xl font-extrabold md:text-6xl">
            Book a Hostora demo.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Tell us about your venue — restaurant, takeaway, events, hotel
            F&amp;B, or food cart — and a sales representative will walk you
            through Hostora for US or Europe operations.
          </p>
          <div className="mt-10 space-y-4 text-sm text-muted">
            <p>
              Vendor:{" "}
              <span className="text-foreground">{company.legalName}</span>
            </p>
            <p>
              Product:{" "}
              <span className="text-foreground">{company.productBrand}</span>
            </p>
            <p>
              Company number:{" "}
              <span className="text-foreground">{company.number}</span>
            </p>
            <p>
              Registered office:{" "}
              <span className="text-foreground">{company.registeredOffice}</span>
            </p>
            <p>
              Email:{" "}
              <a
                className="text-accent hover:underline"
                href={`mailto:${company.email}?subject=Hostora%20demo%20request`}
              >
                {company.email}
              </a>
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <form
            action={`mailto:${company.email}`}
            method="get"
            className="rounded-[2rem] border border-border bg-surface p-8"
          >
            <label className="block text-sm text-muted">
              Name
              <input
                name="subject"
                required
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-foreground outline-none focus:border-accent"
              />
            </label>
            <label className="mt-5 block text-sm text-muted">
              Venue / company
              <input
                name="body"
                required
                placeholder="Venue name · city · type"
                className="mt-2 w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-foreground outline-none focus:border-accent"
              />
            </label>
            <p className="mt-5 text-xs leading-relaxed text-muted">
              Submitting opens your email client with a demo request. Replace with
              Formspree or a form API when you connect production hosting.
            </p>
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-background transition hover:bg-accent-strong"
            >
              Request demo
            </button>
          </form>
        </FadeUp>
      </div>
    </div>
  );
}
