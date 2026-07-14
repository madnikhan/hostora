/**
 * Hostora UK list prices — INTERNAL SALES ONLY.
 * Hybrid model: full hardware one-time + monthly software (£50–£90) + go-live setup.
 * All amounts GBP ex VAT. Customer quotes add VAT at 20%.
 *
 * Legacy capital (one-time software) quotes need founder approval — not primary list.
 */

export const pricingMeta = {
  currency: "GBP",
  vatNote: "All prices ex VAT. Add UK VAT at 20% on customer quotes.",
  model: "hybrid",
  modelLabel: "Hardware one-time + software monthly",
  warrantyDays: 90,
  depositPercent: 30,
  maxHardwareDiscountWithoutApprovalPercent: 10,
  multiSiteSoftwareDiscountPercent: 15,
  contractMonthsMinimum: 12,
  freeMonthAfterPaidMonths: 12,
  travelPerMile: 0.55,
};

/** @type {{ id: string, name: string, blurb: string, monthly: number, from?: boolean, defaults: string }[]} */
export const softwarePacks = [
  {
    id: "food-cart",
    name: "Food cart (configured)",
    blurb: "Mobile till + tickets + tight-footprint stock.",
    monthly: 50,
    defaults: "Configured to cart footprint",
  },
  {
    id: "takeaway",
    name: "Takeaway pack",
    blurb: "Till, kitchen tickets/KDS, payments reports, stock basics, staff attendance.",
    monthly: 55,
    defaults: "1 till + 1 kitchen endpoint",
  },
  {
    id: "restaurant",
    name: "Restaurant pack",
    blurb:
      "Takeaway spine + guest QR/seating/bookings, open tabs, supervisor monitoring.",
    monthly: 69,
    defaults: "1 till + 1 kitchen endpoint",
  },
  {
    id: "events",
    name: "Events pack",
    blurb: "Restaurant spine + timed service / high-cover controls.",
    monthly: 89,
    defaults: "2 tills + 2 kitchen endpoints",
  },
  {
    id: "hotel-fb",
    name: "Hotel F&B (configured)",
    blurb:
      "Per outlet spine (restaurant / room service / banquet — not PMS).",
    monthly: 90,
    from: true,
    defaults: "Quoted by outlet count",
  },
];

/** Extra software station beyond pack default (£/mo) */
export const extraStationMonthly = 15;

/** @type {{ id: string, name: string, price: number, applies: string }[]} */
export const goLiveFees = [
  {
    id: "standard",
    name: "Standard go-live",
    price: 790,
    applies: "Takeaway / Restaurant / Food cart — survey, install, train",
  },
  {
    id: "complex",
    name: "Events / Hotel F&B go-live",
    price: 1190,
    applies: "Events pack or hotel F&B — survey, install, train",
  },
];

export const softwareIncludes = [
  "Pack software licence for contracted stations",
  "Remote updates and version upgrades",
  "Remote support during business hours (fair use)",
  `${pricingMeta.contractMonthsMinimum}-month minimum after go-live, then month-to-month`,
];

export const softwareExcludes = [
  "On-site visits (see visit rate card)",
  "New hardware moves / venue network faults",
  "Menu rebuild projects after go-live",
  "Payment-processing fees (acquirer-owned)",
  "Multi-site replication (each site needs its own monthly licence)",
];

/** @type {{ id: string, name: string, price: number | null, note?: string }[]} */
export const hardwareLines = [
  {
    id: "docker-server",
    name: "Local Docker server (Hostora + PostgreSQL on venue LAN)",
    price: 1890,
  },
  { id: "pos-till", name: "POS till terminal", price: 890 },
  { id: "tablet-pos", name: "Tablet POS (device + stand)", price: 590 },
  { id: "kds", name: "KDS / floor display", price: 449 },
  { id: "thermal", name: "Thermal kitchen printer", price: 249 },
  { id: "receipt", name: "Receipt printer", price: 199 },
  { id: "scanner", name: "Barcode / QR scanner", price: 129 },
  {
    id: "payment-terminal",
    name: "Payment terminal",
    price: null,
    note: "Quoted with acquirer — do not invent a Hostora RRP",
  },
];

