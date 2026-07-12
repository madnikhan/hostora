import { Resend } from "resend";
import { formatInTimeZone } from "date-fns-tz";
import { bookingConfig } from "@/lib/booking/config";
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

export async function sendBookingEmails(p: BookingMailPayload): Promise<void> {
  if (!bookingConfig.resendApiKey) {
    console.warn("RESEND_API_KEY missing — skipping emails");
    return;
  }

  const resend = new Resend(bookingConfig.resendApiKey);
  const when = whenLabel(p.start);

  await resend.emails.send({
    from: bookingConfig.fromEmail,
    to: p.email,
    subject: `Hostora demo confirmed — ${when}`,
    html: customerHtml(p),
  });

  if (bookingConfig.notifyEmails.length) {
    await resend.emails.send({
      from: bookingConfig.fromEmail,
      to: bookingConfig.notifyEmails,
      subject: `New Hostora demo: ${p.name} · ${p.companyName}`,
      html: internalHtml(p),
    });
  }
}
