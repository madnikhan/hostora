# Hostora SEO draft-approve pipeline

In-house SEO posts: curated topics + optional GSC hints, LLM draft with brand lint, human approve, then publish.

## Flow

1. Topics wait in [`content/seo/topics.json`](../../content/seo/topics.json) (`queued`)
2. `npm run seo:draft` → LLM draft + brand lint → [`content/blog/drafts/<slug>.json`](../../content/blog/drafts/)
3. You (or Cursor) edit the draft if needed
4. `npm run seo:publish -- --slug=<slug>` → writes `content/blog/<slug>.json` (**git mode**, default)
5. Commit + push → live `/blog/<slug>` + sitemap after Vercel deploy
6. Optional: `npm run seo:gsc` → [`content/seo/gsc-suggestions.json`](../../content/seo/gsc-suggestions.json)

Never blind auto-publish. Weekly GitHub Action only opens a **PR with a draft**.

## Commands

```bash
npm run seo:draft
npm run seo:list-drafts
npm run seo:publish -- --slug=your-slug          # git mode (recommended)
npm run seo:publish -- --slug=your-slug --mode=api   # needs Vercel Blob
npm run seo:gsc
```

## Why git mode by default

Vercel’s serverless filesystem is **read-only**. Without `BLOB_READ_WRITE_TOKEN` on **Production**, API publish returns EROFS / `storage:"filesystem"`.

Git mode ships the JSON with your deployment — no Blob required.

When Blob is ready (`curl -sL https://www.hostorasoft.co.uk/api/blog/publish` shows `"storage":"blob"`), you can use `--mode=api`.

## Env

| Variable | Required for |
|----------|----------------|
| `SEO_LLM_API_KEY` (or `OPENAI_API_KEY`) | `seo:draft` |
| `SEO_LLM_BASE_URL` / `SEO_LLM_MODEL` | optional LLM overrides |
| `BLOG_PUBLISH_SECRET` | `--mode=api` only |
| `BLOG_PUBLISH_URL` | optional; defaults to www publish URL |
| `BLOB_READ_WRITE_TOKEN` | Vercel Production for `--mode=api` |
| `GSC_PROPERTY` + Google SA email/key | optional `seo:gsc` |

## Brand rules

[`content/seo/brand-rules.json`](../../content/seo/brand-rules.json) — denied phrases, must include `/contact`, pack language.

## CI

[`.github/workflows/seo-draft.yml`](../../.github/workflows/seo-draft.yml) — Mondays 08:00 UTC + `workflow_dispatch`.

Repo secrets: `SEO_LLM_API_KEY` (and optional `SEO_LLM_MODEL` / `SEO_LLM_BASE_URL`).

## Related

- Guest blog: `/blog`
- Messaging: [`docs/MESSAGING.md`](../MESSAGING.md)
