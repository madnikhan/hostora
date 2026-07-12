"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const TAWK_SRC = "https://embed.tawk.to/6a52e1964e30b91d4a8526ff/1jt9s2d9c";

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void;
      showWidget?: () => void;
    };
  }
}

function isPitchPath(pathname: string | null) {
  return pathname === "/pitch" || Boolean(pathname?.startsWith("/pitch/"));
}

/** Tawk.to live chat — site-wide except sales pitch (blocks pitch controls). */
export function TawkChat() {
  const pathname = usePathname();
  const onPitch = isPitchPath(pathname);

  useEffect(() => {
    const root = document.documentElement;
    if (onPitch) {
      root.classList.add("no-tawk");
      window.Tawk_API?.hideWidget?.();
    } else {
      root.classList.remove("no-tawk");
      window.Tawk_API?.showWidget?.();
    }
    return () => {
      root.classList.remove("no-tawk");
    };
  }, [onPitch]);

  if (onPitch) return null;

  return (
    <Script id="tawk-to" strategy="afterInteractive">{`
      var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
      (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src=${JSON.stringify(TAWK_SRC)};
        s1.charset="UTF-8";
        s1.setAttribute("crossorigin","*");
        s0.parentNode.insertBefore(s1,s0);
      })();
    `}</Script>
  );
}
