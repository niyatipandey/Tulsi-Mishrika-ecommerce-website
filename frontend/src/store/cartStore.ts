import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { normalizeProduct, supabase, type Product } from '@/lib/supabase'
import { useAuthStore } from './authStore'

export interface CartItem {
  id: string
  product_id: string
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  loading: boolean
  initialized: boolean
  syncing: boolean

  initialize: () => Promise<void>
  addItem: (product: Product, quantity: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clearCart: () => Promise<void>

  getTotalItems: () => number
  getTotalPrice: () => number
  getItem: (productId: string) => CartItem | undefined
}

async function getOrCreateCartId(userId: string): Promise<string> {
  const existing = await supabase.from('carts').select('id').eq('user_id', userId).maybeSingle()
  if (existing.error) throw existing.error
  if (existing.data?.id) return existing.data.id as string

  const created = await supabase.from('carts').insert({ user_id: userId }).select('id').single()
  if (created.error) throw created.error
  return created.data.id as string
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      initialized: false,
      syncing: false,

      initialize: async () => {
        if (get().initialized || get().loading) return
        const { user } = useAuthStore.getState()

        if (!user) {
          set({ initialized: true, loading: false })
          return
        }

        try {
          set({ loading: true })
          const cartId = await getOrCreateCartId(user.id)

          const { data: cartItems, error } = await supabase
            .from('cart_items')
            .select(`
              id,
              product_id,
              quantity,
              products (*)
            `)
            .eq('cart_id', cartId)

          if (error) throw error

          const formattedItems: CartItem[] = (cartItems ?? [])
            .filter((item) => item.products)
            .map((item) => ({
              id: item.id as string,
              product_id: item.product_id as string,
              product: normalizeProduct(item.products as unknown as Record<string, unknown>),
              quantity: Number(item.quantity),
            }))

          set({ items: formattedItems, initialized: true, loading: false })
        } catch (error) {
          console.error('Error initializing cart:', error)
          set({ initialized: true, loading: false })
        }
      },

      addItem: async (product, quantity) => {
        const { user } = useAuthStore.getState()
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.product_id === product.id)

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity
          set({
            items: currentItems.map((item) =>
              item.product_id === product.id ? { ...item, quantity: newQuantity } : item
            ),
          })
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: crypto.randomUUID(),
                product_id: product.id,
                product,
                quantity,
              },
            ],
          })
        }

        if (!user) return

        set({ syncing: true })
        try {
          const cartId = await getOrCreateCartId(user.id)

          if (existingItem) {
            const { error } = await supabase
              .from('cart_items')
              .update({ quantity: existingItem.quantity + quantity })
              .eq('id', existingItem.id)
            if (error) throw error
          } else {
            const { data: newCartItem, error } = await supabase
              .from('cart_items')
              .insert({
                cart_id: cartId,
                product_id: product.id,
                quantity,
              })
              .select('id')
              .single()

            if (error) throw error

            if (newCartItem) {
              set({
                items: get().items.map((item) =>
                  item.product_id === product.id ? { ...item, id: newCartItem.id as string } : item
                ),
              })
            }
          }
        } catch (error) {
          console.error('Error syncing cart to Supabase:', error)
          set({ items: currentItems })
          throw error
        } finally {
          set({ syncing: false })
        }
      },

      updateQuantity: async (productId, quantity) => {
        const { user } = useAuthStore.getState()
        const currentItems = get().items
        const item = currentItems.find((entry) => entry.product_id === productId)

        if (!item) return

        if (quantity <= 0) {
          await get().removeItem(productId)
          return
        }

        const oldQuantity = item.quantity
        set({
          items: currentItems.map((entry) =>
            entry.product_id === productId ? { ...entry, quantity } : entry
          ),
        })

        if (!user) return

        set({ syncing: true })
        try {
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', item.id)
          if (error) throw error
        } catch (error) {
          console.error('Error updating cart item:', error)
          set({
            items: currentItems.map((entry) =>
              entry.product_id === productId ? { ...entry, quantity: oldQuantity } : entry
            ),
          })
          throw error
        } finally {
          set({ syncing: false })
        }
      },

      removeItem: async (productId) => {
        const { user } = useAuthStore.getState()
        const currentItems = get().items
        const item = currentItems.find((entry) => entry.product_id === productId)

        if (!item) return

        set({ items: currentItems.filter((entry) => entry.product_id !== productId) })

        if (!user) return

        set({ syncing: true })
        try {
          const { error } = await supabase.from('cart_items').delete().eq('id', item.id)
          if (error) throw error
        } catch (error) {
          console.error('Error removing cart item:', error)
          set({ items: currentItems })
          throw error
        } finally {
          set({ syncing: false })
        }
      },

      clearCart: async () => {
        const { user } = useAuthStore.getState()
        const currentItems = get().items

        set({ items: [] })

        if (!user) return

        set({ syncing: true })
        try {
          const { data: cart, error: cartError } = await supabase
            .from('carts')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle()
          if (cartError) throw cartError

          if (cart) {
            const { error } = await supabase.from('cart_items').delete().eq('cart_id', cart.id)
            if (error) throw error
          }
        } catch (error) {
          console.error('Error clearing cart:', error)
          set({ items: currentItems })
          throw error
        } finally {
          set({ syncing: false })
        }
      },

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),

      getItem: (productId) => get().items.find((item) => item.product_id === productId),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
)
