
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import AdminRoute from '../components/auth/AdminRoute'

// Admin page
import AdminLayout from '../components/layout/AdminLayout'
import Dashboard from '../pages/Admin/Dashboard'
import Orders from '../pages/Admin/Orders'
import Customers from '../pages/Admin/Customers'
import Products from '../pages/Admin/Products'
import Inventory from '../pages/Admin/Inventory'
import Reports from '../pages/Admin/Reports'
import Settings from '../pages/Admin/Settings'

// Customer pages
import Home from '../pages/Home/Home'
import Shop from '../pages/Shop/Shop'
import ProductDetail from '../pages/ProductDetail/ProductDetail'
import Cart from '../pages/Cart/Cart'
import Checkout from '../pages/Checkout/Checkout'
import OrderConfirmation from '../pages/OrderConfirmation/OrderConfirmation'
import Login from '../pages/Auth/Login'
import Account from '../pages/Account/Account'
import About from '../pages/About/About'
import Story from '../pages/Story/Story'
import Contact from '../pages/Contact/Contact'
import NotFound from '../pages/NotFound/NotFound'
import ReturnsPolicy from '../footerPages/ReturnsPolicy'
import PrivacyPolicy from '../footerPages/PrivacyPolicy'
import TermsConditions from '../footerPages/TermsConditions'

const router = createBrowserRouter([
  // Admin routes (shared admin sidebar)
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'orders', element: <Orders /> },
      { path: 'customers', element: <Customers /> },
      { path: 'products', element: <Products /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> },
    ],
  },

  // Customer website routes
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'shop/:slug', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      {
        path: 'order-confirmation/:orderId',
        element: (
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        ),
      },
      { path: 'login', element: <Login /> },
      {
        path: 'account',
        element: (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        ),
      },
      { path: 'about', element: <About /> },
      { path: 'story', element: <Story /> },
      { path: 'contact', element: <Contact /> },
      { path: 'returns', element: <ReturnsPolicy /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <TermsConditions /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
