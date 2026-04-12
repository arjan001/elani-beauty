import { Suspense } from "react"
import { ShopPage } from "@/components/store/shop-page"
import type { Metadata } from "next"
import { SITE_SEO, PAGE_SEO } from "@/lib/seo-data"

const siteUrl = SITE_SEO.siteUrl

export const metadata: Metadata = {
  title: PAGE_SEO.shop.title,
  description: PAGE_SEO.shop.description,
  alternates: { canonical: `${siteUrl}/shop` },
  keywords: [
    "Elani Beauty Hub shop", "thrift fashion Kenya", "thrift shop Nairobi", "buy thrift online Kenya",
    "women tops Nairobi", "thrift dresses Kenya", "thrift bodysuits", "thrift jackets Nairobi",
    "buy dresses online Kenya", "buy tops online Kenya", "best thrift shop Nairobi",
    "affordable women fashion", "quality thrift clothing Kenya", "preloved fashion Nairobi",
    "new and thrift fashion", "women fashion online Kenya", "curated thrift fashion",
    "casual women outfits", "formal women wear", "office wear women Kenya",
    "party dresses Kenya", "evening dresses Nairobi", "second hand clothes Kenya",
    "mitumba fashion Nairobi", "best place to buy dresses Nairobi", "best place to buy tops Kenya",
    "online thrift store Kenya", "cheap thrift clothes Nairobi",
  ],
  authors: [{ name: "Elani Beauty Hub", url: siteUrl }],
  creator: "Elani Beauty Hub",
  openGraph: {
    title: PAGE_SEO.shop.title,
    description: PAGE_SEO.shop.description,
    url: `${siteUrl}/shop`,
    type: "website",
    siteName: "Elani Beauty Hub",
    locale: "en_KE",
    images: [{ url: `${siteUrl}/logo-kf.png`, width: 512, height: 512, alt: "Elani Beauty Hub Shop - Thrift & New Fashion" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@_classycollections",
    creator: "@_classycollections",
    title: PAGE_SEO.shop.title,
    description: PAGE_SEO.shop.description,
    images: [{ url: `${siteUrl}/logo-kf.png`, alt: "Elani Beauty Hub Shop" }],
  },
}

export default function Page() {
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  )
}
