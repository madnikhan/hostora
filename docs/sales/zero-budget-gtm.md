# Zero-budget GTM — Hostora + Business IT

Weekly playbook for **Track A** (Hostora hospitality) and **Track B** (K WAZIR LTD business IT). No paid ads — pipeline discipline and follow-up are the lever.

## Two tracks (do not mix)

| Track | Offer | Who |
|-------|--------|-----|
| **A — Hostora** | Hospitality floor ops (till + kitchen + booking widget) | Restaurants, takeaways, events, hotel F&B, food carts, hospital **cafés/catering only** |
| **B — Business IT** | Hardware, site setup, office/network support | Corporate, NHS **non-clinical** sites, motor dealership offices, home office |

**Rules**

- Do not sell Hostora to motor workshops or NHS clinical systems.
- Do not put NHS/motor/corporate IT offers on the Hostora homepage — use `/business-it` and contact form “Business IT”.
- Every inbound lead should have `inquiryType` in CRM (`hospitality` vs `it_services`).

## Track A — Hostora hospitality

### Who to target (priority order)

1. Independent restaurants & takeaways near you (Gloucester, Birmingham, etc.)
2. Facebook group owners posting about till/POS problems — use `/admin/outreach`
3. Hotel F&B / event venues
4. Hospital cafés / staff restaurants / catering (F&B only)

### Weekly rhythm (2–5 hours/person)

| Day | Action | Tool |
|-----|--------|------|
| Mon | Post in 2 Facebook groups | `/admin/outreach` + tracked `/go/` link |
| Tue | Call/DM 5 venues from Google Maps | Manual lead in CRM |
| Wed | Reply to all Tawk chats within 4 hours | Tawk + CRM |
| Thu | Follow up every `new` / `contacted` lead | `/admin/leads` |
| Fri | Review dashboard: sources + **Hostora track** counts; book demos | `/admin` |

### Messaging (see also `docs/MESSAGING.md`)

- Lead with **“replace till + kitchen tickets + booking widget”** — not “best POS software”.
- Every conversation ends with: **book demo** (`/contact`) or **floor survey date**.
- After every demo: log outcome, send quote within 48h, task for +3 day follow-up.
- Ask one happy venue for **intro to another owner** — only real referrals, no invented logos.

### Site assets to use

- `/pitch` — live sales calls
- `/locations/*` — “serving operators in {city}”
- Quote pack PDF on `/contact`
- Soro blog — long-tail, slow lever

## Track B — Business IT & install

### Realistic entry offers

| Vertical | Offer | Avoid |
|----------|--------|-------|
| Corporate / home office | PC setup, network, printers, backup, remote support | Competing with large MSPs on day one |
| NHS | Non-clinical: admin offices, cafés, small hardware refresh | Full NHS framework / clinical software |
| Motor | Dealership/reception IT, displays; café on site → Hostora for F&B only | Selling Hostora as garage software |

### Weekly rhythm

| Action | How |
|--------|-----|
| List 20 warm contacts | Past clients, suppliers, corporate buyers you know |
| Send short email | “We do install + support for {office/site} — 15-min call?” |
| LinkedIn (free) | 3 posts/week: one IT tip, one mini case (no fake stats), one CTA to email |
| One small project | Prefer paid pilot (£500–£2k setup) over free work |

**CTA:** `/contact?inquiry=it` or email `sales@hostorasoft.co.uk` with subject **IT inquiry**. Page: `/business-it`.

## CRM checklist

1. Contact form stores `inquiryType` + vertical on every booking.
2. Manual add: pick **Hostora hospitality** vs **Business IT** in `/admin/leads`.
3. Filter leads by track; dashboard shows **By track** breakdown.
4. Follow up **100% of new leads within 24h** — log calls and tasks on the lead record.

## Objection lines (quick)

| They say | You say |
|----------|---------|
| “We already have a till” | Hostora is floor ops — till, kitchen tickets, and supervisor control together, not another standalone app. |
| “We’re not a restaurant” (IT lead) | Correct — for your site we scope hardware/install under K WAZIR LTD business IT, not Hostora product demos. |
| “Can you do our NHS clinical system?” | No — we do non-clinical site IT and cafés; clinical stays with your existing suppliers. |
| “Too expensive” | Quote after demo/survey; packs are fixed spine + optional hardware — compare to downtime and staff time lost on broken tills. |

## 90-day metrics (realistic, no budget)

| Metric | Target |
|--------|--------|
| Outreach posts | 8+/month in FB groups |
| Manual + chat + demo leads in CRM | 30+/month combined |
| Demos booked (Hostora) | 4–8/month |
| Follow-up within 24h | 100% of new leads |
| IT conversations | 10+/month |
| Paid closes | 1 Hostora pack **or** 1 IT install = win |

## What we are not doing

- Paid ads (no budget)
- Hostora rebrand as general IT company
- NHS framework chasing before first small site win
- Invented customer logos or “#1” claims
- Full MSP portal or second product

## Env (ops)

```bash
BLOB_READ_WRITE_TOKEN=...
SALES_TEAM=sales@hostorasoft.co.uk,teammate@example.com
TAWK_WEBHOOK_SECRET=...
```

See `docs/sales/leads-crm.md` for CRM access and Tawk setup.
