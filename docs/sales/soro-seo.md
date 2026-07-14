# Soro SEO + Hostora blog

How Soro ([trysoro.com](https://trysoro.com/)) connects to this Next.js site.

## What Soro does

Keyword research, article writing, images/links, meta optimization. Publishes via **webhook** to our API (Next.js has no WordPress-style plugin here).

## Site surface

| URL | Role |
|-----|------|
| `/blog` | Article index |
| `/blog/[slug]` | Article page + Article JSON-LD |
| `POST /api/blog/publish` | Authenticated publish endpoint |

Seed posts live in `content/blog/*.json`. Production Soro posts should use **Vercel Blob** (`BLOB_READ_WRITE_TOKEN`) so writes persist on Vercel.

## Connect Soro

1. In Vercel (or `.env.local`), set:
   - `SORO_WEBHOOK_SECRET` — long random string
   - `BLOB_READ_WRITE_TOKEN` — from Vercel Blob store (required on production for Soro publishes)
2. In Soro, add website `https://hostorasoft.co.uk` and custom/webhook publish URL:

```text
POST https://hostorasoft.co.uk/api/blog/publish
Authorization: Bearer <SORO_WEBHOOK_SECRET>
Content-Type: application/json
```

Example body:

```json
{
  "title": "Kitchen display systems for busy restaurants",
  "slug": "kitchen-display-systems-busy-restaurants",
  "description": "How KDS and station printing keep tickets moving under load.",
  "html": "<p>…</p><p><a href=\"/contact\">Book a Hostora demo</a></p>",
  "coverImage": "https://…",
  "publishedAt": "2026-07-14T09:00:00.000Z"
}
```

Accepted aliases: `body` / `content` / `html`, `cover_image`, `published_at`.

3. **Publish mode: approve then publish** (do not blind auto-publish).

## Brand guardrails (paste into Soro brand voice)

**Voice:** Confident, operational, sparse. Product brand: Hostora. Vendor: K WAZIR LTD.

**Always link:** `/contact` (demo), `/product`, `/hardware` when relevant, `/solutions` for verticals.

**Denied / never claim:**
- Hostora is not hotel PMS (no rooms, front desk, housekeeping)
- Do not call the product “Fumari” (Fumari is a client venue only)
- No invented customer logos, revenue stats, or “#1” rankings
- No public price list or fake discounts
- English (UK) preferred

**Preferred topics:** restaurant POS UK, kitchen display / KDS, takeaway till, hotel F&B ops, food cart POS, on-prem Docker hospitality server, thermal printing by station.

## Verify

```bash
curl -s https://hostorasoft.co.uk/api/blog/publish
# → { ok, endpoint, storage, auth }

curl -s -X POST https://hostorasoft.co.uk/api/blog/publish \
  -H "Authorization: Bearer $SORO_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test post","html":"<p>Hello from Soro test.</p><p><a href=\"/contact\">Book a demo</a></p>"}'
```

Then open `/blog` and confirm sitemap includes the new URL.
