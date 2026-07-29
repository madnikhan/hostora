# Demo leads CRM

Staff pipeline for every **Book a demo** request from `/contact`.

## Access

1. Same password as SEO admin (`ADMIN_SEO_PASSWORD` / `ADMIN_SEO_SECRET`)
2. Open [https://www.hostorasoft.co.uk/admin/leads](https://www.hostorasoft.co.uk/admin/leads)
3. Login via `/admin/seo/login` if prompted (session cookie is shared)

## What gets stored

On each successful calendar booking, Hostora also writes a lead (Vercel Blob `leads/*.json`, or local `content/leads/` in dev):

- Contact: name, email, phone, company, vertical
- Demo slot + Meet / Calendar links
- Status pipeline: `new` → `contacted` → `demo_done` → `quoted` → `won` | `lost` | `no_show`
- Notes, call log, follow-up tasks (auto-creates a post-demo call task +1 day)
- Optional UTM / `ref` from the contact URL

## Staff actions

| Action | Where |
|--------|--------|
| Filter / search leads | `/admin/leads` |
| Change status, assignee | Lead detail |
| Log call (`reached` / `voicemail` / …) | Lead detail |
| Add notes & tasks | Lead detail |
| Send template email (thanks / quote nudge / no-show) | Lead detail → SMTP |
| Click-to-call / WhatsApp / mailto | Lead detail |

## Daily reminders

Vercel Cron runs **08:00 UTC** → `GET /api/admin/leads/remind`.

Set on Vercel:

```bash
CRON_SECRET=long-random-string
```

Vercel sends `Authorization: Bearer $CRON_SECRET`. The job emails each assignee a digest of open tasks due today (or overdue).

Manual test:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://www.hostorasoft.co.uk/api/admin/leads/remind
```

## Attribution URLs

Pass UTMs into `/contact`:

```
https://www.hostorasoft.co.uk/contact?utm_source=youtube&utm_medium=video&utm_campaign=demo&ref=ad1
```

Stored on the lead for reporting.

## Requirements

- `BLOB_READ_WRITE_TOKEN` on Production (durable leads)
- SMTP env already used for booking confirmations
- Booking Google Calendar flow unchanged — CRM is additive

## Phase 2 ideas

Quote PDF attach, SMS (Twilio), HubSpot sync, lead scoring — see product plan notes.
