import type { ShopStyle } from '../model/apiTypes'

const injectFont = (link: string) => {
  if (document.querySelector(`link[href="${link}"]`)) return
  const el = document.createElement('link')
  el.rel = 'stylesheet'
  el.href = link
  document.head.appendChild(el)
}

export const applyShopStyle = (style: ShopStyle) => {
  const root = document.documentElement

  // Colors
  root.style.setProperty('--color-primary', style.colorPrimary.hex)
  root.style.setProperty('--color-caption', style.colorCaption.hex)
  root.style.setProperty('--color-status', style.colorStatus.hex)
  root.style.setProperty('--color-btn-secondary', style.colorButtonSecondary.hex)
  root.style.setProperty('--color-text', style.colorText.hex)
  root.style.setProperty('--color-text-secondary', style.colorTextSecondary.hex)
  root.style.setProperty('--border-color', style.borderColor.hex)
  root.style.setProperty('--border-color-secondary', style.borderColorSecondary.hex)
  root.style.setProperty('--bg-secondary', style.backgroundSecondary.hex)
  root.style.setProperty('--bg-layout', style.backgroundLayout.hex)
  root.style.setProperty('--color-success', style.colorSuccess.hex)
  root.style.setProperty('--bg-success', style.colorBackgroundSuccess.hex)
  root.style.setProperty('--bg-success-secondary', style.colorBackgroundSuccessSecondary.hex)
  root.style.setProperty('--color-error', style.colorError.hex)
  root.style.setProperty('--bg-error', style.colorBackgroundError.hex)

  // Gradients
  root.style.setProperty('--gradient-menu', style.menuColor.hex)
  root.style.setProperty('--gradient-border', style.borderGradient.hex)
  root.style.setProperty('--gradient-primary', style.primaryGradient.hex)

  // Border radius
  const r = style.borderRadius
  root.style.setProperty('--radius-zero', `${r.roundingZero}px`)
  root.style.setProperty('--radius-small', `${r.roundingSmall}px`)
  root.style.setProperty('--radius-medium', `${r.roundingMedium}px`)
  root.style.setProperty('--radius-large', `${r.roundingLarge}px`)
  root.style.setProperty('--radius-half', `${r.roundingHalf}px`)
  root.style.setProperty('--radius-full', `${r.roundingFull}px`)
  root.style.setProperty('--radius-infinite', `${r.roundingInfinite}px`)

  // Fonts
  root.style.setProperty('--font-primary', style.font.primary.family)
  root.style.setProperty('--font-secondary', style.font.secondary.family)
  injectFont(style.font.primary.link)
  injectFont(style.font.secondary.link)
}
