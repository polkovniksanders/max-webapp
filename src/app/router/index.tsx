import { Routes, Route } from 'react-router-dom'
import { MainPage } from '@pages/main'
import { ProfilePage } from '@pages/profile'
import { ROUTES } from '@shared/config/routes'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.MAIN} element={<MainPage />} />
      <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
    </Routes>
  )
}
