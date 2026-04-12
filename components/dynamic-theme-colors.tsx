"use client"

import useSWR from "swr"
import { useEffect } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function hexToHsl(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

function deriveThemeColors(primaryHex: string, secondaryHex: string) {
  const primary = hexToHsl(primaryHex)
  const secondary = hexToHsl(secondaryHex)
  if (!primary || !secondary) return null
  return { primary, secondary }
}

export function DynamicThemeColors() {
  const { data } = useSWR("/api/site-data", fetcher)

  useEffect(() => {
    const settings = data?.settings
    if (!settings) return

    const primaryHex = settings.primary_color
    const secondaryHex = settings.secondary_color || settings.accent_color

    if (!primaryHex) return

    const colors = deriveThemeColors(primaryHex, secondaryHex || "#fafafa")
    if (!colors) return

    const root = document.documentElement

    // Apply primary color to CSS variables
    root.style.setProperty("--primary", colors.primary)
    root.style.setProperty("--ring", colors.primary)
    root.style.setProperty("--sidebar-primary", colors.primary)

    // Apply secondary/accent color
    if (secondaryHex) {
      root.style.setProperty("--secondary", colors.secondary)
      root.style.setProperty("--accent", colors.secondary)
      root.style.setProperty("--sidebar-accent", colors.secondary)
    }
  }, [data])

  return null
}
