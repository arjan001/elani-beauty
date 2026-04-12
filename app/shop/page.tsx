import { Suspense } from "react"
import { ShopPage } from "@/components/store/shop-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Professional Ankara Suits & Shirts | Classy Collections",
  description:
    "Browse premium Ankara suits and shirts at Classy Collections. Men's and women's Ankara fashion with high-quality African prints. Professional office wear, casual styles, and formal outfits. Delivered across Kenya.",
  alternates: { canonical: "https://classycollections.com/shop" },
  keywords: [
    "classy collections shop", "ankara fashion Kenya", "shop ankara dresses", "buy ankara suits",
    "women ankara dresses", "men ankara suits", "ankara kimonos Kenya", "ankara palazzo pants",
    "african print clothing", "authentic ankara fashion", "best ankara designs Kenya",
    "ankara fashion online", "premium ankara wear", "ready-made ankara suits",
    "casual ankara outfits", "formal ankara wear", "affordable ankara fashion",
    "Ankara office wear", "professional African wear", "Ankara business attire",
    "Ankara party dresses", "Ankara wedding suits", "Ankara evening wear",
    "buy ankara online Kenya", "ankara online store Kenya", "quality ankara clothing",
  ],
  openGraph: {
    title: "Professional Ankara Suits & Shirts | Classy Collections",
    description: "Premium Ankara suits, dresses, kimonos, and more. Quality African print fashion delivered across Kenya and East Africa.",
    url: "https://classycollections.com/shop",
    type: "website",
    siteName: "Classy Collections",
    locale: "en_KE",
    images: [{ url: "https://classycollections.com/logo.png", width: 512, height: 512, alt: "Classy Collections Shop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Ankara Suits & Shirts | Classy Collections",
    description: "Premium Ankara suits, dresses, kimonos, and more delivered across Kenya and East Africa.",
    images: ["https://classycollections.com/logo.png"],
    creator: "@_classycollections",
  },
}

export default function Page() {
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  )
}

