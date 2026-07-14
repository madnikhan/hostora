# Hostora sales pack

Assets for sales representatives and prospects. Regenerate from the Hostora repo root:

```bash
npm run sales:pack
```

| Asset | Path | Audience |
|-------|------|----------|
| Sales presentation (PPTX) | [/sales/Hostora-Sales-Presentation.pptx](/sales/Hostora-Sales-Presentation.pptx) | Email / offline meetings |
| Brochure (PDF) | [/sales/Hostora-Brochure.pdf](/sales/Hostora-Brochure.pdf) | Leave-behind for prospects |
| Sales rep manual (TXT) | [/sales/Hostora-Sales-Rep-Manual.txt](/sales/Hostora-Sales-Rep-Manual.txt) | Internal training (primary) |
| Sales rep manual (PDF) | [/sales/Hostora-Sales-Rep-Manual.pdf](/sales/Hostora-Sales-Rep-Manual.pdf) | Print of the text manual |
| One-pager | [one-pager.md](./one-pager.md) | Quick talk track |
| Soro SEO setup | [soro-seo.md](./soro-seo.md) | Connect [trysoro.com](https://trysoro.com/) webhook to `/blog` |
| Web pitch | https://hostorasoft.co.uk/pitch | Live animated deck |
| **Internal price book (PDF)** | [/sales/Hostora-Internal-Price-Book.pdf](/sales/Hostora-Internal-Price-Book.pdf) | **CONFIDENTIAL — founders & reps only** |

Regenerate the internal price book separately (not part of `sales:pack`):

```bash
npm run sales:pricebook
```

**Model:** hardware one-time (full RRP) + software **£50–£90/mo** by pack + go-live setup fee. Edit list numbers in [`scripts/lib/pricing.mjs`](../../scripts/lib/pricing.mjs), then re-run. Do **not** link this PDF from the marketing site, quote pack, or guest materials. Public messaging stays “quote after demo.”

**Vendor:** K WAZIR LTD · sales@hostorasoft.co.uk · https://hostorasoft.co.uk

Never brand the product as Fumari. Lead with Restaurant / Takeaway / Events **packs**; hotel F&B and carts are **configured**. Package quote after demo — not “custom software project.”
