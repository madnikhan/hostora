# Hostora SEO draft-approve pipeline

In-house replacement for “Soro writes everything”: curated topics + optional GSC hints, LLM draft with brand lint, human approve, then publish to the existing blog API.

## Flow

1. Topics wait in [`content/seo/topics.json`](../../content/seo/topics.json) (`queued`)
2. `npm run seo:draft` → LLM draft + brand lint → [`content/blog/drafts/<slug>.json`](../../content/blog/drafts/)
3. You (or Cursor) edit the draft if needed
4. `npm run seo:publish -- --slug=<slug>` → `POST /api/blog/publish` → live `/blog/<slug>` + sitemap
5. Optional: `npm run seo:gsc` writes hints to [`content/seo/gsc-suggestions.json`](../../content/seo/gsc-suggestions.json) — promote into `topics.json` manually

Never blind auto-publish. Weekly GitHub Action only opens a **PR with a draft**.

## Commands

```bash
npm run seo:draft
npm run seo:list-drafts
npm run seo:publish -- --slug=your-slug
npm run seo:gsc
```

## Env

| Variable | Required for |
|----------|----------------|
| `SEO_LLM_API_KEY` (or `OPENAI_API_KEY`) | `seo:draft` |
| `SEO_LLM_BASE_URL` / `SEO_LLM_MODEL` | optional LLM overrides |
| `BLOG_PUBLISH_SECRET` | `seo:publish` (set same value on Vercel) |
| `BLOG_PUBLISH_URL` | optional; defaults to production publish API |
| `BLOB_READ_WRITE_TOKEN` | production persistence of published posts |
| `GSC_PROPERTY` + existing Google SA email/key | optional `seo:gsc` |

For GSC: enable **Google Search Console API** in the GCP project, and add the service account as a user on the Search Console property.

## Brand rules

[`content/seo/brand-rules.json`](../../content/seo/brand-rules.json) — denied phrases, must include `/contact`, pack language.

## CI

[`.github/workflows/seo-draft.yml`](../../.github/workflows/seo-draft.yml) — Mondays 08:00 UTC + `workflow_dispatch`.

Repo secrets: `SEO_LLM_API_KEY` (and optional `SEO_LLM_MODEL` / `SEO_LLM_BASE_URL`).

## Related

- Guest blog surface: `/blog`, Soro webhook docs: [soro-seo.md](./soro-seo.md)
- Messaging guardrails: [`docs/MESSAGING.md`](../MESSAGING.md)
