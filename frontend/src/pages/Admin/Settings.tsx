
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'

type Preferences = {
  orderNotifications: boolean
  lowStockNotifications: boolean
  customerNotifications: boolean
}

const defaultPreferences: Preferences = {
  orderNotifications: true,
  lowStockNotifications: true,
  customerNotifications: true,
}

export default function Settings() {
  const { profile, user } = useAuthStore()

  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences)

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tulsi-admin-preferences')

      if (stored) {
        setPreferences({
          ...defaultPreferences,
          ...JSON.parse(stored),
        })
      }
    } catch {
      // Keep default preferences if stored settings cannot be read.
    }
  }, [])

  function updatePreference(
    field: keyof Preferences,
    value: boolean
  ) {
    setPreferences(previous => ({
      ...previous,
      [field]: value,
    }))
    setSaved(false)
  }

  function savePreferences() {
    try {
      localStorage.setItem(
        'tulsi-admin-preferences',
        JSON.stringify(preferences)
      )
      setSaved(true)
    } catch {
      setSaved(false)
    }
  }

  const adminName =
    profile?.full_name ||
    profile?.name ||
    'Administrator'

  const preferenceItems = [
    {
      key: 'orderNotifications' as const,
      title: 'Order notifications',
      description: 'Receive notifications about new customer orders.',
    },
    {
      key: 'lowStockNotifications' as const,
      title: 'Low-stock notifications',
      description: 'Get notified when products have low or zero stock.',
    },
    {
      key: 'customerNotifications' as const,
      title: 'Customer notifications',
      description: 'Receive notifications about new customer registrations.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#F7F5EF] p-5 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#20352B]">
          Settings
        </h1>
        <p className="mt-2 text-gray-500">
          Manage your administration preferences and account information.
        </p>
      </header>

      <div className="space-y-6">
        {/* Admin account */}
        <section className="rounded-xl bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-xl font-bold text-[#20352B]">
            Administrator account
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your current signed-in account details.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Name
              </label>
              <p className="mt-1 font-medium text-[#20352B]">
                {adminName}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Email address
              </label>
              <p className="mt-1 break-all font-medium text-[#20352B]">
                {user?.email || 'Not available'}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Account role
              </label>
              <p className="mt-1 font-medium text-green-700">
                Administrator
              </p>
            </div>
          </div>

          <p className="mt-5 rounded-lg bg-[#F7F5EF] p-3 text-xs text-gray-500">
            Account details and administrator permissions are read-only here.
            Both authorized administrators retain their existing permissions.
          </p>
        </section>

        {/* Store information */}
        <section className="rounded-xl bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-xl font-bold text-[#20352B]">
            Store information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Current store identity.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Store name
              </label>
              <p className="mt-1 font-semibold text-[#20352B]">
                MADHU वन              </p>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Store type
              </label>
              <p className="mt-1 font-semibold text-[#20352B]">
                Ecommerce
              </p>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Currency
              </label>
              <p className="mt-1 font-semibold text-[#20352B]">
                Indian Rupee (INR ₹)
              </p>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Payment method
              </label>
              <p className="mt-1 font-semibold text-[#20352B]">
                Cash on Delivery
              </p>
            </div>
          </div>

          <p className="mt-5 text-xs text-gray-400">
            These are display-only details for now. We will connect editable
            store information to a shared database setting later.
          </p>
        </section>

        {/* Notifications */}
        <section className="rounded-xl bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-xl font-bold text-[#20352B]">
            Notification preferences
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose which notification preferences you want enabled.
          </p>

          <div className="mt-6 divide-y divide-gray-100">
            {preferenceItems.map(item => (
              <label
                key={item.key}
                className="flex cursor-pointer items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-[#20352B]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={preferences[item.key]}
                  onChange={event =>
                    updatePreference(item.key, event.target.checked)
                  }
                  className="h-5 w-5 shrink-0 accent-[#20352B]"
                />
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={savePreferences}
              className="rounded-lg bg-[#20352B] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Save preferences
            </button>

            {saved && (
              <span className="text-sm font-medium text-green-700">
                Preferences saved!
              </span>
            )}
          </div>

          <p className="mt-4 text-xs text-gray-400">
            These preferences are saved in this browser only. They do not
            currently send emails, SMS messages or push notifications.
          </p>
        </section>
      </div>
    </div>
  )
}
