import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hostora SEO admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-seo-shell min-h-screen bg-[#0B0B0C] text-[#F4F1EA] antialiased">
      <header className="border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link
            href="/admin/seo"
            className="font-[family-name:var(--font-display)] text-lg tracking-tight text-[#E8A54B]"
          >
            Hostora · SEO
          </Link>
          <Link
            href="/"
            className="text-sm text-white/50 transition hover:text-white/80"
          >
            ← Site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
