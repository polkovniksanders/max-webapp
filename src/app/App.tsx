import { useEffect } from 'react'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { notifyReady } from '@shared/bridge'
import { Navbar } from '@widgets/navbar'
import { AppRouter } from './router'
import './styles/index.css'

// HashRouter используется, чтобы работать с любым статик-хостингом
// без настройки server-side перенаправлений

export const App = () => {
  useEffect(() => {
    // Сообщаем MAX, что приложение готово — скрывает splash-экран
    notifyReady()
  }, [])

  return (
    <Provider store={store}>
      <HashRouter>
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <AppRouter />
        </main>
        <Navbar />
      </HashRouter>
    </Provider>
  )
}
