import { DeliveryPage } from "@/components/store/delivery-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Delivery Locations & Rates | Elani Beauty Hub",
  description:
    "Elani Beauty Hub delivery locations and shipping rates across Kenya. Affordable fashion delivery. Pay via M-PESA or cash on delivery.",
  alternates: { canonical: "https://classycollections.com/delivery" },
  keywords: [
    "Elani Beauty Hub delivery", "fashion delivery Kenya", "fashion delivery Nairobi",
    "shipping rates Kenya", "fashion shipping Kenya",
  ],
  openGraph: {
    title: "Delivery Locations & Rates | Elani Beauty Hub",
    description: "Affordable fashion delivery across Kenya. M-PESA accepted.",
    url: "https://classycollections.com/delivery",
    type: "website",
    siteName: "Elani Beauty Hub",
    locale: "en_KE",
    images: [{ url: "https://classycollections.com/logo.png", width: 512, height: 512, alt: "Elani Beauty Hub Delivery" }],
  },
  twitter: {
    card: "summary",
    title: "Delivery Locations & Rates | Elani Beauty Hub",
    description: "Affordable fashion delivery across Kenya.",
  },
}

export default function Page() {
  return <DeliveryPage />
}
