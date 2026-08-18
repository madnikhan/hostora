"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const TAWK_SRC = "https://embed.tawk.to/6a52e1964e30b91d4a8526ff/1jt9s2d9c";
const IDLE_MS = 4000;

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void;
      showWidget?: () => void;
      onLoad?: () => void;
      setAttributes?: (
        attrs: Record<string, string>,
        cb?: (err?: Error) => void,
      ) => void;
    };
  }
}

function isPitchPath(pathname: string | null) {
  return pathname === "/pitch" || Boolean(pathname?.startsWith("/pitch/"));
}

function injectTawk(onReady: () => void) {
  if (document.getElementById("tawk-to-script")) {
    onReady();
    return;
  }
  window.Tawk_API ??= {};
  window.Tawk_API.onLoad = onReady;
  const s1 = document.createElement("script");
  s1.id = "tawk-to-script";
  s1.async = true;
  s1.src = TAWK_SRC;
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");
  const s0 = document.getElementsByTagName("script")[0];
  s0.parentNode?.insertBefore(s1, s0);
}

function pushTawkContext(pathname: string, search: string) {
  const attrs: Record<string, string> = { page: pathname };
  const sp = new URLSearchParams(search);
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "ref"]) {
    const v = sp.get(key);
    if (v) attrs[key] = v;
  }
  window.Tawk_API?.setAttributes?.(attrs, () => {});
}

/** Tawk.to live chat — interaction- or idle-gated; skip on sales pitch. */
export function TawkChat() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
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
    injectTawk(() => pushTawkContext(pathname, search));
  }, [armed, onPitch, pathname, search]);

  useEffect(() => {
    if (!armed || onPitch) return;
    pushTawkContext(pathname, search);
  }, [armed, onPitch, pathname, search]);

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
