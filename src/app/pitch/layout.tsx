import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales pitch",
  robots: { index: false, follow: false },
};

export default function PitchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
