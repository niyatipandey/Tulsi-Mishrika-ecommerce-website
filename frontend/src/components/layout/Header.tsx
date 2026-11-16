import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { useUIStore } from '../../store/uiStore'
import "../layout/app.css";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  
  const { user, signOut } = useAuthStore()
  const isAuthenticated = !!user
  const openCartDrawer = useUIStore((state) => state.openCartDrawer)

  const items = useCartStore((state) => state.items)
  const initialize = useCartStore((state) => state.initialize)
  const initialized = useCartStore((state) => state.initialized)

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  )
  console.log('HEADER CART COUNT:', itemCount, items)

  // Initialize cart on mount
  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/account')
    } else {
      navigate('/login')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-brand-brown-200 sticky top-0 z-40">
      {/* Top banner */}
      <div className="bg-brown-dark text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          <span className="font-medium">Pure • Traditional • Healthy</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-hindi font-bold text-[#292D08] leading-tight">
                MADHU वन
              </h1>
              <p className="text-xs text-brand-brown-600 tracking-wide">
                मिश्री की शुद्ध पहचान
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="h-20 flex items-center border-b-* border-stone-200 space-x-10">
            <Link
              to="/"
              className = "nav-link text-brand-brown-700 hover:text-[#292D08] font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="nav-link text-brand-brown-700 hover:text-[#292D08] font-medium"
            >
              About Us
            </Link>
            <Link
              to="/story"
              className="nav-link text-brand-brown-700 hover:text-[#292D08] font-medium"
            >
              Our Story
            </Link>
            <Link
              to="/shop"
              className="nav-link text-brand-brown-700 hover:text-[#292D08] font-medium"
            >
              Shop
            </Link>
            <Link
              to="/contact"
              className="nav-link text-brand-brown-700 hover:text-[#292D08] font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Search icon (optional) */}
            <button
              className="hidden md:block p-2 hover:bg-brand-brown-100 rounded-full transition-colors cursor-pointer"
              title="Search"
            >
              <svg
                className="w-6 h-6 text-brand-brown-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* User/Account icon */}
            <div className="relative">
              <button
                onClick={handleAuthClick}
                className="p-2 hover:bg-brand-brown-100 rounded-full transition-colors cursor-pointer"
                title={isAuthenticated ? 'Account' : 'Login'}
              >
                <svg
                  className="w-6 h-6 text-brand-brown-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
              
              {/* Show email indicator when logged in */}
              {isAuthenticated && user?.email && (
                <div className="absolute top-full right-0 mt-2 py-1 px-3 bg-white border border-brand-brown-200 rounded-lg shadow-lg hidden md:block whitespace-nowrap text-xs">
                  {user.email}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={openCartDrawer}
              className="p-2 hover:bg-brand-brown-100 rounded-full transition-colors relative cursor-pointer"
              title="Shopping Cart"
              aria-label={`Shopping cart, ${itemCount} items`}
            >
              <svg
                className="w-6 h-6 text-brand-brown-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span
                  key={itemCount}
                  className="absolute -top-1 -right-1 bg-brand-gold-500 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center animate-badgePop"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-brand-brown-100 rounded-full transition-colors "
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-brand-brown-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-brand-brown-200 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-brand-brown-800 hover:text-[#292D08] font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-brand-brown-800 hover:text-[#292D08] font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/story"
                className="text-brand-brown-800 hover:text-[#292D08] font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Story
              </Link>
              <Link
                to="/shop"
                className="text-brand-brown-800 hover:text-[#292D08] font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/contact"
                className="text-brand-brown-800 hover:text-[#292D08] font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Auth actions in mobile menu */}
              {isAuthenticated ? (
                <>
                  <div className="border-t pt-4 mt-2">
                    <p className="text-sm text-gray-600 mb-2">
                      {user?.email}
                    </p>
                    <Link
                      to="/account"
                      className="text-brand-brown-800 hover:text-[#292D08] font-medium transition-colors block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="text-red-600 hover:text-red-700 font-medium transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-brand-brown-800 hover:text-[#292D08] font-medium transition-colors border-t pt-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
