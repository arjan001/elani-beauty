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
    default: "Classy Collections | Premium Ankara Suits, Dresses & Kimonos in Nairobi",
    template: "%s | Classy Collections",
  },
  description:
    "Discover vibrant, ready-made Ankara fashion at Classy Collections. Shop Ankara suits, kimono sets, palazzo pants, and dresses. Premium African prints delivered in Nairobi. Call 0702642324.",
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
    shortcut: "/favicon.jpg",
  },
  keywords: [
    // 70 Core SEO Tags
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
  authors: [
    { name: "Classy Collections", url: "https://classycollections.com" },
    { name: "OnePlus Africa Tech Solutions", url: "http://oneplusafrica.com/" },
  ],
  creator: "Classy Collections",
  publisher: "Classy Collections",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: "Classy Collections",
    title: "Classy Collections | Premium Ankara Suits, Dresses & Kimonos in Nairobi",
    description:
      "Discover vibrant, ready-made Ankara fashion at Classy Collections. Shop Ankara suits, kimono sets, palazzo pants, and dresses. Premium African prints delivered in Nairobi.",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 512,
        height: 512,
        alt: "Classy Collections - Premium African Ankara Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Classy Collections | Premium Ankara Fashion",
    description:
      "Shop Ankara suits, dresses, kimonos, and more. Premium African print clothing delivered across Kenya and East Africa. Call 0702642324.",
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
              name: "Classy Collections",
              legalName: "Classy Collections Kenya",
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
                name: "Classy Collections",
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
              name: "Classy Collections",
              description: "Premium authentic African Ankara fashion. Men's suits, women's dresses, kimonos, palazzo, and more. Quality African print clothing delivered across Kenya and East Africa.",
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
                name: "Classy Collections",
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
              name: "Classy Collections",
              url: "https://classycollections.com",
              description: "Premium authentic African Ankara fashion. Ready-made suits, elegant dresses, kimonos, and more delivered across Kenya and East Africa.",
              publisher: {
                "@type": "Organization",
                name: "Classy Collections",
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
              name: "Classy Collections Site Pages",
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
