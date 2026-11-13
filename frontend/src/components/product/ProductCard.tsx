import { type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { type Product } from '@/lib/supabase'
import { Card, Button } from '@/components/common'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/formatting'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { openCartDrawer, addToast } = useUIStore()
  const isOutOfStock = product.stock_quantity !== null && product.stock_quantity === 0

  const handleAdd = async (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (isOutOfStock) return

    try {
      await addItem(product, 1)
      addToast('success', `${product.name} added to cart`)
      openCartDrawer()
    } catch {
      addToast('error', 'Could not sync cart. Your last change was reversed.')
    }
  }

  return (
    <Card hover className="h-full overflow-hidden !p-0 flex flex-col">
      <Link to={`/shop/${product.slug}`} className="block group flex-1 cursor-pointer">
        <div className="aspect-square bg-brand-beige overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-brown-300">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-[#292D08] mb-1 group-hover:text-brand-gold-600 transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-brand-brown-600 line-clamp-2 mb-3">{product.description}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#292D08]">{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-brand-brown-300 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            {product.weight ? (
              <span className="text-sm text-brand-brown-600 font-medium">{product.weight}g</span>
            ) : null}
          </div>

          {product.stock_quantity !== null && product.stock_quantity <= 10 && (
            <div className="mt-2">
              {product.stock_quantity === 0 ? (
                <span className="text-xs text-red-600 font-medium">Out of Stock</span>
              ) : (
                <span className="text-xs text-orange-600 font-medium">
                  Only {product.stock_quantity} left!
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          disabled={isOutOfStock}
          onClick={handleAdd}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Card>
  )
}
