import Script from "next/script";

const TAWK_SRC = "https://embed.tawk.to/6a52e1964e30b91d4a8526ff/";

/** Tawk.to live chat — site-wide. */
export function TawkChat() {
  return (
    <>
      <Script id="tawk-init" strategy="lazyOnload">{`
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
      `}</Script>
      <Script id="tawk-embed" src={TAWK_SRC} strategy="lazyOnload" />
    </>
  );
}
