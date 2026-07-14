"use client";

import dynamic from "next/dynamic";

const ProductDemoVideo = dynamic(
  () =>
    import("@/components/ProductDemoVideo").then((m) => m.ProductDemoVideo),
  { ssr: true },
);

const HomeStickyChapters = dynamic(
  () =>
    import("@/components/HomeStickyChapters").then((m) => m.HomeStickyChapters),
  { ssr: true },
);

/** Client shell so next/dynamic actually splits Framer-heavy home islands. */
export function HomeBelowFold() {
  return (
    <>
      <ProductDemoVideo />
      <HomeStickyChapters />
    </>
  );
}
