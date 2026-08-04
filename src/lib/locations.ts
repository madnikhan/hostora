/** City service pages for long-tail SEO — serving operators, not fake storefronts. */

export type LocationRegion = "uk" | "europe" | "usa";

export type LocationCity = {
  slug: string;
  name: string;
  region: LocationRegion;
  country: string;
  countryCode: string;
  timezone: string;
  /** Unique city-specific sentence — no invented stats or fake addresses. */
  blurb: string;
};

export const regionLabels: Record<LocationRegion, string> = {
  uk: "United Kingdom",
  europe: "Europe",
  usa: "United States",
};

export const locations: LocationCity[] = [
  // —— UK (15) ——
  {
    slug: "london",
    name: "London",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "London operators run dense covers, multi-site brands, and late service — Hostora packs keep till, kitchen, and floor aligned under UK time without a custom rebuild.",
  },
  {
    slug: "birmingham",
    name: "Birmingham",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Birmingham’s dining and takeaway corridors need clear ticket flow and station printing — Hostora demos and installs for West Midlands venues on a packaged spine.",
  },
  {
    slug: "manchester",
    name: "Manchester",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Manchester restaurants and events venues get Restaurant, Takeaway, or Events packs with optional on-prem Docker when the floor needs local resilience.",
  },
  {
    slug: "liverpool",
    name: "Liverpool",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Liverpool hospitality operators can book a Hostora demo for live floor service — table maps, KDS routing, and guest QR without a bespoke project.",
  },
  {
    slug: "leeds",
    name: "Leeds",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Leeds and Yorkshire venues use Hostora for pack-based POS and kitchen display — configured after a short floor survey, not a multi-month rewrite.",
  },
  {
    slug: "glasgow",
    name: "Glasgow",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Glasgow restaurants and takeaways are served on UK time with Hostora packs — till, kitchen boards, and reporting on one hospitality OS.",
  },
  {
    slug: "newcastle",
    name: "Newcastle",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Newcastle upon Tyne operators get demos and installs for Hostora Restaurant and Takeaway packs, with optional local Docker on the venue LAN.",
  },
  {
    slug: "nottingham",
    name: "Nottingham",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Nottingham venues can run Hostora for floor control and kitchen routing — packaged go-live after a short survey of stations and printers.",
  },
  {
    slug: "bristol",
    name: "Bristol",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Bristol’s independent restaurants and carts are a fit for Hostora packs and configured food-cart setups — cloud or optional on-prem Docker.",
  },
  {
    slug: "sheffield",
    name: "Sheffield",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Sheffield hospitality businesses book Hostora demos for POS, KDS, and guest QR — sold as packs by K WAZIR LTD across the UK.",
  },
  {
    slug: "leicester",
    name: "Leicester",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Leicester restaurants and takeaways get Hostora’s packaged ops spine — rapid order entry, station printing, and end-of-day reports.",
  },
  {
    slug: "edinburgh",
    name: "Edinburgh",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Edinburgh dining and festival-season events suit Hostora’s Restaurant and Events packs — timed service and supervisor visibility when covers spike.",
  },
  {
    slug: "portsmouth",
    name: "Portsmouth",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Portsmouth and South Coast operators use Hostora for till-to-kitchen flow — demos scheduled on Europe/London time with pack-based go-live.",
  },
  {
    slug: "brighton",
    name: "Brighton",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Brighton’s cafés, restaurants, and late venues get Hostora hospitality software — guest QR, floor maps, and kitchen display without a custom build.",
  },
  {
    slug: "belfast",
    name: "Belfast",
    region: "uk",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    blurb:
      "Belfast restaurants and takeaways are served by Hostora Soft — same UK packs, remote demo, optional hardware kit for the floor.",
  },

  // —— Europe ex-UK (15) ——
  {
    slug: "paris",
    name: "Paris",
    region: "europe",
    country: "France",
    countryCode: "FR",
    timezone: "Europe/Paris",
    blurb:
      "Paris restaurants and hotel F&B outlets can run Hostora packs with demos on Central European time — F&B ops only, not hotel PMS.",
  },
  {
    slug: "madrid",
    name: "Madrid",
    region: "europe",
    country: "Spain",
    countryCode: "ES",
    timezone: "Europe/Madrid",
    blurb:
      "Madrid operators get Hostora Restaurant and Takeaway packs for live service — till, kitchen routing, and reporting on one spine.",
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    region: "europe",
    country: "Spain",
    countryCode: "ES",
    timezone: "Europe/Madrid",
    blurb:
      "Barcelona hospitality venues book Hostora demos for packed floors and tourist peaks — Events pack when covers and timing matter most.",
  },
  {
    slug: "rome",
    name: "Rome",
    region: "europe",
    country: "Italy",
    countryCode: "IT",
    timezone: "Europe/Rome",
    blurb:
      "Rome restaurants and takeaways are served with Hostora Soft — package quote after demo, optional Docker when the venue wants local LAN control.",
  },
  {
    slug: "berlin",
    name: "Berlin",
    region: "europe",
    country: "Germany",
    countryCode: "DE",
    timezone: "Europe/Berlin",
    blurb:
      "Berlin’s restaurant and bar scene fits Hostora packs — multi-station kitchen boards and supervisor alerts without a bespoke software project.",
  },
  {
    slug: "milan",
    name: "Milan",
    region: "europe",
    country: "Italy",
    countryCode: "IT",
    timezone: "Europe/Rome",
    blurb:
      "Milan dining and event catering use Hostora Events and Restaurant packs — high-capacity service nights with staff and shift visibility.",
  },
  {
    slug: "athens",
    name: "Athens",
    region: "europe",
    country: "Greece",
    countryCode: "GR",
    timezone: "Europe/Athens",
    blurb:
      "Athens venues get Hostora hospitality OS demos on Eastern European time — POS, KDS, and guest QR configured to the floor.",
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    region: "europe",
    country: "Portugal",
    countryCode: "PT",
    timezone: "Europe/Lisbon",
    blurb:
      "Lisbon restaurants and food carts can adopt Hostora packs or cart-configured setups — remote-first install from K WAZIR LTD.",
  },
  {
    slug: "brussels",
    name: "Brussels",
    region: "europe",
    country: "Belgium",
    countryCode: "BE",
    timezone: "Europe/Brussels",
    blurb:
      "Brussels operators run Hostora for restaurant and takeaway floors — clear ticket flow and optional thermal printing by station.",
  },
  {
    slug: "vienna",
    name: "Vienna",
    region: "europe",
    country: "Austria",
    countryCode: "AT",
    timezone: "Europe/Vienna",
    blurb:
      "Vienna hospitality businesses book Hostora demos for packaged POS and kitchen display — hotel F&B configured per outlet, not a PMS.",
  },
  {
    slug: "warsaw",
    name: "Warsaw",
    region: "europe",
    country: "Poland",
    countryCode: "PL",
    timezone: "Europe/Warsaw",
    blurb:
      "Warsaw restaurants and takeaways are served with Hostora Soft — cloud deploy or optional on-prem Docker on the venue network.",
  },
  {
    slug: "amsterdam",
    name: "Amsterdam",
    region: "europe",
    country: "Netherlands",
    countryCode: "NL",
    timezone: "Europe/Amsterdam",
    blurb:
      "Amsterdam venues get Hostora packs for till-to-kitchen ops — demos on Central European time with go-live after a short floor survey.",
  },
  {
    slug: "munich",
    name: "Munich",
    region: "europe",
    country: "Germany",
    countryCode: "DE",
    timezone: "Europe/Berlin",
    blurb:
      "Munich restaurants and event spaces use Hostora Restaurant and Events packs — supervisor monitoring when service nights run hot.",
  },
  {
    slug: "hamburg",
    name: "Hamburg",
    region: "europe",
    country: "Germany",
    countryCode: "DE",
    timezone: "Europe/Berlin",
    blurb:
      "Hamburg hospitality operators can book a Hostora demo for POS, kitchen display, and payments — sold as packs, not custom builds.",
  },
  {
    slug: "dublin",
    name: "Dublin",
    region: "europe",
    country: "Ireland",
    countryCode: "IE",
    timezone: "Europe/Dublin",
    blurb:
      "Dublin restaurants and takeaways run on Europe/Dublin with Hostora Soft — same hospitality OS packs used across our European markets.",
  },

  // —— USA (15) ——
  {
    slug: "new-york",
    name: "New York",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/New_York",
    blurb:
      "New York restaurants, takeaways, and event spaces get Hostora packs with demos on Eastern Time — dense covers without a rewrite.",
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/Los_Angeles",
    blurb:
      "Los Angeles operators use Hostora for multi-station kitchens and guest QR — Pacific Time demos and pack-based go-live.",
  },
  {
    slug: "chicago",
    name: "Chicago",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/Chicago",
    blurb:
      "Chicago hospitality venues book Hostora for Restaurant and Events packs — floor control and kitchen routing on Central Time.",
  },
  {
    slug: "houston",
    name: "Houston",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/Chicago",
    blurb:
      "Houston restaurants and takeaways are served with Hostora Soft — optional Docker local server when the floor needs LAN resilience.",
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/Phoenix",
    blurb:
      "Phoenix operators get Hostora packs for till, KDS, and payments — configured after a short survey of stations and printers.",
  },
  {
    slug: "philadelphia",
    name: "Philadelphia",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/New_York",
    blurb:
      "Philadelphia dining rooms and takeaways run Hostora hospitality software — guest QR, table maps, and reporting on one spine.",
  },
  {
    slug: "san-antonio",
    name: "San Antonio",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/Chicago",
    blurb:
      "San Antonio venues book Hostora demos for Restaurant and Takeaway packs — package quote after demo, no public price list.",
  },
  {
    slug: "san-diego",
    name: "San Diego",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/Los_Angeles",
    blurb:
      "San Diego restaurants and food carts fit Hostora packs or cart-configured setups — Pacific Time support for operators on the coast.",
  },
  {
    slug: "dallas",
    name: "Dallas",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/Chicago",
    blurb:
      "Dallas hospitality businesses use Hostora for live floor ops — multi-station kitchen and supervisor alerts without a custom project.",
  },
  {
    slug: "san-jose",
    name: "San Jose",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/Los_Angeles",
    blurb:
      "San Jose and Bay Area operators can adopt Hostora Soft — cloud or on-prem Docker for venue LAN devices.",
  },
  {
    slug: "austin",
    name: "Austin",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/Chicago",
    blurb:
      "Austin restaurants, events, and carts get Hostora packs configured to the operator — demos on Central Time via /contact.",
  },
  {
    slug: "jacksonville",
    name: "Jacksonville",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/New_York",
    blurb:
      "Jacksonville venues are served with Hostora Restaurant and Takeaway packs — rapid ticket flow and end-of-day reports.",
  },
  {
    slug: "fort-worth",
    name: "Fort Worth",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/Chicago",
    blurb:
      "Fort Worth operators book Hostora demos for POS and kitchen display — sold by K WAZIR LTD across US markets.",
  },
  {
    slug: "columbus",
    name: "Columbus",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/New_York",
    blurb:
      "Columbus restaurants and takeaways run Hostora hospitality OS — pack go-live after a short floor survey, not a rewrite.",
  },
  {
    slug: "charlotte",
    name: "Charlotte",
    region: "usa",
    country: "United States",
    countryCode: "US",
    timezone: "America/New_York",
    blurb:
      "Charlotte hospitality businesses get Hostora Soft for till-to-kitchen ops — Eastern Time demos and optional hardware kit.",
  },
];

const bySlug = new Map(locations.map((l) => [l.slug, l]));

export function getLocation(slug: string): LocationCity | undefined {
  return bySlug.get(slug);
}

export function locationsByRegion(region: LocationRegion): LocationCity[] {
  return locations.filter((l) => l.region === region);
}

export function locationSlugs(): string[] {
  return locations.map((l) => l.slug);
}
