import { bookingConfig } from "@/lib/booking/config";

/** Sales team roster from env — shared login, assign by email. */
export function getSalesTeam(): string[] {
  const raw = process.env.SALES_TEAM?.trim();
  if (raw) {
    return raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
  }
  return bookingConfig.notifyEmails.map((e) => e.toLowerCase());
}

export function defaultAssigneeEmail(): string {
  const team = getSalesTeam();
  return team[0] || "sales@hostorasoft.co.uk";
}
