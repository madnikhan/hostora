/** Site + UK trading entity for Hostora (Companies House). */

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.hostorasoft.co.uk"
).replace(/^https:\/\/hostorasoft\.co\.uk$/i, "https://www.hostorasoft.co.uk");


export const company = {
  legalName: "K WAZIR LTD",
  number: "17014542",
  placeOfRegistration: "England and Wales",
  registeredOffice: "7 Wellesley Street, Gloucester, England, GL1 4QP",
  sic: [
    "62012 - Business and domestic software development",
    "82990 - Other business support service activities not elsewhere classified",
  ],
  natureShort: "Business and domestic software development",
  email: "sales@hostorasoft.co.uk",
  productBrand: "Hostora",
  companiesHouseUrl:
    "https://find-and-update.company-information.service.gov.uk/company/17014542",
  markets: "US, UK & Europe",
  siteUrl,
} as const;

/** Canonical OG share image (absolute). */
export const ogImage = {
  path: "/brand/og.jpg",
  url: `${siteUrl}/brand/og.jpg`,
  width: 1200,
  height: 630,
  type: "image/jpeg" as const,
  alt: "Hostora — hospitality operations software",
};

