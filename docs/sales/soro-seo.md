# Soro SEO + Hostora blog

How [Soro](https://trysoro.com/) connects to this Next.js site as an **optional** second publisher alongside Hostora’s own SEO admin.

Keep [`/admin/seo`](../../src/app/admin/seo) for in-house drafts. Use Soro when you want their keyword autopilot — both write into the same Blob blog store.

## What Soro does

Keyword research, article writing, images/links, meta optimization. Publishes via **webhook** to our API (no WordPress-style plugin).

## Site surface

| URL | Role |
|-----|------|
| `/blog` | Article index |
| `/blog/[slug]` | Article page + Article JSON-LD |
| `POST /api/blog/publish` | Authenticated publish endpoint (Soro + CLI) |
| `/admin/seo` | Hostora-owned draft → approve → publish |

Seed posts live in `content/blog/*.json`. Production publishes (Soro or admin) need **Vercel Blob** (`BLOB_READ_WRITE_TOKEN`).

## Connect Soro

1. In Vercel Production, set and redeploy:
   - `BLOG_PUBLISH_SECRET` — long random string (primary; paste the same value into Soro)
   - `SORO_WEBHOOK_SECRET` — optional legacy alias if you prefer that name
   - `BLOB_READ_WRITE_TOKEN` — required so writes persist on Vercel
2. Confirm Blob:

```bash
curl -sL https://www.hostorasoft.co.uk/api/blog/publish
# expect: "storage":"blob"
```

3. In Soro, add website `https://www.hostorasoft.co.uk` and custom/webhook URL:

```text
POST https://www.hostorasoft.co.uk/api/blog/publish
Authorization: Bearer <BLOG_PUBLISH_SECRET>
Content-Type: application/json
```

**Use www**, not the apex. Apex → www `308` can strip `Authorization`.

Example body (flat or wrapped in `article` / `data` / `post`):

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

Accepted aliases: `body` / `content` / `html`, `cover_image`, `published_at`. Nested `article` / `data` / `post` objects are unwrapped. Source defaults to `soro`.

Brand lint runs before save (must include `/contact`, no denied phrases). Failures return `422` with `lintErrors`.

4. **Publish mode: approve then publish** (do not blind auto-publish).

Webhook connectivity tests (`event`/`type`: `webhook.test`, or empty body) return `{ ok: true, test: true }` without writing a post.

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

Full machine rules: [`content/seo/brand-rules.json`](../../content/seo/brand-rules.json).

## Verify

```bash
curl -sL https://www.hostorasoft.co.uk/api/blog/publish
# → { ok, endpoint, publishUrl, storage, auth, note }

curl -sL -X POST https://www.hostorasoft.co.uk/api/blog/publish \
  -H "Authorization: Bearer $BLOG_PUBLISH_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"event":"webhook.test"}'
# → { ok: true, test: true }

curl -sL -X POST https://www.hostorasoft.co.uk/api/blog/publish \
  -H "Authorization: Bearer $BLOG_PUBLISH_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test post from Soro","html":"<p>Hello from Soro test.</p><p><a href=\"/contact\">Book a demo</a></p>"}'
```

Then open `/blog` and confirm sitemap includes the new URL.

## Hostora-owned path (preferred for controlled posts)

See [seo-pipeline.md](./seo-pipeline.md) — `/admin/seo` or `npm run seo:draft` → review → publish.

Soro is optional third-party autopilot; Hostora’s pipeline never auto-publishes.
