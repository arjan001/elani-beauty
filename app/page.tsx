import { LandingPage } from "@/components/store/landing-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Classy Collections - Ready-made Ankara Wear Nairobi",
  description:
    "Shop the latest Ankara suits, shirts, and dresses. High-quality African prints designed for the modern woman and man. Order today! Premium ready-made Ankara wear in Nairobi.",
  keywords: [
    // Core 70 SEO Tags
    "Ankara suits Nairobi", "ready-made Ankara wear", "African print dresses Kenya", "Ankara kimono sets", "Ankara palazzo pants",
    "Ankara tops for women", "men's Ankara shirts", "African fashion Nairobi", "modern Ankara styles 2026", "Ankara office wear",
    "Ankara wedding guest outfits", "high-quality African prints", "Classy Collections Nairobi", "Ankara streetwear", "plus size Ankara dresses",
    "Ankara wrap tops", "African wax print clothing", "trendy Ankara kimonos", "Ankara trousers for ladies", "traditional African attire",
    "contemporary African fashion", "Ankara shift dresses", "Ankara infinity dresses", "Ankara casual wear", "bespoke African outfits",
    "Ankara jackets Kenya", "handmade African clothes", "Ankara fashion house", "Nairobi fashion boutiques", "Ankara accessories",
    "Ankara jumpsuits", "bold African prints", "Ankara duster coats", "Ankara crop tops", "Ankara maxi dresses",
    "Ankara pencil skirts", "kitenge fashion Kenya", "African print suits for men", "Ankara matching sets", "vibrant African wear",
    "Ankara sundresses", "professional African wear", "Ankara holiday outfits", "African print kimonos", "luxury Ankara fashion",
    "affordable Ankara wear", "Classy Collections contact", "Ankara style inspiration", "African heritage clothing", "stylish Ankara blouses",
    "Ankara palazzo suits", "Ankara short dresses", "Ankara long dresses", "African print formal wear", "Nairobi thrift alternative",
    "premium kitenge designs", "Ankara loungewear", "Ankara festival outfits", "Kenyan fashion brands", "Ankara cocktail dresses",
    "Ankara bodycon dresses", "African print loungewear", "Ankara peplum tops", "Ankara flared pants", "African print fashionistas",
    "Nairobi clothing stores", "Ankara outfits for graduation", "stylish African print shirts", "Ankara fashion trends", "Classy Collections 0702642324",
  ],
  alternates: { canonical: "https://classycollections.com" },
  openGraph: {
    title: "Classy Collections - Ready-made Ankara Wear Nairobi",
    description: "Shop the latest Ankara suits, shirts, and dresses. High-quality African prints designed for the modern woman and man. Order today!",
    url: "https://classycollections.com",
    type: "website",
    siteName: "Classy Collections",
    locale: "en_KE",
    images: [{ url: "https://classycollections.com/logo.png", width: 512, height: 512, alt: "Classy Collections - Premium Ankara Fashion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Classy Collections - Ready-made Ankara Wear Nairobi",
    description: "Shop the latest Ankara suits, shirts, and dresses. High-quality African prints designed for the modern woman and man.",
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
            name: "Classy Collections - Ready-made Ankara Wear",
            description: "Premium authentic Ankara fashion online store in Kenya. Shop Ankara suits, dresses, kimonos, and more.",
            url: "https://classycollections.com",
            mainEntity: {
              "@type": "LocalBusiness",
              name: "Classy Collections",
              description: "Premium authentic Ankara fashion, suits, dresses, kimonos & more in Nairobi, Kenya",
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

