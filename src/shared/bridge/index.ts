// Типизация глобального объекта window.WebApp от MAX Bridge
export interface MaxWebApp {
  ready: () => void
  close: () => void
  openLink: (url: string) => void
  openMaxLink: (url: string) => void
  shareContent: (text: string, link?: string) => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
  onEvent: (eventName: string, callback: (...args: unknown[]) => void) => void
  offEvent: (eventName: string, callback: (...args: unknown[]) => void) => void
  BackButton: {
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  initDataUnsafe?: {
    user?: {
      id: number
      name?: string
      username?: string
    }
    chat?: unknown
  }
  version?: string
}

declare global {
  interface Window {
    WebApp?: MaxWebApp
  }
}

// В dev-режиме подставляем mock если реального WebApp нет (т.е. открыли в браузере)
if (import.meta.env.DEV && !window.WebApp) {
  const { createMockWebApp } = await import('./mock')
  window.WebApp = createMockWebApp()
  console.info(
    '%c[MAX Bridge] DEV MODE — window.WebApp заменён mock-объектом',
    'background:#1a73e8;color:#fff;padding:2px 6px;border-radius:3px',
  )
}

// Возвращает WebApp если доступен (внутри MAX или mock в dev), иначе null
export const getWebApp = (): MaxWebApp | null => window.WebApp ?? null

// Сигналим MAX, что приложение готово к отображению
export const notifyReady = (): void => {
  window.WebApp?.ready()
}
