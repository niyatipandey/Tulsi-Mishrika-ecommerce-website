import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  long_description: string | null
  price: number
  image_url: string | null
  stock: number
  active: boolean
  created_at: string
  updated_at: string
  stock_quantity: number
  original_price?: number | null
  weight?: number | null
  is_available?: boolean
}

export function normalizeProduct(row: Record<string, unknown>): Product {
  const stock = Number(row.stock ?? row.stock_quantity ?? 0)
  const active = Boolean(row.active ?? row.is_available ?? true)

  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    slug: String(row.slug ?? ''),
    description: (row.description as string | null) ?? null,
    long_description: (row.long_description as string | null) ?? null,
    price: Number(row.price ?? 0),
    image_url: (row.image_url as string | null) ?? null,
    stock,
    active,
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
    stock_quantity: stock,
    original_price: row.original_price != null ? Number(row.original_price) : null,
    weight: row.weight != null ? Number(row.weight) : null,
    is_available: active,
  }
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product: Product
}

export interface Cart {
  id: string
  user_id: string
  session_id: string | null
  created_at: string
  updated_at: string
  cart_items: CartItem[]
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  total_amount: number
  status: string
  payment_status: string
  shipping_address: Record<string, unknown>
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
  product: Product
}

export interface Profile {
  id: string
  name: string | null
  full_name: string | null
  phone: string | null
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}
