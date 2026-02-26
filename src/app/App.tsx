import { useEffect } from 'react'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { notifyReady } from '@shared/bridge'
import { useShopStyle } from '@entities/shop'
import { Navbar } from '@widgets/navbar'
import { AppRouter } from './router'
import './styles/index.css'

const AppContent = () => {
  useShopStyle()

  return (
    <>
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <AppRouter />
      </main>
      <Navbar />
    </>
  )
}

export const App = () => {
  useEffect(() => {
    notifyReady()
  }, [])

  return (
    <Provider store={store}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </Provider>
  )
}
