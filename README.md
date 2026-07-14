# Hostora

Marketing site and sales pitch for **Hostora** — hospitality operations platform by **K WAZIR LTD** (UK company number 17014542).

**Live site:** [https://hostorasoft.co.uk](https://hostorasoft.co.uk)  
**Sales:** [sales@hostorasoft.co.uk](mailto:sales@hostorasoft.co.uk)

This project is **separate** from any client venue deployment (e.g. Fumari). Do not merge this into client POS repos.

## Quick start

```bash
cd ~/hostora
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional env:

```bash
NEXT_PUBLIC_SITE_URL=https://hostorasoft.co.uk
```

## Routes

| Path | Purpose |
|------|---------|
| `/` | Brand home (scroll story + demo video) |
| `/product` | Product modules with UI screenshots |
| `/hardware` | Hardware kit (servers, tills, printers, scanners) |
| `/blog` | SEO articles (Soro webhook → `/api/blog/publish`) |
| `/solutions` | Restaurant / takeaway / events / hotels (F&B) / food carts |
| `/contact` | Demo CTA |
| `/company` | UK company / legal disclosures |
| `/pitch` | Animated sales deck for reps |

Product UI media lives in `public/media/product/` (anonymized). Hardware product shots live in `public/media/hardware/`. Raw captures stay in `public/media/_raw/` (gitignored).

SEO helpers: `/sitemap.xml`, `/robots.txt`, `/llms.txt`, Open Graph at `/brand/og.jpg`.

## Social / WhatsApp previews

Share **https://hostorasoft.co.uk** (not hostora.io). Tags use absolute `og:image` → `/brand/og.jpg`.

After a deploy that changes the share image:

1. Confirm `https://hostorasoft.co.uk/brand/og.jpg` returns `200` / `image/jpeg`
2. Refresh Facebook cache: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
3. WhatsApp: send the link in a **new** chat, or append `?v=2` once to bust cache

WhatsApp shows a **static** card only — it does not animate OG video.

## Demo booking (Google Calendar + Meet)

`/contact` books a 30‑minute Google Meet demo against your calendar availability.

### 1. Google Cloud
1. Create a GCP project and enable **Google Calendar API**
2. Create a **service account** and download a JSON key
3. Copy `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
4. Copy `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (keep `\n` escaped in env)
5. Set `GOOGLE_CALENDAR_ID` to a **Google Calendar** the service account can write to:
   - Open [Google Calendar](https://calendar.google.com) while signed into the account that owns the calendar
   - Settings → select the calendar → **Integrate calendar** → copy **Calendar ID**
   - That is often `you@gmail.com`, a Workspace mailbox, or `….@group.calendar.google.com`
   - An email like `sales@hostorasoft.co.uk` only works if that address is a real Google calendar (Workspace), not a plain forwarding inbox
6. On that calendar: **Share with specific people** → add `GOOGLE_SERVICE_ACCOUNT_EMAIL` with **Make changes to events**

If freeBusy returns `notFound` / bookings 502 with “Calendar not found”, the ID is wrong or the calendar is not shared with the service account.

Service accounts **cannot invite guests** on the calendar event (no Domain-Wide Delegation). Guest details go in the event description; the client and sales get confirmation via **IONOS SMTP**.

Meet auto-links usually need a **Google Workspace** calendar. On consumer Gmail, the event may still create without a Meet URL; the confirmation email notes that sales will send the link.

### 2. IONOS email (SMTP)
Send confirmations **From** `sales@hostorasoft.co.uk` via your IONOS mailbox (no Resend).

1. In IONOS, confirm the `sales@hostorasoft.co.uk` mailbox password
2. Set env:
   - `SMTP_HOST=smtp.ionos.co.uk`
   - `SMTP_PORT=587`
   - `SMTP_USER=sales@hostorasoft.co.uk`
   - `SMTP_PASS=` (mailbox password)
   - `BOOKING_FROM_EMAIL="Hostora <sales@hostorasoft.co.uk>"`
3. Notifications go to `BOOKING_NOTIFY_EMAILS` (default: `sales@hostorasoft.co.uk,madnikhan1@gmail.com`)

Add the same SMTP vars on Vercel for production.

### 3. Env checklist
Copy [`.env.example`](.env.example) to `.env.local` and fill values. See that file for `BOOKING_HOURS`, timezone, and duration.

### 4. Test
1. `npm run dev` → open `/contact`
2. Book a weekday slot
3. Confirm: Calendar event + customer email + emails to both notify addresses

## Presenting to prospects

1. `npm run dev` (or deploy and share the URL)
2. Open `/pitch`
3. Press **F** for fullscreen
4. Use **← →** or **Space** to advance
5. End on the CTA slide; book demo via `/contact`

### Offline sales pack (PPTX + PDFs)

```bash
npm run sales:pack
```

Outputs (also downloadable on the live site under `/sales/…`):

| File | Use |
|------|-----|
| `public/sales/Hostora-Sales-Presentation.pptx` | Emailable PowerPoint |
| `public/sales/Hostora-Brochure.pdf` | Prospect brochure |
| `public/sales/Hostora-Sales-Rep-Manual.txt` | Sales rep manual (simple text — primary) |
| `public/sales/Hostora-Sales-Rep-Manual.pdf` | Printable PDF of the text manual |

Edit the `.txt` manual, then run `npm run sales:manual` to refresh the PDF.

## TikTok ads

Three motion-graphics vertical films (Restaurant / Hotel F&B / Events) — no product screenshots: preview `/ads/tiktok/restaurant` (etc.), export with `npm run ad:tiktok:all`. Files in [`public/ads/`](public/ads/). Docs: [docs/sales/tiktok-ad.md](docs/sales/tiktok-ad.md).

## Brand docs

- [docs/BRAND.md](docs/BRAND.md)
- [docs/MESSAGING.md](docs/MESSAGING.md)
- [docs/sales/one-pager.md](docs/sales/one-pager.md)
- [docs/sales/rep-manual.md](docs/sales/rep-manual.md)
- [docs/sales/README.md](docs/sales/README.md)
- [docs/sales/tiktok-ad.md](docs/sales/tiktok-ad.md)

## Deploy

Deploy this app on its own (e.g. Vercel) under **hostorasoft.co.uk**. Keep it isolated from client production POS servers.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion
