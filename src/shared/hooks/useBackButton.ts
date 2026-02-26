import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWebApp } from '@shared/bridge'

export const useBackButton = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const webApp = getWebApp()
    webApp?.BackButton.show()
    const handler = () => navigate(-1)
    webApp?.BackButton.onClick(handler)
    return () => {
      webApp?.BackButton.hide()
      webApp?.BackButton.offClick(handler)
    }
  }, [navigate])
}
