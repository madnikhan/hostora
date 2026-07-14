#!/usr/bin/env node
/**
 * List pending blog drafts.
 * Usage: npm run seo:list-drafts
 */
import fs from "node:fs";
import path from "node:path";
import { listDraftFiles } from "./lib.mjs";

const files = listDraftFiles();
if (!files.length) {
  console.log("No drafts in content/blog/drafts/");
  process.exit(0);
}

for (const file of files) {
  const d = JSON.parse(fs.readFileSync(file, "utf8"));
  console.log(
    `- ${d.slug}\n  title: ${d.title}\n  topic: ${d.topicId || "—"}\n  created: ${d.createdAt || "—"}\n  file: ${path.basename(file)}`,
  );
}
