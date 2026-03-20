import type { ShopStyle, ShopStyleGradient } from '../model/apiTypes'

const injectFont = (link: string) => {
  if (!link) return
  if (document.querySelector(`link[href="${link}"]`)) return
  const el = document.createElement('link')
  el.rel = 'stylesheet'
  el.href = link
  document.head.appendChild(el)
}

/**
 * Builds a CSS gradient string from a ShopStyleGradient.
 * Falls back to the solid `hex` value when primary and secondary are identical.
 */
const buildGradient = (color: ShopStyleGradient): string => {
  if (
    color.hexPrimary &&
    color.hexSecondary &&
    color.hexPrimary !== color.hexSecondary
  ) {
    return `linear-gradient(135deg, ${color.hexPrimary}, ${color.hexSecondary})`
  }
  return color.hex || color.hexPrimary || color.hexSecondary
}

/**
 * Applies all shop theme variables to :root as CSS custom properties.
 *
 * Called once before first render (main.tsx bootstrap) and again via
 * useShopStyle as a fallback. Both calls are idempotent.
 *
 * Variable naming convention:
 *   --color-*         solid accent colours
 *   --bg-*            background fills
 *   --border-*        border colours
 *   --gradient-*      gradient backgrounds (linear-gradient or solid hex)
 *   --menu-*          bottom navbar specific
 *   --radius-*        border-radius tokens
 *   --font-*          font families
 */
export const applyShopStyle = (style: ShopStyle) => {
  const root = document.documentElement

  // ── Solid colours ────────────────────────────────────────────────
  root.style.setProperty('--color-primary', style.colorPrimary.hex)
  root.style.setProperty('--color-caption', style.colorCaption.hex)
  root.style.setProperty('--color-status', style.colorStatus.hex)
  root.style.setProperty('--color-btn-secondary', style.colorButtonSecondary.hex)
  root.style.setProperty('--color-text', style.colorText.hex)
  root.style.setProperty('--color-text-secondary', style.colorTextSecondary.hex)
  root.style.setProperty('--color-success', style.colorSuccess.hex)
  root.style.setProperty('--color-error', style.colorError.hex)

  // ── Backgrounds ──────────────────────────────────────────────────
  root.style.setProperty('--bg-layout', style.backgroundLayout.hex)
  root.style.setProperty('--bg-secondary', style.backgroundSecondary.hex)
  root.style.setProperty('--bg-color-secondary', style.colorBackgroundSecondary.hex)
  root.style.setProperty('--bg-success', style.colorBackgroundSuccess.hex)
  root.style.setProperty('--bg-success-secondary', style.colorBackgroundSuccessSecondary.hex)
  root.style.setProperty('--bg-error', style.colorBackgroundError.hex)

  // ── Borders ──────────────────────────────────────────────────────
  root.style.setProperty('--border-color', style.borderColor.hex)
  root.style.setProperty('--border-color-secondary', style.borderColorSecondary.hex)

  // ── Gradients ────────────────────────────────────────────────────
  // menuColor → bottom navbar background
  root.style.setProperty('--menu-color', style.menuColor.hex)
  root.style.setProperty('--gradient-menu', buildGradient(style.menuColor))

  // borderGradient → secondary button / border gradient
  root.style.setProperty('--gradient-border', buildGradient(style.borderGradient))

  // primaryGradient → primary CTA buttons
  root.style.setProperty('--gradient-primary', buildGradient(style.primaryGradient))

  // ── Border radius ─────────────────────────────────────────────────
  const r = style.borderRadius
  root.style.setProperty('--radius-zero', `${r.roundingZero}px`)
  root.style.setProperty('--radius-small', `${r.roundingSmall}px`)
  root.style.setProperty('--radius-medium', `${r.roundingMedium}px`)
  root.style.setProperty('--radius-large', `${r.roundingLarge}px`)
  root.style.setProperty('--radius-half', `${r.roundingHalf}px`)
  root.style.setProperty('--radius-full', `${r.roundingFull}px`)
  root.style.setProperty('--radius-infinite', `${r.roundingInfinite}px`)

  // ── Fonts ─────────────────────────────────────────────────────────
  if (style.font?.primary?.family) {
    root.style.setProperty('--font-primary', style.font.primary.family)
    injectFont(style.font.primary.link)
  }
  if (style.font?.secondary?.family) {
    root.style.setProperty('--font-secondary', style.font.secondary.family)
    injectFont(style.font.secondary.link)
  }
}
