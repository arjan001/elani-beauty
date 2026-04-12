import { Suspense } from "react"
import { ShopPage } from "@/components/store/shop-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Women's Bodysuits, Dresses & Tops | Classy Collections",
  description:
    "Browse premium bodysuits, dresses, and tops at Classy Collections. Women's fashion with quality fabrics. Office wear, casual styles, and evening outfits. Delivered across Kenya.",
  alternates: { canonical: "https://classycollections.com/shop" },
  keywords: [
    "classy collections shop", "women fashion Kenya", "shop bodysuits", "buy dresses Kenya",
    "women bodysuits", "women dresses", "corset tops Kenya", "women tops",
    "quality women clothing", "premium women fashion", "best women designs Kenya",
    "women fashion online", "premium women wear", "curated women fashion",
    "casual women outfits", "formal women wear", "affordable women fashion",
    "women office wear", "professional women wear", "women business attire",
    "party dresses Kenya", "evening dresses", "women evening wear",
    "buy women clothing online Kenya", "women online store Kenya", "quality women clothing",
  ],
  openGraph: {
    title: "Women's Bodysuits, Dresses & Tops | Classy Collections",
    description: "Premium bodysuits, dresses, tops, and jackets. Quality women's fashion delivered across Kenya and East Africa.",
    url: "https://classycollections.com/shop",
    type: "website",
    siteName: "Classy Collections",
    locale: "en_KE",
    images: [{ url: "https://classycollections.com/logo.png", width: 512, height: 512, alt: "Classy Collections Shop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Women's Bodysuits, Dresses & Tops | Classy Collections",
    description: "Premium bodysuits, dresses, tops, and jackets delivered across Kenya and East Africa.",
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
