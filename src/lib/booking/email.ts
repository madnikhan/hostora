import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { formatInTimeZone } from "date-fns-tz";
import { bookingConfig, isSmtpConfigured } from "@/lib/booking/config";
import { buildDemoIcs } from "@/lib/booking/ics";
import { company, siteUrl } from "@/lib/company";

export type BookingMailPayload = {
  name: string;
  email: string;
  companyName: string;
  phone: string;
  vertical: string;
  start: Date;
  meetLink: string | null;
  htmlLink?: string | null;
  leadId?: string | null;
  leadError?: string | null;
};

export type BookingEmailResult = {
  customerMessageId?: string;
  customerResponse?: string;
  notifyMessageId?: string;
  notifyResponse?: string;
};

function whenLabel(start: Date): string {
  return formatInTimeZone(
    start,
    bookingConfig.timezone,
    "EEEE d MMMM yyyy 'at' HH:mm zzz",
  );
}

function customerText(p: BookingMailPayload): string {
  const when = whenLabel(p.start);
  const meet = p.meetLink
    ? `Join Google Meet: ${p.meetLink}`
    : "Your Google Meet link will be sent by our team shortly.";
  return [
    `Hostora demo confirmed`,
    ``,
    `Thanks ${p.name} — you're booked.`,
    ``,
    `When: ${when}`,
    `Company: ${p.companyName}`,
    `Business type: ${p.vertical}`,
    meet,
    ``,
    `Reply to this email if you need to reschedule.`,
    `${company.legalName} · ${company.email}`,
  ].join("\n");
}

function customerHtml(p: BookingMailPayload): string {
  const when = whenLabel(p.start);
  const meet = p.meetLink
    ? `<p style="margin:24px 0"><a href="${p.meetLink}" style="background:#e8a54b;color:#0b0b0c;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">Join Google Meet</a></p><p style="color:#9a958c;font-size:14px">${p.meetLink}</p>`
    : `<p style="color:#9a958c">Your Google Meet link will be sent by our team shortly.</p>`;

  return `
  <div style="font-family:system-ui,sans-serif;background:#0b0b0c;color:#f4f1ea;padding:32px">
    <h1 style="color:#e8a54b;font-size:24px;margin:0 0 8px">Hostora demo confirmed</h1>
    <p style="color:#9a958c;margin:0 0 24px">Thanks ${p.name} — you're booked.</p>
    <p><strong>When:</strong> ${when}</p>
    <p><strong>Company:</strong> ${p.companyName}</p>
    <p><strong>Business type:</strong> ${p.vertical}</p>
    ${meet}
    <p style="margin-top:32px;color:#9a958c;font-size:13px">${company.legalName} · ${company.email}</p>
  </div>`;
}

function internalText(p: BookingMailPayload): string {
  const when = whenLabel(p.start);
  const leadUrl = p.leadId ? `${siteUrl}/admin/leads/${p.leadId}` : null;
  const crm = leadUrl
    ? `CRM lead: ${leadUrl}`
    : `CRM: lead save failed${p.leadError ? ` — ${p.leadError}` : ""}`;
  return [
    `New Hostora demo booking`,
    ``,
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    `Company: ${p.companyName}`,
    `Vertical: ${p.vertical}`,
    `Phone: ${p.phone}`,
    `When: ${when}`,
    `Meet: ${p.meetLink || "(pending)"}`,
    `Calendar: ${p.htmlLink || "n/a"}`,
    crm,
  ].join("\n");
}

function internalHtml(p: BookingMailPayload): string {
  const when = whenLabel(p.start);
  const leadUrl = p.leadId ? `${siteUrl}/admin/leads/${p.leadId}` : null;
  const crmLine = leadUrl
    ? `<li><strong>CRM lead:</strong> <a href="${leadUrl}">${leadUrl}</a></li>`
    : `<li><strong>CRM:</strong> <span style="color:#b45309">Lead save failed${p.leadError ? ` — ${p.leadError}` : ""}. Check POSTGRES_URL on Vercel.</span></li>`;

  return `
  <div style="font-family:system-ui,sans-serif;padding:24px">
    <h2>New Hostora demo booking</h2>
    <ul>
      <li><strong>Name:</strong> ${p.name}</li>
      <li><strong>Email:</strong> ${p.email}</li>
      <li><strong>Company:</strong> ${p.companyName}</li>
      <li><strong>Vertical:</strong> ${p.vertical}</li>
      <li><strong>Phone:</strong> ${p.phone}</li>
      <li><strong>When:</strong> ${when}</li>
      <li><strong>Meet:</strong> ${p.meetLink || "(pending)"}</li>
      <li><strong>Calendar:</strong> ${p.htmlLink || "n/a"}</li>
      ${crmLine}
    </ul>
  </div>`;
}

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

function icsAttachment(p: BookingMailPayload) {
  const when = whenLabel(p.start);
  const ics = buildDemoIcs({
    start: p.start,
    summary: `Hostora demo — ${p.companyName}`,
    description: [
      `Hostora demo with ${p.name}`,
      `Company: ${p.companyName}`,
      `Phone: ${p.phone}`,
      p.meetLink ? `Meet: ${p.meetLink}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    meetLink: p.meetLink,
    attendeeEmail: p.email,
  });
  return {
    filename: "hostora-demo.ics",
    content: ics,
    contentType: "text/calendar; charset=utf-8; method=PUBLISH",
  };
}

function mailMeta(info: SMTPTransport.SentMessageInfo) {
  return {
    messageId: info.messageId || undefined,
    response: typeof info.response === "string" ? info.response : undefined,
  };
}

export async function sendBookingEmails(
  p: BookingMailPayload,
): Promise<BookingEmailResult> {
  if (!isSmtpConfigured()) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS on the server.",
    );
  }

  const transport = createTransport();
  const when = whenLabel(p.start);
  const replyTo = company.email;
  const from = bookingConfig.fromEmail;
  const result: BookingEmailResult = {};

  try {
    const customerInfo = await transport.sendMail({
      from,
      replyTo,
      to: p.email,
      subject: `Hostora demo confirmed — ${when}`,
      text: customerText(p),
      html: customerHtml(p),
      attachments: [icsAttachment(p)],
    });
    const customerMeta = mailMeta(customerInfo);
    result.customerMessageId = customerMeta.messageId;
    result.customerResponse = customerMeta.response;

    if (bookingConfig.notifyEmails.length) {
      const notifyInfo = await transport.sendMail({
        from,
        replyTo,
        to: bookingConfig.notifyEmails,
        subject: `New Hostora demo: ${p.name} · ${p.companyName}`,
        text: internalText(p),
        html: internalHtml(p),
      });
      const notifyMeta = mailMeta(notifyInfo);
      result.notifyMessageId = notifyMeta.messageId;
      result.notifyResponse = notifyMeta.response;
    }

    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Booking email failed (${bookingConfig.smtpHost}): ${msg}`);
  } finally {
    transport.close();
  }
}
