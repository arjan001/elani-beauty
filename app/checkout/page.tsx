import { CheckoutPage } from "@/components/store/checkout-page"
import type { Metadata } from "next"
import { PAGE_SEO, SITE_SEO } from "@/lib/seo-data"

export const metadata: Metadata = {
  title: PAGE_SEO.checkout.title,
  description: PAGE_SEO.checkout.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: PAGE_SEO.checkout.title,
    description: PAGE_SEO.checkout.description,
    url: `${SITE_SEO.siteUrl}/checkout`,
    siteName: SITE_SEO.siteName,
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: PAGE_SEO.checkout.title,
    description: PAGE_SEO.checkout.description,
    creator: `@${SITE_SEO.twitter}`,
  },
}

export default function Page() {
  return <CheckoutPage />
}
