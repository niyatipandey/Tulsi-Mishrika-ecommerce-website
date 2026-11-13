
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const menuItems = [
  { label: 'Overview', icon: '▦', path: '/admin' },
  { label: 'Orders', icon: '📦', path: '/admin/orders' },
  { label: 'Customers', icon: '👥', path: '/admin/customers' },
  { label: 'Products', icon: '🛍️', path: '/admin/products' },
  { label: 'Inventory', icon: '▤', path: '/admin/inventory' },
  { label: 'Reports', icon: '📊', path: '/admin/reports' },
  { label: 'Settings', icon: '⚙️', path: '/admin/settings' },
]

export default function AdminSidebar() {
  const { profile, user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')

  const adminName =
    profile?.full_name ||
    profile?.name ||
    user?.email ||
    'Admin'

  
  
  async function handleLogout() {
    setLoggingOut(true)
    setError('')

    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to log out.'
      )
      setLoggingOut(false)
    }
  }



  return (
    <aside className="w-full md:w-64 md:min-h-screen md:shrink-0 bg-[#20352B] text-white p-6 flex flex-col">

      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-wide">
          Tulsi Mishrika
        </h1>

        <p className="text-xs text-gray-300 mt-2 tracking-widest">
          STORE ADMINISTRATION
        </p>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map(item => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#D8C49A] text-[#20352B] font-semibold'
                  : 'text-gray-200 hover:bg-white/10'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mb-28 border-t border-white/20 pt-5">
        <p className="text-sm text-gray-300">
          Logged in as
        </p>

        <p className="text-sm font-semibold mt-1 break-all">
          {adminName}
        </p>

        <p className="text-xs text-green-300 mt-2">
          Administrator
        </p>

        {error && (
          <p className="mt-3 text-xs text-red-300">{error}</p>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="cursor-pointer mt-4 w-full rounded-lg border border-white/30 px-4 py-3 text-left text-sm text-white hover:bg-white/10 disabled:opacity-50"
        >
          {loggingOut ? 'Logging out...' : '↪ Logout'}
        </button>
      </div>
    </aside>
  )
}
