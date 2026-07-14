/** Curated, anonymized product UI stills for marketing pages. */

export const productMedia = {
  till: {
    src: "/media/product/till-open-tables.webp",
    alt: "Hostora till with open table orders and pay actions",
  },
  modifiers: {
    src: "/media/product/till-modifiers.webp",
    alt: "Hostora item modifiers and add-ons on an open order",
  },
  tables: {
    src: "/media/product/table-management.webp",
    alt: "Hostora table management with live availability",
  },
  kds: {
    src: "/media/product/kds-station.webp",
    alt: "Hostora kitchen display with live tickets and target times",
  },
  guestQr: {
    src: "/media/product/guest-order-qr.webp",
    alt: "Hostora guest QR modules for ordering, buzzers, and seating",
  },
  bookings: {
    src: "/media/product/bookings-detail.webp",
    alt: "Hostora reservation detail with confirm and assign actions",
  },
  sales: {
    src: "/media/product/sales-reports.webp",
    alt: "Hostora sales reports with daily totals and export",
  },
  analyticsHourly: {
    src: "/media/product/analytics-hourly.webp",
    alt: "Hostora hourly sales and orders charts",
  },
  analyticsItems: {
    src: "/media/product/analytics-top-items.webp",
    alt: "Hostora top selling items by revenue",
  },
  inventory: {
    src: "/media/product/inventory-stock.webp",
    alt: "Hostora inventory with quantities, thresholds, and stock actions",
  },
  hr: {
    src: "/media/product/hr-overview.webp",
    alt: "Hostora HR overview with shifts, leave, and documents",
  },
  attendanceHours: {
    src: "/media/product/attendance-hours.webp",
    alt: "Hostora attendance hours by role and shift count",
  },
  attendanceQr: {
    src: "/media/product/attendance-qr.webp",
    alt: "Hostora clock-in, break, and clock-out QR codes",
  },
  accounting: {
    src: "/media/product/accounting-hmrc.webp",
    alt: "Hostora accounting dashboard with HMRC compliance features",
  },
  supervisor: {
    src: "/media/product/supervisor-admin.webp",
    alt: "Hostora supervisor and attendance control modules",
  },
  admin: {
    src: "/media/product/admin-hub.webp",
    alt: "Hostora admin hub for staff, guests, and transactions",
  },
  demoVideo: {
    src: "/media/product/demo-loop.mp4",
    poster: "/media/product/demo-poster.webp",
  },
} as const;

/** Per-slide pitch deck loops (cropped from product screen recording). */
export const pitchClips = {
  open: {
    video: "/media/product/pitch/01-open.mp4",
    poster: "/media/product/pitch/01-open-poster.webp",
    label: "Hostora",
  },
  problem: {
    video: "/media/product/pitch/02-problem.mp4",
    poster: "/media/product/pitch/02-problem-poster.webp",
    label: "Live floor",
  },
  icp: {
    video: "/media/product/pitch/03-icp.mp4",
    poster: "/media/product/pitch/03-icp-poster.webp",
    label: "Stations",
  },
  product: {
    video: "/media/product/pitch/04-product.mp4",
    poster: "/media/product/pitch/04-product-poster.webp",
    label: "Modules",
  },
  till: {
    video: "/media/product/pitch/05-till.mp4",
    poster: "/media/product/pitch/05-till-poster.webp",
    label: "Till & tables",
  },
  kitchen: {
    video: "/media/product/pitch/06-kitchen.mp4",
    poster: "/media/product/pitch/06-kitchen-poster.webp",
    label: "Kitchen",
  },
  guests: {
    video: "/media/product/pitch/07-guests.mp4",
    poster: "/media/product/pitch/07-guests-poster.webp",
    label: "Guest QR",
  },
  money: {
    video: "/media/product/pitch/08-money.mp4",
    poster: "/media/product/pitch/08-money-poster.webp",
    label: "Sales reports",
  },
  control: {
    video: "/media/product/pitch/09-control.mp4",
    poster: "/media/product/pitch/09-control-poster.webp",
    label: "Control",
  },
  deploy: {
    video: "/media/product/pitch/10-deploy.mp4",
    poster: "/media/product/pitch/10-deploy-poster.webp",
    label: "Deploy",
  },
  proof: {
    video: "/media/product/pitch/11-proof.mp4",
    poster: "/media/product/pitch/11-proof-poster.webp",
    label: "Analytics",
  },
  cta: {
    video: "/media/product/pitch/12-cta.mp4",
    poster: "/media/product/pitch/12-cta-poster.webp",
    label: "Hostora",
  },
} as const;
