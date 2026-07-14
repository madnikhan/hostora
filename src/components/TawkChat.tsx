"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TAWK_SRC = "https://embed.tawk.to/6a52e1964e30b91d4a8526ff/1jt9s2d9c";
const IDLE_MS = 4000;

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

function injectTawk() {
  if (document.getElementById("tawk-to-script")) return;
  window.Tawk_API ??= {};
  const s1 = document.createElement("script");
  s1.id = "tawk-to-script";
  s1.async = true;
  s1.src = TAWK_SRC;
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");
  const s0 = document.getElementsByTagName("script")[0];
  s0.parentNode?.insertBefore(s1, s0);
}

/** Tawk.to live chat — interaction- or idle-gated; skip on sales pitch. */
export function TawkChat() {
  const pathname = usePathname();
  const onPitch = isPitchPath(pathname);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (onPitch || armed) return;

    let done = false;
    const arm = () => {
      if (done) return;
      done = true;
      setArmed(true);
    };

    const onPointer = () => arm();
    const onKey = () => arm();
    window.addEventListener("pointerdown", onPointer, { once: true, passive: true });
    window.addEventListener("keydown", onKey, { once: true });
    const idle = window.setTimeout(arm, IDLE_MS);

    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(idle);
    };
  }, [onPitch, armed]);

  useEffect(() => {
    if (!armed || onPitch) return;
    injectTawk();
  }, [armed, onPitch]);

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

  return null;
}
