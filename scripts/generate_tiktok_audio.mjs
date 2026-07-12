#!/usr/bin/env node
/**
 * VO timed to scene starts (0, 3, 7, 12, 16s) + electronic bed → 20s mixes.
 * Each VO line is capped so it ends before the next scene.
 */
import { spawn } from "node:child_process";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const tmp = path.join(root, "tmp", "tiktok", "audio");

const STARTS = [0, 3, 7, 12, 16];
const ENDS = [3, 7, 12, 16, 20];

const variants = {
  restaurant: [
    "Orders, bookings, staff, payments… all at once?",
    "Hostora brings your business into one powerful platform.",
    "Manage orders, kitchen, bookings, staff, inventory, and payments in real time.",
    "Reduce mistakes, speed up service, and grow your revenue.",
    "Ready to simplify your business? Book your free Hostora demo today.",
  ],
  hotel: [
    "Orders, bookings, staff, payments… all at once?",
    "Hostora brings hotel F and B into one powerful platform.",
    "Manage outlet orders, kitchens, staff, inventory, and payments in real time.",
    "Reduce mistakes, speed up service, and grow your revenue.",
    "Ready to simplify your business? Book your free Hostora demo today.",
  ],
  events: [
    "Orders, bookings, staff, payments… all at once?",
    "Hostora brings your venue into one powerful platform.",
    "Manage bookings, floor service, staff, inventory, and payments in real time.",
    "Reduce mistakes, speed up service, and grow your revenue.",
    "Ready to simplify your business? Book your free Hostora demo today.",
  ],
};

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "ignore", "inherit"] });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} failed (${code})`)),
    );
  });
}

await mkdir(tmp, { recursive: true });

const bedPath = path.join(tmp, "bed.wav");
await run("ffmpeg", [
  "-y",
  "-f", "lavfi", "-i", "sine=frequency=98:duration=20",
  "-f", "lavfi", "-i", "sine=frequency=147:duration=20",
  "-f", "lavfi", "-i", "anoisesrc=color=pink:amplitude=0.012:duration=20",
  "-filter_complex",
  "[0]volume=0.07[a];[1]volume=0.045[b];[2]volume=0.3[c];[a][b][c]amix=inputs=3:duration=longest,alimiter=limit=0.22",
  "-ar", "44100",
  bedPath,
]);

for (const [id, lines] of Object.entries(variants)) {
  const voWavs = [];
  for (let i = 0; i < lines.length; i++) {
    const slot = ENDS[i] - STARTS[i];
    const aiff = path.join(tmp, `${id}-vo-${i}.aiff`);
    const raw = path.join(tmp, `${id}-vo-${i}-raw.wav`);
    const clipped = path.join(tmp, `${id}-vo-${i}.wav`);
    // Slightly faster speech so lines fit scene windows
    await run("say", ["-v", "Samantha", "-r", "185", "-o", aiff, lines[i]]);
    await run("ffmpeg", ["-y", "-i", aiff, "-ar", "44100", raw]);
    // Trim to scene window (leave 0.15s headroom), pad silence if short
    await run("ffmpeg", [
      "-y", "-i", raw,
      "-af", `atrim=0:${Math.max(0.5, slot - 0.2)},apad=whole_dur=${slot},asetpts=PTS-STARTPTS`,
      "-t", String(slot),
      "-ar", "44100",
      clipped,
    ]);
    voWavs.push(clipped);
    await unlink(aiff).catch(() => {});
    await unlink(raw).catch(() => {});
  }

  const inputs = ["-i", bedPath];
  const filters = ["[0]volume=0.35,atrim=0:20,asetpts=PTS-STARTPTS[bed]"];
  for (let i = 0; i < voWavs.length; i++) {
    inputs.push("-i", voWavs[i]);
    filters.push(
      `[${i + 1}]adelay=${STARTS[i] * 1000}|${STARTS[i] * 1000},volume=1.35[v${i}]`,
    );
  }
  const voLabels = voWavs.map((_, i) => `[v${i}]`).join("");
  filters.push(
    `${voLabels}[bed]amix=inputs=${voWavs.length + 1}:duration=longest:dropout_transition=0:normalize=0,atrim=0:20,apad=whole_dur=20,asetpts=PTS-STARTPTS,alimiter=limit=0.95`,
  );

  const out = path.join(tmp, `${id}-mix.wav`);
  await run("ffmpeg", ["-y", ...inputs, "-filter_complex", filters.join(";"), "-t", "20", "-ar", "44100", out]);
  console.log("Wrote", out, `(VO locked to ${STARTS.join("/")}s)`);
}

await writeFile(
  path.join(tmp, "README.txt"),
  "VO scene locks: 0-3, 3-7, 7-12, 12-16, 16-20. Pure motion ads — no product screenshots.\n",
);
console.log("Audio mixes ready.");
