"use client";

import Script from "next/script";

/** Hostora Production default from Soro Connect → Embed. Override via env. */
export const DEFAULT_SORO_EMBED_ID = "f4209b93-9cbd-4ae4-b286-ded667a515ef";

type Props = {
  embedId?: string;
};

/**
 * Official Soro blog widget (Soro has no webhook publish for Next.js).
 * Mount only on /blog — not sitewide.
 */
export function SoroBlogEmbed({ embedId }: Props) {
  const id =
    embedId?.trim() ||
    process.env.NEXT_PUBLIC_SORO_EMBED_ID?.trim() ||
    DEFAULT_SORO_EMBED_ID;

  if (!id) return null;

  return (
    <div className="mt-14 min-h-[12rem]">
      <div id="soro-blog" />
      <Script
        src={`https://app.trysoro.com/api/embed/${id}?theme=dark`}
        strategy="afterInteractive"
      />
    </div>
  );
}
