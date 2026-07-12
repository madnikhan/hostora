#!/usr/bin/env bash
# LEGACY — screen-recording concat. Prefer: npm run ad:tiktok (website stills + motion).
# Build vertical 9:16 Hostora TikTok ad from product pitch clips.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PITCH="$ROOT/public/media/product/pitch"
TMP="$ROOT/tmp/tiktok"
OUT_DIR="$ROOT/public/ads"
OUT="$OUT_DIR/tiktok-hostora-15s.mp4"

mkdir -p "$TMP" "$OUT_DIR"
python3 "$ROOT/scripts/generate_tiktok_overlays.py"

VF_COVER="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1"

make_seg() {
  local src="$1"
  local duration="$2"
  local overlay="$3"
  local dest="$4"
  ffmpeg -y -hide_banner -loglevel error \
    -i "$src" -i "$overlay" \
    -filter_complex "[0:v]trim=0:${duration},setpts=PTS-STARTPTS,${VF_COVER}[v];[1:v]format=rgba[ov];[v][ov]overlay=0:0" \
    -an -t "$duration" -r 30 -c:v libx264 -pix_fmt yuv420p -preset fast -crf 20 \
    "$dest"
}

echo "Rendering segments…"
make_seg "$PITCH/05-till.mp4" 1.5 "$TMP/overlay-hook.png" "$TMP/s01.mp4"
make_seg "$PITCH/06-kitchen.mp4" 1.5 "$TMP/overlay-hook.png" "$TMP/s02.mp4"
make_seg "$PITCH/05-till.mp4" 2.5 "$TMP/overlay-platform.png" "$TMP/s03.mp4"
make_seg "$PITCH/07-guests.mp4" 2.5 "$TMP/overlay-platform.png" "$TMP/s04.mp4"
make_seg "$PITCH/09-control.mp4" 3.0 "$TMP/overlay-modules.png" "$TMP/s05.mp4"
make_seg "$PITCH/08-money.mp4" 3.0 "$TMP/overlay-modules.png" "$TMP/s06.mp4"
make_seg "$PITCH/04-product.mp4" 2.0 "$TMP/overlay-modules.png" "$TMP/s07.mp4"

# End card from PNG (4s)
ffmpeg -y -hide_banner -loglevel error \
  -loop 1 -i "$TMP/end-card.png" \
  -t 4 -r 30 -c:v libx264 -pix_fmt yuv420p -preset fast -crf 20 \
  "$TMP/s08.mp4"

printf '%s\n' \
  "file '$TMP/s01.mp4'" \
  "file '$TMP/s02.mp4'" \
  "file '$TMP/s03.mp4'" \
  "file '$TMP/s04.mp4'" \
  "file '$TMP/s05.mp4'" \
  "file '$TMP/s06.mp4'" \
  "file '$TMP/s07.mp4'" \
  "file '$TMP/s08.mp4'" \
  > "$TMP/concat.txt"

echo "Concatenating…"
ffmpeg -y -hide_banner -loglevel error \
  -f concat -safe 0 -i "$TMP/concat.txt" \
  -c:v libx264 -pix_fmt yuv420p -preset medium -crf 19 -movflags +faststart \
  "$OUT"

ffprobe -v error -show_entries format=duration,size -of default=nw=1:nk=1 "$OUT" | paste - -
echo "Wrote $OUT"
