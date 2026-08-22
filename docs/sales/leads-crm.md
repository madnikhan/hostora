# Demo leads CRM

Staff sales workspace for demo bookings, Tawk chat, Facebook outreach, and manual entries.

## Access

1. Password: `ADMIN_SEO_PASSWORD`, or fallback `BLOG_PUBLISH_SECRET`
2. Dashboard: [https://www.hostorasoft.co.uk/admin](https://www.hostorasoft.co.uk/admin)
3. Leads: [https://www.hostorasoft.co.uk/admin/leads](https://www.hostorasoft.co.uk/admin/leads)
4. Facebook outreach toolkit: [https://www.hostorasoft.co.uk/admin/outreach](https://www.hostorasoft.co.uk/admin/outreach)
5. Login via `/admin/seo/login` if prompted (shared session cookie)

## Env (Production)

```bash
POSTGRES_URL=...              # required — CRM leads (Vercel Postgres / Neon)
POSTGRES_URL_NON_POOLING=...  # optional — one-time migration script only
BLOB_READ_WRITE_TOKEN=...     # blog + SEO drafts only (not CRM)
SALES_TEAM=sales@hostorasoft.co.uk,teammate@example.com
CRON_SECRET=...               # daily task reminder digest
TAWK_WEBHOOK_SECRET=...       # from tawk.to webhook settings
```

## Lead sources

| Source | How it arrives |
|--------|----------------|
| `website` | Auto from `/contact` demo booking |
| `tawk_chat` | Tawk webhook on chat start (pre-chat form required) |
| `facebook_group` | Manual add after group DM / outreach |
| `referral`, `cold_call`, `whatsapp`, `other` | Manual add |

## Inquiry track (`inquiryType`)

| Value | Meaning |
|-------|---------|
| `hospitality` | Hostora demo — restaurant, takeaway, events, hotel F&B, food cart |
| `it_services` | Business IT & install — corporate, NHS site, motor, home office |

Set automatically from `/contact` (inquiry selector). Filter on `/admin/leads` and view **By track** on `/admin`. Playbook: `docs/sales/zero-budget-gtm.md`.

## Critical: Postgres on Production

**Leads will not appear in `/admin/leads` without Postgres.**

CRM data lives in **Vercel Postgres (Neon)** — not Blob. Blob is still used for blog posts and SEO drafts only.

### First-time setup

1. Vercel → **hostora** → **Storage** → **Create Database** → Postgres (Neon)
2. Connect store to project — Vercel adds `POSTGRES_URL` automatically
3. Redeploy Production

### Migrate existing Blob leads (one time)

If you previously stored leads in Blob before the Postgres migration:

```bash
BLOB_READ_WRITE_TOKEN=... POSTGRES_URL=... node scripts/migrate-leads-blob-to-postgres.mjs
```

Use `POSTGRES_URL_NON_POOLING` if the pooled URL fails on DDL. The script lists Blob once, upserts into Postgres, and prints row counts.

### Verify after deploy

1. Confirm `POSTGRES_URL` on Production + redeploy
2. Book a test demo on `/contact`
3. Add a manual test lead (Facebook source)
4. Trigger a test Tawk chat (with pre-chat email filled)
5. Open `/admin` — confirm counts by source
6. Confirm **no new** `leads/*.json` files appear in Blob (CRM should not write there)

### Local dev

Without `POSTGRES_URL`, leads use `content/leads/` on disk. Set `POSTGRES_URL` locally if you want to test against a Neon dev branch.

## Blob quota note

Vercel Hobby includes **2,000 Blob advanced operations/month** (`list`, `put`, `copy`). CRM on Blob exhausted this quickly. Postgres removes CRM from that budget. Blog listing is cached (~5 min) and single-file reads use `head()` (simple op, not advanced).

## Staff actions

| Action | Where |
|--------|--------|
| Dashboard KPIs | `/admin` |
| Filter / search / export CSV | `/admin/leads` |
| Add lead manually | `/admin/leads` → Add lead |
| Change status, assignee, quote amount | Lead detail |
| Activity timeline | Lead detail |
| Log call / notes / tasks | Lead detail |
| Send template email | Lead detail → SMTP |
| Facebook post + tracked link | `/admin/outreach` |

## Facebook group workflow

1. Open `/admin/outreach` → pick group → copy post + tracked `/contact` or `/go/{slug}` link
2. Post manually in the Facebook group
3. When someone DMs: WhatsApp/call → book demo or **Add lead** with source `facebook_group`
4. Filter leads by source on dashboard weekly

## Tawk.to chat workflow

### Dashboard setup (once)

In [tawk.to](https://dashboard.tawk.to) → Admin → Property:

1. **Pre-chat form** — require name, email, phone, company
2. **Webhooks** → URL: `https://www.hostorasoft.co.uk/api/webhooks/tawk`
3. Events: **Chat Start** (+ optional Chat End / transcript)
4. Copy webhook secret → `TAWK_WEBHOOK_SECRET` on Vercel

### Staff workflow

1. Visitor chats on site → lead appears with source **Tawk chat**
2. Reply in **Tawk dashboard** (not Hostora)
3. From lead detail: log call, send `/contact`, move pipeline status
4. If webhook fails: add lead manually with source `tawk_chat`

## Pipeline

`new` → `contacted` → `demo_done` → `quoted` → `won` | `lost` | `no_show`

- Auto task: post-demo call (+1 day) for website bookings
- Auto task: follow up Tawk chat (+4 hours) for chat leads
- Optional `quoteAmount` (GBP) and `lostReason` on lead detail

## Daily reminders

Vercel Cron **08:00 UTC** → `GET /api/admin/leads/remind` with `Authorization: Bearer $CRON_SECRET`.

## Attribution URLs

```
https://www.hostorasoft.co.uk/contact?utm_source=facebook&utm_medium=group&utm_campaign=uk-restaurant-owners&ref=fb-uk-restaurant-owners
```

Short link: `https://www.hostorasoft.co.uk/go/uk-restaurant-owners`

## Phase 2 ideas

Quote PDF attach, SMS (Twilio), HubSpot sync, per-user auth, lead scoring.
