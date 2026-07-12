export type TikTokVariantId = "restaurant" | "hotel" | "events";

export type MotifCard = {
  title: string;
  /** Simple geometric motif key for SVG illustration */
  motif: "pos" | "kitchen" | "qr" | "chart" | "calendar" | "tables" | "staff" | "outlet";
};

export type TikTokVariant = {
  id: TikTokVariantId;
  eyebrow: string;
  hook: string;
  productTitle: string;
  productSub: string;
  gridTitle: string;
  cards: [MotifCard, MotifCard, MotifCard, MotifCard];
  benefitTitle: string;
  benefitSub: string;
  voLines: [string, string, string, string, string];
};

export const tiktokVariants: Record<TikTokVariantId, TikTokVariant> = {
  restaurant: {
    id: "restaurant",
    eyebrow: "Restaurants · Takeaways",
    hook: "Still managing everything manually?",
    productTitle: "One Smart System",
    productSub: "Hostora brings your business into one powerful platform.",
    gridTitle: "Restaurants • Hotels • Takeaways • Events",
    cards: [
      { title: "Restaurant POS", motif: "pos" },
      { title: "Takeaway tickets", motif: "kitchen" },
      { title: "Guest QR", motif: "qr" },
      { title: "Live sales", motif: "chart" },
    ],
    benefitTitle: "Save Time. Increase Sales.",
    benefitSub: "Reduce mistakes, speed up service, grow revenue.",
    voLines: [
      "Orders, bookings, staff, payments… all at once?",
      "Hostora brings your business into one powerful platform.",
      "Manage orders, kitchen, bookings, staff, inventory, and payments in real time.",
      "Reduce mistakes, speed up service, and grow your revenue.",
      "Ready to simplify your business? Book your free Hostora demo today.",
    ],
  },
  hotel: {
    id: "hotel",
    eyebrow: "Hotel F&B · Outlets",
    hook: "Still running hotel F&B on patchwork tools?",
    productTitle: "One Smart System",
    productSub: "Outlet tills, kitchens, and service — one spine.",
    gridTitle: "Outlets • Room service • Banquets • Control",
    cards: [
      { title: "Outlet POS", motif: "outlet" },
      { title: "Kitchen routing", motif: "kitchen" },
      { title: "Service bookings", motif: "calendar" },
      { title: "Floor control", motif: "staff" },
    ],
    benefitTitle: "Save Time. Increase Sales.",
    benefitSub: "Peak service without the chaos.",
    voLines: [
      "Orders, bookings, staff, payments… all at once?",
      "Hostora brings hotel F and B into one powerful platform.",
      "Manage outlet orders, kitchens, staff, inventory, and payments in real time.",
      "Reduce mistakes, speed up service, and grow your revenue.",
      "Ready to simplify your business? Book your free Hostora demo today.",
    ],
  },
  events: {
    id: "events",
    eyebrow: "Events · Private dining",
    hook: "Still planning events in spreadsheets?",
    productTitle: "One Smart System",
    productSub: "Covers, timing, and service control — together.",
    gridTitle: "Bookings • Floor • Staff • Reports",
    cards: [
      { title: "Event bookings", motif: "calendar" },
      { title: "Floor & tables", motif: "tables" },
      { title: "Live control", motif: "staff" },
      { title: "Sales insight", motif: "chart" },
    ],
    benefitTitle: "Save Time. Increase Sales.",
    benefitSub: "Timed service that stays intentional.",
    voLines: [
      "Orders, bookings, staff, payments… all at once?",
      "Hostora brings your venue into one powerful platform.",
      "Manage bookings, floor service, staff, inventory, and payments in real time.",
      "Reduce mistakes, speed up service, and grow your revenue.",
      "Ready to simplify your business? Book your free Hostora demo today.",
    ],
  },
};
