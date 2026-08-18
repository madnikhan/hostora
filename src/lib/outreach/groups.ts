import { siteUrl } from "@/lib/company";

export type OutreachGroup = {
  slug: string;
  name: string;
  url: string;
  region: "uk" | "europe" | "usa";
  posts: {
    id: string;
    label: string;
    body: string;
  }[];
};

const baseContact = `${siteUrl}/contact`;

export const outreachGroups: OutreachGroup[] = [
  {
    slug: "uk-restaurant-owners",
    name: "UK Restaurant Owners",
    url: "https://www.facebook.com/groups/",
    region: "uk",
    posts: [
      {
        id: "restaurant",
        label: "Restaurant pack",
        body: `We run Hostora — hospitality ops software (till, kitchen display, guest QR) for UK restaurants. Packaged go-live in days, not a custom build. Book a demo: ${baseContact}?utm_source=facebook&utm_medium=group&utm_campaign=uk-restaurant-owners&ref=fb-uk-restaurant-owners`,
      },
      {
        id: "takeaway",
        label: "Takeaway pack",
        body: `Takeaway operators — if ticket flow and station printing are still a patchwork, Hostora is a fixed Takeaway pack (POS + KDS + reports). Demo: ${baseContact}?utm_source=facebook&utm_medium=group&utm_campaign=uk-restaurant-owners&ref=fb-uk-restaurant-owners`,
      },
    ],
  },
  {
    slug: "uk-hospitality-business",
    name: "UK Hospitality Business Network",
    url: "https://www.facebook.com/groups/",
    region: "uk",
    posts: [
      {
        id: "general",
        label: "General intro",
        body: `Hostora Soft — restaurant / takeaway / events ops software by a UK company (K WAZIR LTD). Optional on-prem Docker for local resilience. See ${siteUrl}/product or book a demo: ${baseContact}?utm_source=facebook&utm_medium=group&utm_campaign=uk-hospitality-business&ref=fb-uk-hospitality-business`,
      },
    ],
  },
  {
    slug: "restaurant-owners-usa",
    name: "Restaurant Owners USA",
    url: "https://www.facebook.com/groups/",
    region: "usa",
    posts: [
      {
        id: "restaurant",
        label: "Restaurant pack",
        body: `Hostora is hospitality operations software — till, kitchen, guest QR, payments on one spine. Serving US operators with remote demo + pack install. ${baseContact}?utm_source=facebook&utm_medium=group&utm_campaign=restaurant-owners-usa&ref=fb-restaurant-owners-usa`,
      },
    ],
  },
];

export function getOutreachGroup(slug: string): OutreachGroup | undefined {
  return outreachGroups.find((g) => g.slug === slug);
}

export function buildTrackedContactUrl(
  groupSlug: string,
  teamMember?: string,
): string {
  const params = new URLSearchParams({
    utm_source: "facebook",
    utm_medium: "group",
    utm_campaign: groupSlug,
    ref: `fb-${groupSlug}`,
  });
  if (teamMember?.trim()) {
    params.set("utm_content", teamMember.trim());
  }
  return `${baseContact}?${params.toString()}`;
}

export function buildShortGoUrl(slug: string): string {
  return `${siteUrl}/go/${slug}`;
}

export const goRedirects: Record<string, string> = Object.fromEntries(
  outreachGroups.map((g) => [
    g.slug,
    buildTrackedContactUrl(g.slug),
  ]),
);
