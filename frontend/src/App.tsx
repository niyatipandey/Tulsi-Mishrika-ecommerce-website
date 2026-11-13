import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { useCartStore } from './store/cartStore'

import AppRoutes from './routes/AppRoutes'

function App() {
  const initializeAuth = useAuthStore((state) => state.initialize)
  const initializeCart = useCartStore((state) => state.initialize)
  const userId = useAuthStore((state) => state.user?.id)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    initializeCart()
  }, [userId, initializeCart])

  return (
  <>
    <AppRoutes />
  </>
)
}

export default App

