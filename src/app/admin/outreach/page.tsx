"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminButton } from "@/components/admin/AdminButton";
import {
  AssigneePicker,
  getStoredAssignee,
} from "@/components/admin/leads/AssigneePicker";
import {
  buildShortGoUrl,
  buildTrackedContactUrl,
  outreachGroups,
} from "@/lib/outreach/groups";
import { getSalesTeam } from "@/lib/leads/team";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <AdminButton
      variant="secondary"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      {copied ? "Copied" : label}
    </AdminButton>
  );
}

export default function AdminOutreachPage() {
  const team = useMemo(() => getSalesTeam(), []);
  const [member, setMember] = useState("");
  const [groupSlug, setGroupSlug] = useState(outreachGroups[0]?.slug ?? "");

  useEffect(() => {
    setMember(getStoredAssignee());
  }, []);

  const group = outreachGroups.find((g) => g.slug === groupSlug);

  const trackedUrl = group
    ? buildTrackedContactUrl(group.slug, member || undefined)
    : "";
  const shortUrl = group ? buildShortGoUrl(group.slug) : "";

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin"
          className="text-sm text-white/50 hover:text-white/80"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Facebook outreach
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/55">
          Copy post text and tracked links for Facebook groups. Post manually,
          then log replies as leads in CRM.
        </p>
      </div>

      <AssigneePicker team={team} value={member} onChange={setMember} />

      <div className="flex flex-wrap gap-3">
        <select
          value={groupSlug}
          onChange={(e) => setGroupSlug(e.target.value)}
          className="min-w-[16rem] border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#E8A54B]"
        >
          {outreachGroups.map((g) => (
            <option key={g.slug} value={g.slug}>
              {g.name} ({g.region.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {group ? (
        <div className="space-y-6 border border-white/10 bg-[#141416] p-4">
          <p className="text-sm text-white/70">
            Group: <span className="text-white">{group.name}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={trackedUrl} label="Copy tracked /contact link" />
            <CopyButton text={shortUrl} label="Copy short /go link" />
          </div>
          <p className="break-all text-xs text-white/45">{trackedUrl}</p>

          <ol className="list-decimal space-y-1 pl-5 text-sm text-white/60">
            <li>Copy a post below and publish in the Facebook group</li>
            <li>Watch for replies / DMs</li>
            <li>
              Add lead in{" "}
              <Link href="/admin/leads" className="text-[#E8A54B] hover:underline">
                /admin/leads
              </Link>{" "}
              with source Facebook group
            </li>
          </ol>

          {group.posts.map((post) => (
            <div key={post.id} className="border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-wide text-[#E8A54B]">
                {post.label}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-white/80">
                {post.body.replace(
                  /https:\/\/www\.hostorasoft\.co\.uk\/contact[^\s]*/g,
                  trackedUrl,
                )}
              </p>
              <div className="mt-3">
                <CopyButton
                  text={post.body.replace(
                    /https:\/\/www\.hostorasoft\.co\.uk\/contact[^\s]*/g,
                    trackedUrl,
                  )}
                  label={`Copy ${post.label}`}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
