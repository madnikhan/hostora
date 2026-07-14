/** Business verticals for demo booking + sales. */
export const DEMO_VERTICALS = [
  "Restaurant",
  "Takeaway",
  "Events",
  "Hotel F&B",
  "Food cart",
] as const;

export type DemoVertical = (typeof DEMO_VERTICALS)[number];
