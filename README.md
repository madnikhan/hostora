# Hostora

Marketing site and sales pitch for **Hostora** — hospitality operations platform by **K WAZIR LTD** (UK company number 17014542).

This project is **separate** from any client venue deployment (e.g. Fumari). Do not merge this into client POS repos.

## Quick start

```bash
cd ~/hostora
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Brand home (scroll story + demo video) |
| `/product` | Product modules with UI screenshots |
| `/solutions` | Restaurant / takeaway / events / hotels (F&B) / food carts |
| `/contact` | Demo CTA |
| `/company` | UK company / legal disclosures |
| `/pitch` | Animated sales deck for reps |

Product UI media lives in `public/media/product/` (anonymized). Raw captures stay in `public/media/_raw/` (gitignored).

SEO helpers: `/sitemap.xml`, `/robots.txt`, `/llms.txt`, Open Graph at `/brand/og.png`.

## Presenting to prospects

1. `npm run dev` (or deploy and share the URL)
2. Open `/pitch`
3. Press **F** for fullscreen
4. Use **← →** or **Space** to advance
5. End on the CTA slide; book demo via `/contact`

## Brand docs

- [docs/BRAND.md](docs/BRAND.md)
- [docs/MESSAGING.md](docs/MESSAGING.md)
- [docs/sales/one-pager.md](docs/sales/one-pager.md)

## Deploy

Deploy this app on its own (e.g. Vercel) under your Hostora domain. Keep it isolated from client production POS servers.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion
