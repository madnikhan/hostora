# Hostora SEO draft-approve pipeline

In-house SEO posts: curated topics + optional GSC hints, LLM draft with brand lint, human approve, then publish.

## Two ways to run it

### A. Live admin (`/admin/seo`) — preferred for weekly posting

Password-gated console on the live site. Drafts and topics live in **Vercel Blob**; publish writes `blog/posts/<slug>.json` (same store as the public blog).

1. Open `https://www.hostorasoft.co.uk/admin/seo/login`
2. Generate draft (next queued topic) → edit → **Publish live**
3. Post appears on `/blog/<slug>` + sitemap (no git push required)

**Production env checklist (Vercel → Project → Settings → Environment Variables → Production):**

| Variable | Purpose |
|----------|---------|
| `BLOB_READ_WRITE_TOKEN` | **Required** for admin write + live publish |
| `ADMIN_SEO_PASSWORD` | Login (or fall back to `BLOG_PUBLISH_SECRET`) |
| `ADMIN_SEO_SECRET` | Cookie signing (or fall back to publish/password secret) |
| `SEO_LLM_API_KEY` | **Required on Vercel** for Generate draft in the admin |
| `BLOG_PUBLISH_SECRET` | Optional; legacy webhook + secret fallback |

Verify Blob after redeploy:

```bash
curl -sL https://www.hostorasoft.co.uk/api/blog/publish
# expect: "storage":"blob"
```

If storage is `"filesystem"`, the admin shows a warning and **Publish live** stays disabled.

### B. Offline CLI / git (still supported)

1. Topics wait in [`content/seo/topics.json`](../../content/seo/topics.json) (`queued`)
2. `npm run seo:draft` → LLM draft + brand lint → [`content/blog/drafts/<slug>.json`](../../content/blog/drafts/)
3. Edit the draft if needed
4. `npm run seo:publish -- --slug=<slug>` → writes `content/blog/<slug>.json` (**git mode**, default)
5. Commit + push → live after Vercel deploy
6. Optional: `npm run seo:gsc` → [`content/seo/gsc-suggestions.json`](../../content/seo/gsc-suggestions.json)

Never blind auto-publish. Weekly GitHub Action only opens a **PR with a draft**.

## Commands (CLI)

```bash
npm run seo:draft
npm run seo:list-drafts
npm run seo:publish -- --slug=your-slug          # git mode (recommended offline)
npm run seo:publish -- --slug=your-slug --mode=api   # needs Vercel Blob
npm run seo:gsc
```

## Why Blob for the admin

Vercel’s serverless filesystem is **read-only**. Without `BLOB_READ_WRITE_TOKEN` on **Production**, API publish returns EROFS / `storage:"filesystem"`.

Repo `content/seo/*` remains the **seed / offline CLI** source. On production, the admin reads/writes Blob (`seo/topics.json`, `blog/drafts/`, `blog/posts/`).

## Brand rules

[`content/seo/brand-rules.json`](../../content/seo/brand-rules.json) — denied phrases, must include `/contact`, pack language. Enforced in CLI and `/admin/seo`.

## CI

[`.github/workflows/seo-draft.yml`](../../.github/workflows/seo-draft.yml) — Mondays 08:00 UTC + `workflow_dispatch`.

Repo secrets: `SEO_LLM_API_KEY` (and optional `SEO_LLM_MODEL` / `SEO_LLM_BASE_URL`).

## Related

- Guest blog: `/blog`
- Admin: `/admin/seo`
- Messaging: [`docs/MESSAGING.md`](../MESSAGING.md)
