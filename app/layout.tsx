import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { Toaster } from "@/components/ui/sonner"
import { PageViewTracker } from "@/components/page-view-tracker"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const siteUrl = "https://classycollections.com"

export const metadata: Metadata = {
  title: {
    default: "Elani Beauty Hub | Premium Women's Bodysuits, Dresses & Tops in Nairobi",
    template: "%s | Elani Beauty Hub",
  },
  description:
    "Shop the latest women's bodysuits, dresses, tops, corsets, and jackets at Elani Beauty Hub. Premium women's fashion designed for the modern woman. Order today in Nairobi. Call 0702642324.",
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
    shortcut: "/favicon.jpg",
  },
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
  authors: [
    { name: "Elani Beauty Hub", url: "https://classycollections.com" },
    { name: "OnePlus Africa Tech Solutions", url: "http://oneplusafrica.com/" },
  ],
  creator: "Elani Beauty Hub",
  publisher: "Elani Beauty Hub",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: "Elani Beauty Hub",
    title: "Elani Beauty Hub | Premium Women's Bodysuits, Dresses & Tops in Nairobi",
    description:
      "Shop the latest women's bodysuits, dresses, tops, corsets, and jackets at Elani Beauty Hub. Premium women's fashion designed for the modern woman in Nairobi.",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 512,
        height: 512,
        alt: "Elani Beauty Hub - Premium Women's Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elani Beauty Hub | Premium Women's Fashion",
    description:
      "Shop bodysuits, dresses, tops, corsets, and more. Premium women's clothing delivered across Kenya and East Africa. Call 0702642324.",
    images: [`${siteUrl}/logo.png`],
    creator: "@_classycollections",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  other: {
    "instagram:creator": "@_classycollections",
    "tiktok:creator": "@_classycollections",
    "developer": "OnePlus Africa Tech Solutions",
    "developer-website": "http://oneplusafrica.com/",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://classycollections.com" },
                { "@type": "ListItem", position: 2, name: "Shop", item: "https://classycollections.com/shop" },
                { "@type": "ListItem", position: 3, name: "Men's Collection", item: "https://classycollections.com/shop?category=men" },
                { "@type": "ListItem", position: 4, name: "Women's Collection", item: "https://classycollections.com/shop?category=women" },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Elani Beauty Hub",
              legalName: "Elani Beauty Hub Kenya",
              url: "https://classycollections.com",
              foundingDate: "2025",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                telephone: "+254702642324",
                email: "info@classycollections.com",
                url: "https://wa.me/254702642324",
              },
              location: {
                "@type": "Place",
                name: "Elani Beauty Hub",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Nairobi",
                  addressRegion: "Nairobi",
                  addressCountry: "KE",
                },
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Elani Beauty Hub",
              description: "Premium women's fashion — bodysuits, dresses, tops, corsets, jackets and more. Quality women's clothing delivered across Kenya and East Africa.",
              url: "https://classycollections.com",
              telephone: "+254702642324",
              email: "info@classycollections.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nairobi",
                addressRegion: "Nairobi",
                addressCountry: "KE",
              },
              sameAs: [
                "https://www.instagram.com/_classycollections/",
                "https://www.tiktok.com/@_classycollections",
              ],
              priceRange: "KES 3,500 - KES 15,000",
              image: "https://classycollections.com/logo.png",
              brand: {
                "@type": "Brand",
                name: "Elani Beauty Hub",
              },
              paymentAccepted: "M-PESA, Card, Cash on Delivery",
              currenciesAccepted: "KES",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Elani Beauty Hub",
              url: "https://classycollections.com",
              description: "Premium women's fashion — bodysuits, dresses, tops, corsets, and jackets delivered across Kenya and East Africa.",
              publisher: {
                "@type": "Organization",
                name: "Elani Beauty Hub",
                logo: {
                  "@type": "ImageObject",
                  url: "https://classycollections.com/logo.png",
                },
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://classycollections.com/shop?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Elani Beauty Hub Site Pages",
              itemListElement: [
                { "@type": "SiteNavigationElement", position: 1, name: "Home", url: "https://classycollections.com" },
                { "@type": "SiteNavigationElement", position: 2, name: "Shop All", url: "https://classycollections.com/shop" },
                { "@type": "SiteNavigationElement", position: 3, name: "Men's Collection", url: "https://classycollections.com/shop?category=men" },
                { "@type": "SiteNavigationElement", position: 4, name: "Women's Collection", url: "https://classycollections.com/shop?category=women" },
                { "@type": "SiteNavigationElement", position: 5, name: "New Arrivals", url: "https://classycollections.com/shop?filter=new" },
                { "@type": "SiteNavigationElement", position: 6, name: "Track My Order", url: "https://classycollections.com/track-order" },
                { "@type": "SiteNavigationElement", position: 7, name: "Wishlist", url: "https://classycollections.com/wishlist" },
                { "@type": "SiteNavigationElement", position: 8, name: "Privacy Policy", url: "https://classycollections.com/privacy-policy" },
                { "@type": "SiteNavigationElement", position: 9, name: "Terms of Service", url: "https://classycollections.com/terms-of-service" },
                { "@type": "SiteNavigationElement", position: 10, name: "Refund Policy", url: "https://classycollections.com/refund-policy" },
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <WishlistProvider><CartProvider>{children}</CartProvider></WishlistProvider>
        <PageViewTracker />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
