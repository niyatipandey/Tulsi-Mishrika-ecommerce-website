import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/common'
import { CartItem } from './CartItem'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/formatting'

export function CartDrawer() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { cartDrawerOpen, closeCartDrawer, addToast } = useUIStore()
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const syncing = useCartStore((state) => state.syncing)

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 50
  const total = subtotal + shipping

  useEffect(() => {
    if (!cartDrawerOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCartDrawer()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [cartDrawerOpen, closeCartDrawer])

  const handleQuantity = async (productId: string, quantity: number) => {
    try {
      await updateQuantity(productId, quantity)
    } catch {
      addToast('error', 'Could not update quantity. Your cart was restored.')
    }
  }

  const handleRemove = async (productId: string) => {
    try {
      await removeItem(productId)
      addToast('info', 'Item removed')
    } catch {
      addToast('error', 'Could not remove item. Your cart was restored.')
    }
  }

  const handleCheckout = () => {
    closeCartDrawer()
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    navigate('/checkout')
  }

  return (
    <div
      className={`fixed inset-0 z-[70] ${cartDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!cartDrawerOpen}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          cartDrawerOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCartDrawer}
        aria-label="Close cart"
      />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          cartDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-brown-200">
          <div>
            <h2 className="text-xl font-heading font-semibold text-[#292D08]">Your Cart</h2>
            <p className="text-xs text-brand-brown-600">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
              {syncing ? ' • syncing…' : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCartDrawer}
            className="p-2 rounded-full hover:bg-brand-beige transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-heading text-lg text-[#292D08] mb-2">Your cart is empty</p>
              <p className="text-sm text-brand-brown-600 mb-6">Add Kunj Mishri or Baal Mishri to get started.</p>
              <Button
                variant="primary"
                onClick={() => {
                  closeCartDrawer()
                  navigate('/shop')
                }}
              >
                Browse Products
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                compact
                onUpdateQuantity={handleQuantity}
                onRemove={handleRemove}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-brand-brown-200 p-5 bg-brand-cream">
            {subtotal < 500 && (
              <p className="text-xs text-brand-brown-600 mb-3">
                Add {formatPrice(500 - subtotal)} more for free shipping
              </p>
            )}
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-emerald-700 font-medium' : ''}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Button variant="primary" size="lg" className="w-full mb-2" onClick={handleCheckout}>
              Checkout
            </Button>
            <Link
              to="/cart"
              onClick={closeCartDrawer}
              className="block text-center text-sm font-medium text-brand-brown-800 hover:text-brand-gold-600"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}
