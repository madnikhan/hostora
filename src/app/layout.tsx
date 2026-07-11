import type { Metadata } from "next";
import { Syne, DM_Sans, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { company } from "@/lib/company";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://hostora.io";

const titleDefault =
  "Hostora — Restaurant, hotel F&B, takeaway & food cart software";
const description = `Hostora is hospitality operations software by ${company.legalName} for restaurants, takeaways, event venues, hotels (F&B), and food carts. POS, kitchen display, guest QR, payments, inventory, HR, and reporting — ${company.markets}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: titleDefault,
    template: "%s · Hostora",
  },
  description,
  keywords: [
    "restaurant POS software",
    "hotel restaurant software",
    "takeaway POS",
    "food cart POS",
    "hospitality operations platform",
    "kitchen display system",
    "food business software",
    "K WAZIR LTD",
    "Hostora",
  ],
  authors: [{ name: company.legalName }],
  creator: company.legalName,
  publisher: company.legalName,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Hostora",
    title: titleDefault,
    description,
    images: [
      {
        url: "/brand/og.png",
        width: 1200,
        height: 630,
        alt: "Hostora — hospitality operations software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: titleDefault,
    description,
    images: ["/brand/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/mark.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    legalName: company.legalName,
    brand: {
      "@type": "Brand",
      name: company.productBrand,
    },
    url: siteUrl,
    logo: `${siteUrl}/brand/mark.png`,
    email: company.email,
    identifier: {
      "@type": "PropertyValue",
      name: "Company Number",
      value: company.number,
      propertyID: "Companies House",
      url: company.companiesHouseUrl,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "7 Wellesley Street",
      addressLocality: "Gloucester",
      postalCode: "GL1 4QP",
      addressCountry: "GB",
    },
    areaServed: ["US", "EU", "GB"],
    description,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Hostora",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
    image: `${siteUrl}/brand/og.png`,
    description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
      description: "Custom quote per venue — contact sales",
      url: `${siteUrl}/contact`,
    },
    provider: {
      "@type": "Organization",
      name: company.legalName,
      identifier: company.number,
    },
    audience: {
      "@type": "Audience",
      audienceType:
        "Restaurants, takeaways, event venues, hotel F&B, and food cart operators",
    },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full bg-background text-foreground"
        suppressHydrationWarning
      >
        <JsonLd data={jsonLd} />
        {children}
      </body>
    </html>
  );
}
