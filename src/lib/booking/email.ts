import nodemailer from "nodemailer";
import { formatInTimeZone } from "date-fns-tz";
import { bookingConfig, isSmtpConfigured } from "@/lib/booking/config";
import { company } from "@/lib/company";

export type BookingMailPayload = {
  name: string;
  email: string;
  companyName: string;
  phone: string;
  start: Date;
  meetLink: string | null;
  htmlLink?: string | null;
};

function whenLabel(start: Date): string {
  return formatInTimeZone(
    start,
    bookingConfig.timezone,
    "EEEE d MMMM yyyy 'at' HH:mm zzz",
  );
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
    ${meet}
    <p style="margin-top:32px;color:#9a958c;font-size:13px">${company.legalName} · ${company.email}</p>
  </div>`;
}

function internalHtml(p: BookingMailPayload): string {
  const when = whenLabel(p.start);
  return `
  <div style="font-family:system-ui,sans-serif;padding:24px">
    <h2>New Hostora demo booking</h2>
    <ul>
      <li><strong>Name:</strong> ${p.name}</li>
      <li><strong>Email:</strong> ${p.email}</li>
      <li><strong>Company:</strong> ${p.companyName}</li>
      <li><strong>Phone:</strong> ${p.phone}</li>
      <li><strong>When:</strong> ${when}</li>
      <li><strong>Meet:</strong> ${p.meetLink || "(pending)"}</li>
      <li><strong>Calendar:</strong> ${p.htmlLink || "n/a"}</li>
    </ul>
  </div>`;
}

function createTransport() {
  return nodemailer.createTransport({
    host: bookingConfig.smtpHost,
    port: bookingConfig.smtpPort,
    secure: bookingConfig.smtpPort === 465,
    auth: {
      user: bookingConfig.smtpUser,
      pass: bookingConfig.smtpPass,
    },
  });
}

export async function sendBookingEmails(p: BookingMailPayload): Promise<void> {
  if (!isSmtpConfigured()) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS on the server.",
    );
  }

  const transport = createTransport();
  const when = whenLabel(p.start);
  const replyTo = company.email;

  await transport.sendMail({
    from: bookingConfig.fromEmail,
    replyTo,
    to: p.email,
    subject: `Hostora demo confirmed — ${when}`,
    html: customerHtml(p),
  });

  if (bookingConfig.notifyEmails.length) {
    await transport.sendMail({
      from: bookingConfig.fromEmail,
      replyTo,
      to: bookingConfig.notifyEmails,
      subject: `New Hostora demo: ${p.name} · ${p.companyName}`,
      html: internalHtml(p),
    });
  }
}
