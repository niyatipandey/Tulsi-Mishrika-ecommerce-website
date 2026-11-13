
import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { CartDrawer } from '../components/cart'
import ToastViewport from '../components/common/Toast'
import ScrollToTop from '../components/common/ScrollToTop'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ToastViewport />
    </div>
  )
}
