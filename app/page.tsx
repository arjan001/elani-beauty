import { LandingPage } from "@/components/store/landing-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Elani Beauty Hub - Women's Bodysuits, Dresses & Tops Nairobi",
  description:
    "Shop the latest bodysuits, dresses, tops, and jackets. Premium women's fashion designed for the modern woman. Order today! Quality curated pieces in Nairobi.",
  keywords: [
    "women bodysuits Nairobi", "bodysuit collection Kenya", "women dresses Kenya", "corset tops Nairobi",
    "women tops Kenya", "jackets for women Nairobi", "women fashion Nairobi", "modern women styles 2026",
    "office wear women Kenya", "wedding guest outfits Kenya", "high-quality women fashion", "Elani Beauty Hub Nairobi",
    "streetwear women Kenya", "plus size bodysuits", "lace dresses Kenya", "floral tops Nairobi",
    "trendy women clothing", "bodycon dresses Kenya", "casual women wear", "bespoke women outfits",
    "turtleneck bodysuits", "handmade women clothes", "fashion house Nairobi", "Nairobi fashion boutiques",
    "women accessories", "jumpsuits Kenya", "bold fashion prints", "crop tops Nairobi", "maxi dresses Kenya",
    "pencil skirts Nairobi", "fashion Kenya", "matching sets women", "vibrant women wear",
    "sundresses Kenya", "professional women wear", "holiday outfits Kenya", "luxury women fashion",
    "affordable women wear", "Elani Beauty Hub contact", "style inspiration Kenya",
    "short dresses Nairobi", "long dresses Kenya", "formal wear women", "Nairobi thrift alternative",
    "premium women designs", "loungewear Kenya", "festival outfits Nairobi", "Kenyan fashion brands",
    "cocktail dresses Kenya", "bodycon bodysuits", "peplum tops Kenya", "flared pants women",
    "fashion Nairobi", "Nairobi clothing stores", "graduation outfits Kenya", "stylish tops Nairobi",
    "fashion trends Kenya", "Elani Beauty Hub 0702642324", "off-shoulder bodysuits",
    "halter dresses Kenya", "corset fashion Nairobi", "women blouses Kenya",
    "spaghetti strap bodysuits", "elegant evening wear", "date night outfits Kenya",
    "going out tops Nairobi", "ribbed bodysuits", "mesh bodysuits Kenya",
    "women jackets Nairobi", "buy women clothing online Kenya",
  ],
  alternates: { canonical: "https://classycollections.com" },
  openGraph: {
    title: "Elani Beauty Hub - Women's Bodysuits, Dresses & Tops Nairobi",
    description: "Shop the latest bodysuits, dresses, tops, and jackets. Premium women's fashion designed for the modern woman. Order today!",
    url: "https://classycollections.com",
    type: "website",
    siteName: "Elani Beauty Hub",
    locale: "en_KE",
    images: [{ url: "https://classycollections.com/logo.png", width: 512, height: 512, alt: "Elani Beauty Hub - Premium Women's Fashion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elani Beauty Hub - Women's Bodysuits, Dresses & Tops Nairobi",
    description: "Shop the latest bodysuits, dresses, tops, and jackets. Premium women's fashion designed for the modern woman.",
    images: ["https://classycollections.com/logo.png"],
    creator: "@_classycollections",
  },
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Elani Beauty Hub - Women's Fashion",
            description: "Premium women's fashion online store in Kenya. Shop bodysuits, dresses, tops, jackets, and more.",
            url: "https://classycollections.com",
            mainEntity: {
              "@type": "LocalBusiness",
              name: "Elani Beauty Hub",
              description: "Premium women's fashion — bodysuits, dresses, tops, jackets & more in Nairobi, Kenya",
              image: "https://classycollections.com/logo.png",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nairobi",
                addressCountry: "KE",
              },
              telephone: "+254702642324",
              email: "info@classycollections.com",
              url: "https://classycollections.com",
            },
          }),
        }}
      />
      <LandingPage />
    </>
  )
}
