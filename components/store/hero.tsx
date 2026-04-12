"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { ArrowRight } from "lucide-react"
import type { HeroBanner } from "@/lib/types"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const ANKARA_CAROUSEL_IMAGES = [
  "/banners/hero-ankara-main.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blue-white-african-ankara-print-plus-size-clothing-party-dress-435554-4htvoFTBgJR1myaOCHvUom98ShGAQL.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/green-gold-multi-african-ankara-print-plus-size-short-party-dress-407943-Ykn226QRyD5Bp2QSLNuywdZn9IYrWR.jpeg",
]

const FALLBACK_BANNERS: HeroBanner[] = [
  {
    id: "women-dresses",
    title: "Ankara Dresses Collection",
    subtitle: "Stunning Ankara dresses for every occasion. From casual to formal, find your perfect style with our curated collection.",
    collection: "women-ankara-dresses",
    bannerImage: "/banners/hero-ankara-main.jpg",
    linkUrl: "/shop?category=women-ankara-dresses",
    buttonText: "Shop Dresses",
    sortOrder: 0,
  },
  {
    id: "ankara-party",
    title: "Ankara Party Dresses",
    subtitle: "Premium Ankara dresses for weddings, events, and celebrations. Handcrafted elegance for every occasion.",
    collection: "ankara-party",
    bannerImage: "/banners/ankara-dresses-banner.jpg",
    linkUrl: "/shop?filter=new",
    buttonText: "Explore Collection",
    sortOrder: 1,
  },
  {
    id: "ankara-new",
    title: "New Ankara Arrivals",
    subtitle: "Fresh styles added weekly. Kimonos, fitted dresses, and statement pieces for the modern African woman.",
    collection: "ankara-new",
    bannerImage: "/banners/ankara-new-arrivals-banner.jpg",
    linkUrl: "/shop?filter=new",
    buttonText: "View New In",
    sortOrder: 2,
  },
]

function AnkaraCarousel({ banner }: { banner: HeroBanner }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % ANKARA_CAROUSEL_IMAGES.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <Link
      href={banner.linkUrl}
      className="lg:col-span-8 relative overflow-hidden rounded-sm min-h-[400px] lg:min-h-[520px] flex items-end group"
    >
      <div className="absolute inset-0 z-0">
        {ANKARA_CAROUSEL_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === currentSlide ? 1 : 0 }}
          >
            <Image
              src={src}
              alt={`${banner.title} - carousel slide ${i + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority={i === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>
      <div className="relative z-10 p-8 lg:p-12 w-full">
        <p className="text-white/80 text-xs tracking-[0.3em] uppercase mb-2">African Fashion</p>
        <h1 className="text-white text-4xl lg:text-5xl font-serif font-bold leading-tight text-balance">
          {banner.title}
        </h1>
        <p className="text-white/70 text-sm mt-3 leading-relaxed max-w-md">
          {banner.subtitle}
        </p>
        <span className="inline-flex items-center gap-2 mt-5 bg-white text-black px-7 py-3 text-sm font-medium hover:bg-white/90 transition-colors">
          {banner.buttonText}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  )
}

function BannerImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setImgSrc(src)
    setHasError(false)
  }, [src])

  if (hasError) {
    return (
      <Image
        src="/banners/hero-ankara-main.jpg"
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-700"
      priority={priority}
      onError={() => {
        setHasError(true)
        setImgSrc("/banners/hero-ankara-main.jpg")
      }}
    />
  )
}

export function Hero() {
  const { data: banners } = useSWR<HeroBanner[]>("/api/hero-banners", fetcher)

  // Merge DB banners with fallbacks - always guarantee 3 valid banners
  const items: HeroBanner[] = (() => {
    if (!banners || banners.length === 0) return FALLBACK_BANNERS

    // Ensure each banner has a valid image, fallback to known images
    const validImages = [
      "/banners/hero-ankara-main.jpg",
      "/banners/ankara-dresses-banner.jpg",
      "/banners/ankara-new-arrivals-banner.jpg",
    ]

    return banners.slice(0, 3).map((b, i) => ({
      ...b,
      bannerImage: b.bannerImage && b.bannerImage.startsWith("/") ? b.bannerImage : validImages[i % validImages.length],
      linkUrl: b.linkUrl || "/shop",
      buttonText: b.buttonText || "Shop Now",
    }))
  })()

  // Pad to 3 if needed
  while (items.length < 3) {
    items.push(FALLBACK_BANNERS[items.length])
  }

  const mainBanner = items[0]
  const sideBanners = items.slice(1, 3)

  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
          {/* Main Banner with Carousel */}
          <AnkaraCarousel banner={mainBanner} />

          {/* Side Banners */}
          <div className="lg:col-span-4 flex flex-col gap-4 lg:gap-6">
            {sideBanners.map((banner) => (
              <Link
                key={banner.id}
                href={banner.linkUrl}
                className="relative overflow-hidden rounded-sm flex-1 min-h-[200px] lg:min-h-0 group flex items-end"
              >
                <BannerImage
                  src={banner.bannerImage}
                  alt={banner.title}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="relative z-10 p-5 w-full">
                  <h3 className="text-white font-serif text-lg font-semibold leading-snug">
                    {banner.title}
                  </h3>
                  <p className="text-white/70 text-xs mt-1 line-clamp-2">
                    {banner.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-3 text-white text-xs font-medium tracking-wide uppercase group-hover:underline">
                    {banner.buttonText}
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
