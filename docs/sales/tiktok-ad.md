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

## CapCut brand pack

Drop these into CapCut for end cards / lower-thirds (gold `#E8A54B` on dark `#0B0B0C`):

| File | Use |
|------|-----|
| [`public/brand/hostora-mark.png`](../../public/brand/hostora-mark.png) | Mark only (transparent canvas) |
| [`public/brand/hostora-lockup.png`](../../public/brand/hostora-lockup.png) | Mark + “Hostora” (transparent canvas) |
| [`public/brand/hostora-lockup-dark.png`](../../public/brand/hostora-lockup-dark.png) | Same lockup on dark plate |
| [`public/brand/hostora-logo-motion.mp4`](../../public/brand/hostora-logo-motion.mp4) | ~3s silent 1080×1080 sting (mark draw + wordmark) |

Rebuild: `npm run brand:pack` (Playwright + ffmpeg).

## Kling AI overlays (transparent GIFs)

Five **5s** transparent motion GIFs (1080×1080) with site typography — **Syne**, cream `#F4F1EA`, gold `#E8A54B`. Drop one onto each ~5s Kling clip:

| File | Beat |
|------|------|
| [`public/brand/kling/01-hook.gif`](../../public/brand/kling/01-hook.gif) | “Still managing everything manually?” |
| [`public/brand/kling/02-brand.gif`](../../public/brand/kling/02-brand.gif) | Mark + Hostora + Hospitality OS |
| [`public/brand/kling/03-system.gif`](../../public/brand/kling/03-system.gif) | One smart system |
| [`public/brand/kling/04-proof.gif`](../../public/brand/kling/04-proof.gif) | Save time. Increase sales. |
| [`public/brand/kling/05-cta.gif`](../../public/brand/kling/05-cta.gif) | Book a free demo + contact URL |

Rebuild: `npm run brand:kling` (Playwright + ffmpeg).

## Upload tips

- Use A/B/C for TikTok Ads creative testing.
- Overlay `hostora-logo-motion.mp4` or a lockup PNG on your final CTA beat.
- CTA: [hostorasoft.co.uk/contact](https://hostorasoft.co.uk/contact)
- Music bed is synthetic (no third-party license); replace in CapCut if you want a licensed track.
