import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { DeviceMock } from "@/components/DeviceMock";
import { productMedia } from "@/lib/productMedia";

export const metadata: Metadata = {
  title: "Product — POS, kitchen, QR, inventory & more",
  description:
    "Hostora product modules: POS & till, kitchen display, guest QR, payments, analytics, inventory, HR & attendance, and HMRC-ready accounting for food and hospitality businesses.",
  alternates: { canonical: "/product" },
};

const modules = [
  {
    name: "POS & till",
    desc: "Table service, takeaway tickets, modifiers, discounts, and split payments.",
    media: productMedia.till,
    title: "Till",
  },
  {
    name: "Kitchen display",
    desc: "Live boards by station with status, notes, target times, and stall visibility.",
    media: productMedia.kds,
    title: "KDS",
  },
  {
    name: "Guest QR & service",
    desc: "Table ordering QR, buzzer requests, and seating invites that connect guests to the floor.",
    media: productMedia.guestQr,
    title: "Guest QR",
  },
  {
    name: "Payments & sales reports",
    desc: "Till payments, cash and card taken, and day / week / month exports operators trust.",
    media: productMedia.sales,
    title: "Sales reports",
  },
  {
    name: "Analytics",
    desc: "Hourly sales, top items, and revenue views so managers see the night as it unfolds.",
    media: productMedia.analyticsHourly,
    title: "Analytics",
  },
  {
    name: "Inventory",
    desc: "Stock quantities, thresholds, and receive / use / count actions by station.",
    media: productMedia.inventory,
    title: "Inventory",
  },
  {
    name: "Staff, HR & attendance",
    desc: "Shifts, leave, documents, clock-in QR, hours, and live roster visibility.",
    media: productMedia.hr,
    title: "HR",
  },
  {
    name: "Accounting & compliance",
    desc: "HMRC-ready overview, VAT tools, and financial controls for UK and European operators.",
    media: productMedia.accounting,
    title: "Accounting",
  },
];

export default function ProductPage() {
  return (
    <div className="px-6 pb-28 pt-20">
      <div className="mx-auto max-w-5xl">
        <FadeUp>
          <p className="eyebrow">Product</p>
          <h1 className="display mt-4 max-w-3xl text-5xl font-extrabold md:text-7xl">
            Everything the floor needs. Nothing it doesn&apos;t.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Hostora replaces the patchwork of till apps, kitchen screens, booking
            widgets, and spreadsheets with one operational system.
          </p>
        </FadeUp>

        <div className="mt-20 space-y-16 md:space-y-24">
          {modules.map((mod, i) => (
            <FadeUp key={mod.name} delay={(i % 2) * 0.04}>
              <article
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="display mt-4 text-3xl font-bold md:text-4xl">
                    {mod.name}
                  </h2>
                  <p className="mt-4 text-muted leading-relaxed">{mod.desc}</p>
                </div>
                <DeviceMock
                  title={mod.title}
                  src={mod.media.src}
                  alt={mod.media.alt}
                  priority={i === 0}
                />
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp>
          <div className="mt-20 rounded-[2rem] border border-border bg-accent-soft p-10 md:p-14">
            <h2 className="display text-3xl font-bold md:text-4xl">
              Deployed where the venue is.
            </h2>
            <p className="mt-4 max-w-2xl text-muted leading-relaxed">
              Hostora is designed for real venues — on-prem printing, multi-station
              kitchens, and supervisor controls — not just cloud demos. Pricing is
              per venue. Custom quotes for multi-site operators.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background"
            >
              Talk to sales
            </Link>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