/** @type {{ id: string, name: string, contents: string, price: number }[]} */
export const starterKits = [
  {
    id: "takeaway-kit",
    name: "Takeaway starter kit",
    contents: "1 till, 1 thermal, 1 receipt",
    price: 1338,
  },
  {
    id: "restaurant-kit",
    name: "Restaurant starter kit",
    contents: "1 till, 1 tablet, 1 KDS, 1 thermal, 1 receipt",
    price: 2377,
  },
  {
    id: "events-kit",
    name: "Events starter kit",
    contents: "2 tills, 2 KDS, 2 thermals, 1 receipt",
    price: 3616,
  },
];

export const resilienceAddon = {
  name: "Resilience add-on: local Docker server",
  price: 1890,
};

/** @type {{ name: string, price: number | null, unit: string, note?: string }[]} */
export const supportRates = [
  {
    name: "Remote support overage (beyond fair use)",
    price: 95,
    unit: "per hour (1h min)",
  },
  {
    name: "Standard on-site visit (UK mainland, business hours)",
    price: 175,
    unit: "per visit",
  },
  {
    name: "Evening / weekend visit",
    price: 265,
    unit: "per visit",
  },
  {
    name: "Emergency same-day (where available)",
    price: 350,
    unit: "per visit",
  },
  {
    name: "Travel outside agreed local radius",
    price: pricingMeta.travelPerMile,
    unit: "per mile + time",
  },
];

export const warrantyVsChargeable = {
  warranty: `${pricingMeta.warrantyDays}-day warranty on Hostora-supplied hardware defects and Hostora software defects (remote first; critical on-site if needed at no visit fee).`,
  chargeable:
    "Operator error, menu rebuilds, new hardware moves, OS/network faults at venue = chargeable visit rates.",
};

export const commercialRules = [
  `Max discount off hardware list without founder approval: ${pricingMeta.maxHardwareDiscountWithoutApprovalPercent}%`,
  `Software: max one free month after ${pricingMeta.freeMonthAfterPaidMonths} paid months (or 5% off monthly with founder) — do not stack deep SaaS discounts`,
  `Multi-site (2+ sites same legal entity): ${pricingMeta.multiSiteSoftwareDiscountPercent}% off monthly software from site 2 onward`,
  `Deposit: ${pricingMeta.depositPercent}% of (hardware + go-live); first month software due on go-live; balance on go-live day`,
  "Capital one-time software buyout: founder approval only — not the default quote.",
];

/**
 * Worked example quotes for training reps.
 * day0 = hardware + go-live; monthly = software.
 */
export const sampleQuotes = [
  {
    name: "Independent restaurant",
    lines: [
      { label: "Restaurant starter kit", amount: 2377 },
      { label: "Local Docker server", amount: 1890 },
      { label: "Standard go-live", amount: 790 },
    ],
    day0Total: 5057,
    monthly: 69,
    monthlyLabel: "Restaurant pack",
  },
  {
    name: "Takeaway",
    lines: [
      { label: "Takeaway starter kit", amount: 1338 },
      { label: "Standard go-live", amount: 790 },
    ],
    day0Total: 2128,
    monthly: 55,
    monthlyLabel: "Takeaway pack",
  },
  {
    name: "Events venue",
    lines: [
      { label: "Events starter kit", amount: 3616 },
      { label: "Events / Hotel F&B go-live", amount: 1190 },
    ],
    day0Total: 4806,
    monthly: 89,
    monthlyLabel: "Events pack",
  },
];

export function formatGbp(n) {
  if (n == null) return "—";
  return `£${Number(n).toLocaleString("en-GB")}`;
}

export function formatMonthly(item) {
  const base = `${formatGbp(item.monthly)}/mo`;
  return item.from ? `from ${base}` : base;
}

export function formatGbpPrice(item) {
  if (item.price == null) return item.note ? "Acquirer quote" : "—";
  const base = formatGbp(item.price);
  return item.from ? `from ${base}` : base;
}
