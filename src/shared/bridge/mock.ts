import type { MaxWebApp } from './index'

// Fake user — редактируй для разных сценариев
const MOCK_USER = {
  id: 123456789,
  first_name: 'Dev',
  last_name: 'User',
  username: 'devuser',
  language_code: 'ru',
  photo_url: undefined as string | undefined,
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

// Имитируем raw initData строку (как она приходит от MAX)
const MOCK_INIT_DATA = [
  `user=${encodeURIComponent(JSON.stringify({ ...MOCK_USER }))}`,
  `auth_date=${Math.floor(Date.now() / 1000)}`,
  `query_id=AAHdF6IQAAAAAN0XohDhrOrc`,
  `ip=192.168.1.1`,
  `hash=mock_hash_value_for_dev`,
].join('&')

export const createMockWebApp = (): MaxWebApp => ({
  ready() {
    log('ready — splash hidden (mock)')
  },
  close() {
    log('close — would close mini-app')
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
  enableVerticalSwipes() {
    log('enableVerticalSwipes')
  },
  disableVerticalSwipes() {
    log('disableVerticalSwipes')
  },
  requestContact() {
    log('requestContact')
    return Promise.resolve({ phone_number: '+7 900 000-00-00' })
  },
  onEvent(eventName, callback) {
    log('onEvent', eventName)
    window.addEventListener(`max:${eventName}`, () => callback())
  },
  offEvent(eventName, callback) {
    log('offEvent', eventName)
    window.removeEventListener(`max:${eventName}`, () => callback())
  },
  BackButton: createMockBackButton(),
  initData: MOCK_INIT_DATA,
  initDataUnsafe: {
    user: MOCK_USER,
    hash: 'mock_hash_value_for_dev',
    ip: '192.168.1.1',
    query_id: 'AAHdF6IQAAAAAN0XohDhrOrc',
    auth_date: Math.floor(Date.now() / 1000),
  },
  platform: 'mock-web',
  version: 'mock-1.0.0',
})
