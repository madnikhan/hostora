import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "TikTok ads",
  robots: { index: false, follow: false },
};

export default function AdsTikTokLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        iframe[title*="chat" i],
        iframe[src*="tawk.to"],
        div[id*="tawk" i],
        #tawkchat-container,
        .widget-visible { display: none !important; visibility: hidden !important; }
        body { overflow: hidden; background: #000; }
      `}</style>
      {children}
    </>
  );
}
