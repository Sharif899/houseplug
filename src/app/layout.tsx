import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GoogleAdsense } from "@/components/ads/GoogleAdsense";

const APP_URL  = process.env.NEXT_PUBLIC_APP_URL || "https://houseplug.ng";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default:  "HousePlug Osogbo — Houses & Shops for Rent and Sale",
    template: "%s | HousePlug Osogbo",
  },
  description:
    "Find verified houses, apartments, and shops for rent or sale in Osogbo, Osun State. Connect with agents directly via WhatsApp. Free to browse.",
  keywords: ["houses for rent Osogbo","property sale Osogbo","shops for rent Osogbo","Osun State real estate"],
  openGraph: { type:"website", locale:"en_NG", url:APP_URL, siteName:"HousePlug Osogbo" },
  robots: { index:true, follow:true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GoogleAdsense clientId={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-[62px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
