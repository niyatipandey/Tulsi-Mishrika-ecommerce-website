import { Link } from 'react-router-dom'
import { Button } from '@/components/common'
import { type CartItem as CartItemType } from '@/store/cartStore'
import { formatPrice } from '@/utils/formatting'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  disabled?: boolean
  compact?: boolean
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  disabled = false,
  compact = false,
}: CartItemProps) {
  const { product, quantity } = item
  const subtotal = product.price * quantity
  const isOutOfStock = product.stock_quantity !== null && product.stock_quantity === 0
  const maxQuantity = product.stock_quantity || 99

  return (
    <div
      className={`flex gap-3 border-b border-brand-brown-200 last:border-b-0 animate-fadeIn ${
        compact ? 'py-3' : 'gap-4 py-6'
      }`}
    >
      <Link
        to={`/shop/${product.slug}`}
        className={`flex-shrink-0 bg-brand-beige rounded-lg overflow-hidden group ${
          compact ? 'w-16 h-16' : 'w-24 h-24 sm:w-32 sm:h-32'
        }`}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-brown-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/shop/${product.slug}`}
              className={`font-semibold text-[#292D08] hover:text-brand-gold-600 transition-colors block truncate ${
                compact ? 'text-sm' : 'text-lg'
              }`}
            >
              {product.name}
            </Link>
            <p className="text-xs text-brand-brown-600 mt-0.5">
              {product.weight ? `${product.weight}g • ` : ''}
              {formatPrice(product.price)} each
            </p>
            {isOutOfStock && <p className="text-xs text-red-600 font-medium mt-1">Out of Stock</p>}
          </div>
          {!compact && (
            <p className="hidden sm:block text-xl font-bold text-[#292D08]">
              {formatPrice(subtotal)}
            </p>
          )}
        </div>

        <div className={`flex flex-wrap items-center gap-2 ${compact ? 'mt-2' : 'mt-3 gap-3'}`}>
          <div className="flex items-center border border-brand-brown-300 rounded-full overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              disabled={disabled}
              className="px-3 py-1 text-[#292D08] hover:bg-brand-beige transition-colors disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              {quantity <= 1 ? '×' : '−'}
            </button>
            <span className="px-3 py-1 font-semibold text-[#292D08] min-w-[2rem] text-center text-sm">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              disabled={disabled || quantity >= maxQuantity}
              className="px-3 py-1 text-brand-gold-600 font-bold hover:bg-brand-beige transition-colors disabled:opacity-50"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {!compact && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(product.id)}
              disabled={disabled}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              Remove
            </Button>
          )}

          <p className={`ml-auto font-bold text-[#292D08] ${compact ? 'text-sm' : 'text-lg sm:hidden'}`}>
            {formatPrice(subtotal)}
          </p>
        </div>
      </div>
    </div>
  )
}
