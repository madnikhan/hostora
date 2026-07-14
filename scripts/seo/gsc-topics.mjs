#!/usr/bin/env node
/**
 * Optional: pull Google Search Console query hints into gsc-suggestions.json.
 * Does NOT auto-queue topics — promote ideas into topics.json manually.
 *
 * Env:
 *   GSC_PROPERTY=sc-domain:hostorasoft.co.uk
 *     or https://hostorasoft.co.uk/
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
 *
 * Usage: npm run seo:gsc
 */
import { google } from "googleapis";
import {
  GSC_SUGGESTIONS_PATH,
  writeJson,
} from "./lib.mjs";

function env(name) {
  return (process.env[name] || "").trim();
}

const property = env("GSC_PROPERTY");
const email = env("GOOGLE_SERVICE_ACCOUNT_EMAIL");
const key = env("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n");

if (!property || !email || !key) {
  console.log(
    "skip — curated bank only (set GSC_PROPERTY + GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)",
  );
  process.exit(0);
}

const auth = new google.auth.JWT({
  email,
  key,
  scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
});

const searchconsole = google.searchconsole({ version: "v1", auth });

const end = new Date();
const start = new Date();
start.setDate(end.getDate() - 28);
const startDate = start.toISOString().slice(0, 10);
const endDate = end.toISOString().slice(0, 10);

let rows = [];
try {
  const res = await searchconsole.searchanalytics.query({
    siteUrl: property,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 25,
    },
  });
  rows = res.data.rows || [];
} catch (err) {
  console.error(
    "GSC query failed. Share Search Console access with the service account.",
  );
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}

const suggestions = rows.map((row, i) => ({
  id: `gsc-${startDate}-${i}`,
  query: row.keys?.[0] || "",
  clicks: row.clicks ?? 0,
  impressions: row.impressions ?? 0,
  ctr: row.ctr ?? 0,
  position: row.position ?? 0,
  fetchedAt: new Date().toISOString(),
  note: "Promote into content/seo/topics.json manually if relevant to Hostora packs.",
}));

writeJson(GSC_SUGGESTIONS_PATH, suggestions);
console.log(
  `Wrote ${suggestions.length} suggestions → content/seo/gsc-suggestions.json (${startDate}–${endDate})`,
);
