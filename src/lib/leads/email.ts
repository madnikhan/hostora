import nodemailer from "nodemailer";
import { formatInTimeZone } from "date-fns-tz";
import { bookingConfig, isSmtpConfigured } from "@/lib/booking/config";
import { company, siteUrl } from "@/lib/company";
import type { DueReminder } from "@/lib/leads/store";
import type { FollowUpTemplateId, Lead } from "@/lib/leads/types";

function createTransport() {
  const port = bookingConfig.smtpPort;
  return nodemailer.createTransport({
    host: bookingConfig.smtpHost,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: {
      user: bookingConfig.smtpUser,
      pass: bookingConfig.smtpPass,
    },
    connectionTimeout: 20_000,
    greetingTimeout: 20_000,
    socketTimeout: 20_000,
  });
}

function whenLabel(iso: string): string {
  return formatInTimeZone(
    new Date(iso),
    bookingConfig.timezone,
    "EEEE d MMMM yyyy 'at' HH:mm zzz",
  );
}

function templateBody(
  templateId: FollowUpTemplateId,
  lead: Lead,
): { subject: string; html: string; text: string } {
  const when = whenLabel(lead.start);
  const contactUrl = `${siteUrl}/contact`;
  const quoteUrl = `${siteUrl}/sales/Hostora-Quote-Pack.pdf`;

  if (templateId === "post_demo_thanks") {
    const subject = `Thanks for the Hostora demo — next steps`;
    const text = `Hi ${lead.name},\n\nThanks for joining the Hostora demo for ${lead.companyName}.\n\nIf you have questions about packs (Restaurant, Takeaway, Events) or configured hotel F&B / food cart installs, reply to this email.\n\nQuote pack: ${quoteUrl}\nBook another slot: ${contactUrl}\n\n— Hostora · ${company.legalName}`;
    const html = `<div style="font-family:system-ui,sans-serif;background:#0b0b0c;color:#f4f1ea;padding:32px">
      <h1 style="color:#e8a54b;font-size:22px">Thanks for the demo</h1>
      <p>Hi ${lead.name},</p>
      <p>Thanks for joining the Hostora demo for <strong>${lead.companyName}</strong> (${when}).</p>
      <p>Reply anytime with questions on Restaurant / Takeaway / Events packs, or configured hotel F&amp;B and food cart installs.</p>
      <p><a href="${quoteUrl}" style="color:#e8a54b">Download quote pack</a> · <a href="${contactUrl}" style="color:#e8a54b">Book another slot</a></p>
      <p style="color:#9a958c;font-size:13px;margin-top:28px">${company.legalName} · ${company.email}</p>
    </div>`;
    return { subject, html, text };
  }

  if (templateId === "quote_nudge") {
    const subject = `Hostora package quote — ready when you are`;
    const text = `Hi ${lead.name},\n\nFollowing up on Hostora for ${lead.companyName}.\n\nHappy to send a package quote after a short floor survey — stations, printers, and optional Docker local server.\n\nQuote pack: ${quoteUrl}\nReply to this email or book: ${contactUrl}\n\n— Hostora`;
    const html = `<div style="font-family:system-ui,sans-serif;background:#0b0b0c;color:#f4f1ea;padding:32px">
      <h1 style="color:#e8a54b;font-size:22px">Package quote</h1>
      <p>Hi ${lead.name},</p>
      <p>Following up on Hostora for <strong>${lead.companyName}</strong>.</p>
      <p>We quote packages after a short floor survey — not an open-ended custom build.</p>
      <p><a href="${quoteUrl}" style="color:#e8a54b">Quote pack PDF</a> · <a href="${contactUrl}" style="color:#e8a54b">Book a call</a></p>
      <p style="color:#9a958c;font-size:13px;margin-top:28px">${company.legalName}</p>
    </div>`;
    return { subject, html, text };
  }

  // no_show_reschedule
  const subject = `Missed you on the Hostora demo — let's reschedule`;
  const text = `Hi ${lead.name},\n\nWe missed you on the Hostora demo scheduled for ${when}.\n\nNo problem — pick a new slot here: ${contactUrl}\n\n— Hostora · ${company.email}`;
  const html = `<div style="font-family:system-ui,sans-serif;background:#0b0b0c;color:#f4f1ea;padding:32px">
    <h1 style="color:#e8a54b;font-size:22px">Let's reschedule</h1>
    <p>Hi ${lead.name},</p>
    <p>We missed you on the Hostora demo for <strong>${lead.companyName}</strong> (${when}).</p>
    <p><a href="${contactUrl}" style="background:#e8a54b;color:#0b0b0c;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600;display:inline-block">Pick a new time</a></p>
    <p style="color:#9a958c;font-size:13px;margin-top:28px">${company.legalName}</p>
  </div>`;
  return { subject, html, text };
}

export async function sendLeadFollowUpEmail(
  lead: Lead,
  templateId: FollowUpTemplateId,
): Promise<void> {
  if (!isSmtpConfigured()) {
    throw new Error("SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASS).");
  }
  const { subject, html, text } = templateBody(templateId, lead);
  const transport = createTransport();
  await transport.sendMail({
    from: bookingConfig.fromEmail,
    to: lead.email,
    replyTo: company.email,
    bcc: lead.assignee || bookingConfig.notifyEmails[0],
    subject,
    text,
    html,
  });
}

export async function sendStaffReminderDigest(
  items: DueReminder[],
): Promise<number> {
  if (!items.length) return 0;
  if (!isSmtpConfigured()) {
    throw new Error("SMTP is not configured.");
  }

  const byAssignee = new Map<string, DueReminder[]>();
  for (const item of items) {
    const key = item.lead.assignee || bookingConfig.notifyEmails[0];
    const list = byAssignee.get(key) || [];
    list.push(item);
    byAssignee.set(key, list);
  }

  const transport = createTransport();
  let sent = 0;

  for (const [assignee, rows] of byAssignee) {
    const lines = rows
      .map(({ lead, task }) => {
        const due = whenLabel(task.dueAt);
        const adminUrl = `${siteUrl}/admin/leads/${lead.id}`;
        return `• ${task.type.toUpperCase()}: ${task.title}\n  ${lead.name} · ${lead.companyName} · ${lead.phone}\n  Due: ${due}\n  ${adminUrl}`;
      })
      .join("\n\n");

    const htmlRows = rows
      .map(({ lead, task }) => {
        const due = whenLabel(task.dueAt);
        return `<li style="margin-bottom:16px">
          <strong>${task.type}</strong> — ${task.title}<br/>
          ${lead.name} · ${lead.companyName} · <a href="tel:${lead.phone}">${lead.phone}</a><br/>
          Due: ${due}<br/>
          <a href="${siteUrl}/admin/leads/${lead.id}">Open lead</a>
        </li>`;
      })
      .join("");

    await transport.sendMail({
      from: bookingConfig.fromEmail,
      to: assignee,
      subject: `Hostora follow-ups due (${rows.length})`,
      text: `Follow-ups due today:\n\n${lines}\n\n— Hostora leads`,
      html: `<div style="font-family:system-ui,sans-serif;padding:24px">
        <h2>Follow-ups due</h2>
        <ul>${htmlRows}</ul>
      </div>`,
    });
    sent += 1;
  }

  return sent;
}
