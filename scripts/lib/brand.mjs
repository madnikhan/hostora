import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "../..");
export const SALES_DIR = path.join(ROOT, "public", "sales");
export const BRAND_DIR = path.join(ROOT, "public", "brand");

export const brand = {
  product: "Hostora",
  tagline: "Run the floor. From booking to last pour.",
  oneLiner:
    "Restaurant / Takeaway / Events packs, plus hotel F&B and food carts configured to the operator — POS, kitchen, bookings, payments, stock, and staff. US, UK & Europe.",
  legalName: "K WAZIR LTD",
  companyNumber: "17014542",
  registeredOffice: "7 Wellesley Street, Gloucester, England, GL1 4QP",
  email: "sales@hostorasoft.co.uk",
  site: "https://hostorasoft.co.uk",
  markets: "US, UK & Europe",
};

export const colors = {
  bg: "0B0B0C",
  fg: "F4F1EA",
  muted: "9A958C",
  accent: "E8A54B",
  surface: "141416",
  surface2: "1C1C1F",
};

/** CSS / PDFKit hex with # */
export const colorsHex = {
  bg: "#0B0B0C",
  fg: "#F4F1EA",
  muted: "#9A958C",
  accent: "#E8A54B",
  surface: "#141416",
  surface2: "#1C1C1F",
};

export const verticals = [
  "Restaurant pack",
  "Takeaway pack",
  "Events pack",
  "Hotels (F&B — configured)",
  "Food carts (configured)",
];

export const modules = [
  { name: "POS & till", desc: "Open tabs, modifiers, split bills, floor-speed payments." },
  { name: "Kitchen display", desc: "Live boards by station with notes and status." },
  { name: "Guest QR & seating", desc: "Table ordering, seating invites, reservation flows." },
  { name: "Payments & sales reports", desc: "Till and online deposits; day / week / month views." },
  { name: "Analytics", desc: "Hourly and item-level insight for operators." },
  { name: "Inventory", desc: "Stock items, movements, and low-stock alerts." },
  { name: "Staff, HR & attendance", desc: "Roles, shifts, and attendance visibility." },
  { name: "Accounting", desc: "Purchases and reporting; HMRC-ready framing for UK / EU." },
  { name: "Supervisor monitoring", desc: "Live alerts, deletions audit, and floor control." },
];

export const hardware = [
  "Local Docker server (Hostora + PostgreSQL on the venue LAN)",
  "POS tills and tablet POS",
  "Floor tablets / KDS screens",
  "Thermal and receipt printers",
  "Barcode and QR scanners",
  "Payment terminals",
];

export const markPng = path.join(BRAND_DIR, "mark.png");
