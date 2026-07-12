/** Photoreal hardware kit stills for marketing (no OEM logos). */

export type HardwareItem = {
  id: string;
  name: string;
  desc: string;
  src: string;
  alt: string;
};

export const hardwareItems: HardwareItem[] = [
  {
    id: "local-server",
    name: "Local Hostora server",
    desc: "On-venue appliance with Hostora installed via Docker — app, PostgreSQL database, and services — so tills, tablets, KDS, and printers stay online on your network.",
    src: "/media/hardware/local-server.png",
    alt: "Compact black mini server with status lights and Ethernet port on a dark studio background",
  },
  {
    id: "pos-till",
    name: "POS till",
    desc: "Counter till with Hostora installed — open tabs, modifiers, and pay without a patchwork of apps.",
    src: "/media/hardware/pos-till.png",
    alt: "Black POS till with touchscreen and cash drawer on a dark studio background",
  },
  {
    id: "tablet-pos",
    name: "Tablet POS",
    desc: "Stand-mounted tablet POS for counters, carts, and secondary stations — Hostora ready.",
    src: "/media/hardware/tablet-pos.png",
    alt: "Tablet mounted on a POS stand on a dark studio background",
  },
  {
    id: "tablet",
    name: "Floor tablet",
    desc: "Handheld tablets for floor service, supervisors, and mobile takes — synced to the same system.",
    src: "/media/hardware/tablet.png",
    alt: "Black handheld tablet on a dark studio background",
  },
  {
    id: "payment-terminal",
    name: "Payment terminal",
    desc: "Card terminals that sit with Hostora payments — cash and card without slowing the queue.",
    src: "/media/hardware/payment-terminal.png",
    alt: "Handheld payment terminal on a dark studio background",
  },
  {
    id: "thermal-printer",
    name: "Thermal printer",
    desc: "Kitchen and station thermal printers routed by Hostora — tickets where service needs them.",
    src: "/media/hardware/thermal-printer.png",
    alt: "Black kitchen thermal ticket printer with paper on a dark studio background",
  },
  {
    id: "receipt-printer",
    name: "Receipt printer",
    desc: "Counter receipt printers for guests and takeaway — paired with your Hostora till.",
    src: "/media/hardware/receipt-printer.png",
    alt: "Black counter receipt printer on a dark studio background",
  },
  {
    id: "barcode-scanner",
    name: "Barcode scanner",
    desc: "Handheld scanners for stock receive, count, and inventory actions in Hostora.",
    src: "/media/hardware/barcode-scanner.png",
    alt: "Black handheld barcode scanner on a dark studio background",
  },
  {
    id: "qr-scanner",
    name: "QR scanner",
    desc: "Compact QR / 2D scanners for guest codes, attendance, and floor workflows.",
    src: "/media/hardware/qr-scanner.png",
    alt: "Compact black QR code scanner on a dark studio background",
  },
];

/** Featured subset for product / homepage teases */
export const hardwareFeatured = hardwareItems.filter((item) =>
  ["local-server", "pos-till", "thermal-printer"].includes(item.id),
);
