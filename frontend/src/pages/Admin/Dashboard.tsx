
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface RecentOrder {
  id: string
  order_number: string
  total_amount: number
  status: string
  user_id: string
  shipping_address: Record<string, unknown> | null
  created_at: string
  customer_name: string
}

interface DashboardStats {
  totalSales: number
  totalOrders: number
  customers: number
  products: number
}

const menuItems = [
  { label: 'Overview', icon: '▦', path: '/admin' },
  { label: 'Orders', icon: '📦', path: '/admin/orders' },
  { label: 'Customers', icon: '👥', path: '/admin/customers' },
  { label: 'Products', icon: '🛍️', path: '/admin/products' },
  { label: 'Inventory', icon: '▤', path: '/admin/inventory' },
  { label: 'Reports', icon: '📊', path: '/admin/reports' },
  { label: 'Settings', icon: '⚙️', path: '/admin/settings' },
]

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export default function Dashboard() {

  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    customers: 0,
    products: 0,
  })

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setLoading(true)
      setError(null)

      try {
        const [
          ordersResult,
          customersResult,
          productsResult,
          recentResult,
        ] = await Promise.all([
          supabase
            .from('orders')
            .select('total_amount, status'),

          supabase.rpc('get_admin_customers'),

          supabase
            .from('products')
            .select('id', { count: 'exact', head: true }),

          supabase
            .from('orders')
            .select(`
              id,
              order_number,
              total_amount,
              status,
              user_id,
              shipping_address,
              created_at
            `)
            .order('created_at', { ascending: false })
            .limit(5),
        ])

        if (ordersResult.error) throw ordersResult.error
        if (customersResult.error) throw customersResult.error
        if (productsResult.error) throw productsResult.error
        if (recentResult.error) throw recentResult.error

        const orders = ordersResult.data ?? []
        const customers = customersResult.data ?? []

        const totalSales = orders.reduce((sum, order) => {
          if (order.status === 'cancelled') return sum
          return sum + Number(order.total_amount || 0)
        }, 0)

        const customerNames = new Map<string, string>(
          customers.map((customer: {
            id: string
            full_name: string | null
            name: string | null
          }) => [
            customer.id,
            customer.full_name || customer.name || 'Customer',
          ])
        )

        const formattedOrders: RecentOrder[] = (
          recentResult.data ?? []
        ).map(order => {
          const address = order.shipping_address as
            | Record<string, unknown>
            | null

          const addressName =
            typeof address?.full_name === 'string'
              ? address.full_name
              : null

          return {
            ...order,
            total_amount: Number(order.total_amount),
            customer_name:
              addressName ||
              customerNames.get(order.user_id) ||
              'Customer',
          }
        })

        if (!active) return

        setStats({
          totalSales,
          totalOrders: orders.length,
          customers: customers.length,
          products: productsResult.count ?? 0,
        })

        setRecentOrders(formattedOrders)
      } catch (err) {
        console.error('Dashboard loading error:', err)

        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load dashboard data.'
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])


  const statCards = [
    {
      label: 'Total Sales',
      value: currency.format(stats.totalSales),
      icon: '₹',
      note: 'Non-cancelled order value',
    },
    {
      label: 'Total Orders',
      value: String(stats.totalOrders),
      icon: '📦',
      note: 'All store orders',
    },
    {
      label: 'Customers',
      value: String(stats.customers),
      icon: '👥',
      note: 'Registered customers',
    },
    {
      label: 'Products',
      value: String(stats.products),
      icon: '🛍️',
      note: 'All store products',
    },
  ]

  return (
    <div className="w-full">


      {/* Main content */}
      <main className="flex-1 min-w-0 p-5 md:p-10">

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#20352B]">
              Dashboard Overview
            </h2>

            <p className="text-gray-500 mt-2">
              Welcome back! Here's your store overview.
            </p>
          </div>

          <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-500">
              STORE STATUS
            </p>

            <p className="font-semibold text-green-700 mt-1">
              ● Administration active
            </p>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map(stat => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>

                <span className="text-2xl">
                  {stat.icon}
                </span>
              </div>

              <h3 className="text-3xl font-bold text-[#20352B] mt-4">
                {loading ? '...' : stat.value}
              </h3>

              <p className="text-xs text-gray-400 mt-2">
                {stat.note}
              </p>
            </div>
          ))}
        </section>

        {/* Recent orders */}
        <section className="mt-10 bg-white rounded-xl shadow-sm border border-gray-100 p-6">

          <div className="mb-5">
            <h3 className="text-xl font-bold text-[#20352B]">
              Recent Orders
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Your five latest store orders.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="py-3 pr-4">Order</th>
                  <th className="py-3 pr-4">Customer</th>
                  <th className="py-3 pr-4">Amount</th>
                  <th className="py-3 pr-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-gray-400"
                    >
                      Loading recent orders...
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-gray-400"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map(order => (
                    <tr
                      key={order.id}
                      className="border-b last:border-0"
                    >
                      <td className="py-4 pr-4 font-medium text-[#20352B]">
                        {order.order_number}
                      </td>

                      <td className="py-4 pr-4 text-gray-600">
                        {order.customer_name}
                      </td>

                      <td className="py-4 pr-4 text-gray-700">
                        {currency.format(order.total_amount)}
                      </td>

                      <td className="py-4 pr-4">
                        <span className="inline-block rounded-full bg-[#F0EEE8] px-3 py-1 text-xs font-medium capitalize text-[#20352B]">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
