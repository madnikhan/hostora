# Hostora TikTok ads (A / B / C)

Pure **motion-graphics** 9:16 ads — kinetic type, abstract SVG icons, drawn faux-dashboard panels. **No product screenshots**, no pitch clips, no real Hostora UI captures. Logo only on the end card (`/brand/mark.svg`). VO + electronic bed, locked to scene starts.

**Hotel ads are F&B / outlets only** — not hotel room PMS (see [MESSAGING.md](../MESSAGING.md)).

## Preview

```bash
npm run dev
# http://localhost:3000/ads/tiktok/restaurant
# http://localhost:3000/ads/tiktok/hotel
# http://localhost:3000/ads/tiktok/events
```

## Exports

| Variant | File | Focus |
|---------|------|--------|
| A Restaurant | [`public/ads/tiktok-hostora-restaurant.mp4`](../../public/ads/tiktok-hostora-restaurant.mp4) | POS & orders |
| B Hotel F&B | [`public/ads/tiktok-hostora-hotel.mp4`](../../public/ads/tiktok-hostora-hotel.mp4) | Outlets & kitchens |
| C Events | [`public/ads/tiktok-hostora-events.mp4`](../../public/ads/tiktok-hostora-events.mp4) | Bookings & scheduling |

Also: `tiktok-hostora-15s.mp4` = copy of restaurant (A).

Specs: **1080×1920 · 20s · H.264 + AAC**.

## Rebuild

```bash
npm run build && npm run start
# other terminal:
npm run ad:tiktok:all
```

Single variant: `VARIANT=hotel npm run ad:tiktok`  
Audio only: `npm run ad:tiktok:audio` (macOS `say` + ffmpeg bed; VO delayed to 0 / 3 / 7 / 12 / 16s)

Requires Playwright Chromium and ffmpeg.

## Scene map (all variants)

| Time | Visual | On-screen | VO |
|------|--------|-----------|-----|
| 0–3s | Chaos icons orbiting | “Still managing everything manually?” | Orders, bookings, staff, payments… all at once? |
| 3–7s | Drawn system panel assembling | “One Smart System” | Hostora brings your business into one powerful platform. |
| 7–12s | 4 abstract motif cards | Vertical labels (variant) | Manage … in real time. |
| 12–16s | Rising bars + pulse | “Save Time. Increase Sales.” | Reduce mistakes, speed up service, and grow your revenue. |
| 16–20s | Mark + glowing CTA | Book demo + both URLs | Ready to simplify… Book your free Hostora demo today. |

## Upload tips

- Use A/B/C for TikTok Ads creative testing.
- CTA: [hostorasoft.co.uk/contact](https://hostorasoft.co.uk/contact)
- Music bed is synthetic (no third-party license); replace in CapCut if you want a licensed track.
