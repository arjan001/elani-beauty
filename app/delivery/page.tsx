import { DeliveryPage } from "@/components/store/delivery-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Delivery Locations & Rates | Classy Collections",
  description:
    "Classy Collections delivery locations and shipping rates across Kenya. Affordable Ankara fashion delivery. Pay via M-PESA or cash on delivery.",
  alternates: { canonical: "https://classycollections.com/delivery" },
  keywords: [
    "Classy Collections delivery", "ankara delivery Kenya", "fashion delivery Nairobi",
    "shipping rates Kenya", "fashion shipping Kenya",
  ],
  openGraph: {
    title: "Delivery Locations & Rates | Classy Collections",
    description: "Affordable Ankara fashion delivery across Kenya. M-PESA accepted.",
    url: "https://classycollections.com/delivery",
    type: "website",
    siteName: "Classy Collections",
    locale: "en_KE",
    images: [{ url: "https://classycollections.com/logo.png", width: 512, height: 512, alt: "Classy Collections Delivery" }],
  },
  twitter: {
    card: "summary",
    title: "Delivery Locations & Rates | Classy Collections",
    description: "Affordable Ankara fashion delivery across Kenya.",
  },
}

export default function Page() {
  return <DeliveryPage />
}
