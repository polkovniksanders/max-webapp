// Типизация глобального объекта window.WebApp от MAX Bridge
// Поля получены из исходника https://st.max.ru/js/max-web-app.js

export interface MaxUser {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
}

export interface MaxChat {
  id: number | string
  type?: string
}

export interface MaxInitDataUnsafe {
  user?: MaxUser
  chat?: MaxChat
  hash?: string
  ip?: string
  query_id?: string
  start_param?: string
  auth_date?: number
}

export interface MaxWebApp {
  // Жизненный цикл
  ready: () => void
  close: () => void

  // Навигация и ссылки
  openLink: (url: string) => void
  openMaxLink: (url: string) => void

  // Шаринг
  shareContent: (text: string, link?: string) => void

  // Поведение
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
  enableVerticalSwipes: () => void
  disableVerticalSwipes: () => void

  // Контакт
  requestContact: () => Promise<unknown>

  // События
  onEvent: (eventName: string, callback: (...args: unknown[]) => void) => void
  offEvent: (eventName: string, callback: (...args: unknown[]) => void) => void

  // BackButton
  BackButton: {
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    isVisible?: boolean
  }

  // Данные инициализации
  initData?: string               // raw URL-encoded init data string
  initDataUnsafe?: MaxInitDataUnsafe

  // Платформа и версия
  platform?: string | null
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
