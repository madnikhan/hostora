import type { Metadata } from "next";
import { FadeUp } from "@/components/FadeUp";
import { DemoBookingForm } from "@/components/DemoBookingForm";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Book a demo",
  description: `Book a Hostora demo for your restaurant, takeaway, event venue, hotel F&B, or food cart. Contact ${company.legalName} sales across the ${company.markets}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="px-6 pb-28 pt-20">
      <div className="mx-auto grid max-w-5xl gap-14 md:grid-cols-2">
        <FadeUp className="order-2 md:order-1">
          <p className="eyebrow">Contact</p>
          <h1 className="display mt-4 text-5xl font-extrabold md:text-6xl">
            Book a Hostora demo.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Pick a time that works. We&apos;ll confirm by email with a Google
            Meet link — name, email, company, and phone required.
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
            <p className="pt-2 text-xs leading-relaxed">
              Meetings are 30 minutes, weekdays 09:00–17:00 UK time, subject to
              calendar availability.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1} className="order-1 md:order-2">
          <DemoBookingForm />
        </FadeUp>
      </div>
    </div>
  );
}
