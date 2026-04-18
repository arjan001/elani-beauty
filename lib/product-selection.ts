import type { Product } from "@/lib/types"

export function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function pickCategoryMix(
  products: readonly Product[],
  categorySlug: string,
  prefer: (p: Product) => boolean,
  count: number,
): Product[] {
  const inCategory = products.filter((p) => p.categorySlug === categorySlug)
  const preferred = shuffle(inCategory.filter(prefer)).slice(0, count)
  if (preferred.length >= count) return preferred
  const usedIds = new Set(preferred.map((p) => p.id))
  const fill = shuffle(inCategory.filter((p) => !usedIds.has(p.id))).slice(
    0,
    count - preferred.length,
  )
  return [...preferred, ...fill]
}
