"use client"

import Link from "next/link"
import { useMemo } from "react"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"
import { pickCategoryMix, shuffle } from "@/lib/product-selection"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function NewArrivals() {
  const { data: products = [] } = useSWR<Product[]>("/api/products", fetcher)

  const displayed = useMemo(() => {
    const dresses = pickCategoryMix(products, "dresses", (p) => !!p.isNew, 4)
    const bodySuits = pickCategoryMix(products, "body-suits", (p) => !!p.isNew, 4)
    const picked: Product[] = [...dresses, ...bodySuits]
    if (picked.length < 8) {
      const usedIds = new Set(picked.map((p) => p.id))
      const fallbackPool = products.filter((p) => !usedIds.has(p.id))
      const preferred = fallbackPool.filter((p) => p.isNew)
      const rest = fallbackPool.filter((p) => !p.isNew)
      picked.push(...shuffle(preferred).slice(0, 8 - picked.length))
      if (picked.length < 8) {
        picked.push(...shuffle(rest).slice(0, 8 - picked.length))
      }
    }
    return picked.slice(0, 8)
  }, [products])

  if (displayed.length === 0) return null

  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Just In
            </p>
            <h2 className="text-2xl lg:text-3xl font-serif font-bold">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?filter=new"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium hover:text-muted-foreground transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
