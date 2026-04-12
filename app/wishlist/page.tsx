import type { Metadata } from "next"
import { WishlistPage } from "@/components/store/wishlist-page"
import { PAGE_SEO, SITE_SEO } from "@/lib/seo-data"

export const metadata: Metadata = {
  title: PAGE_SEO.wishlist.title,
  description: PAGE_SEO.wishlist.description,
  alternates: { canonical: `${SITE_SEO.siteUrl}/wishlist` },
  keywords: [
    "Elani Beauty Hub wishlist", "saved fashion pieces", "favourite beauty items",
    "fashion wishlist Kenya", "women fashion collection", "Elani Beauty Hub saved items",
    "buy later fashion", "curated fashion picks", "Elani Beauty Hub wishlist",
  ],
  authors: [{ name: SITE_SEO.siteName, url: SITE_SEO.siteUrl }],
  creator: SITE_SEO.siteName,
  publisher: SITE_SEO.siteName,
  openGraph: {
    title: PAGE_SEO.wishlist.title,
    description: PAGE_SEO.wishlist.description,
    url: `${SITE_SEO.siteUrl}/wishlist`,
    siteName: SITE_SEO.siteName,
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary",
    title: PAGE_SEO.wishlist.title,
    description: PAGE_SEO.wishlist.description,
    creator: `@${SITE_SEO.twitter}`,
  },
}

export default function Page() {
  return <WishlistPage />
}
