import type { MaxWebApp } from './index'

// Fake user — редактируй как хочешь для разных сценариев
const MOCK_USER = {
  id: 123456789,
  name: 'Dev User',
  username: 'devuser',
}

const log = (method: string, ...args: unknown[]) => {
  console.info(`[MAX Bridge mock] ${method}`, ...args)
}

// BackButton рендерит overlay-кнопку поверх приложения в dev-режиме
const createMockBackButton = () => {
  let visible = false
  let handlers: Array<() => void> = []

  const btn = document.createElement('button')
  btn.textContent = '← Назад (mock)'
  Object.assign(btn.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    zIndex: '9999',
    padding: '8px 16px',
    background: 'rgba(0,0,0,0.85)',
    color: '#fff',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'none',
  })
  document.body.appendChild(btn)
  btn.addEventListener('click', () => handlers.forEach(fn => fn()))

  return {
    show() {
      log('BackButton.show')
      visible = true
      btn.style.display = 'block'
    },
    hide() {
      log('BackButton.hide')
      visible = false
      btn.style.display = 'none'
    },
    onClick(callback: () => void) {
      log('BackButton.onClick — handler registered')
      handlers.push(callback)
    },
    offClick(callback: () => void) {
      log('BackButton.offClick')
      handlers = handlers.filter(fn => fn !== callback)
    },
    get isVisible() {
      return visible
    },
  }
}

export const createMockWebApp = (): MaxWebApp => ({
  ready() {
    log('ready — splash hidden (mock)')
  },
  close() {
    log('close — would close mini-app')
    // В браузере просто показываем сообщение
    console.warn('[MAX Bridge mock] close() called — in MAX this closes the mini-app')
  },
  openLink(url) {
    log('openLink', url)
    window.open(url, '_blank')
  },
  openMaxLink(url) {
    log('openMaxLink', url)
    console.info('[MAX Bridge mock] openMaxLink — would open in MAX client:', url)
  },
  shareContent(text, link) {
    log('shareContent', { text, link })
    console.info('[MAX Bridge mock] shareContent — would open native share sheet')
  },
  enableClosingConfirmation() {
    log('enableClosingConfirmation')
  },
  disableClosingConfirmation() {
    log('disableClosingConfirmation')
  },
  onEvent(eventName, callback) {
    log('onEvent', eventName)
    // Можно подписываться на кастомные события через window для теста
    window.addEventListener(`max:${eventName}`, () => callback())
  },
  offEvent(eventName, callback) {
    log('offEvent', eventName)
    window.removeEventListener(`max:${eventName}`, () => callback())
  },
  BackButton: createMockBackButton(),
  initDataUnsafe: {
    user: MOCK_USER,
  },
  version: 'mock-1.0.0',
})
