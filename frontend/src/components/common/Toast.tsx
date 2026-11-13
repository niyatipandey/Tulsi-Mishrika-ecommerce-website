import { useUIStore, type Toast } from '@/store/uiStore'

function ToastIcon({ type }: { type: Toast['type'] }) {
  if (type === 'success') {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  }
  if (type === 'error') {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

export default function ToastViewport() {
  const { toasts, removeToast } = useUIStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[80] flex flex-col gap-2 w-[min(100%-2rem,22rem)] pointer-events-none">
      {toasts.map((toast) => {
        const tones = {
          success: 'bg-emerald-700 text-white',
          error: 'bg-red-600 text-white',
          info: 'bg-brand-brown-800 text-white',
        }

        return (
          <div
            key={toast.id}
            className={`${tones[toast.type]} pointer-events-auto shadow-lg rounded-xl px-4 py-3 flex items-start gap-3 animate-slideIn`}
            role="status"
          >
            <span className="mt-0.5 shrink-0">
              <ToastIcon type={toast.type} />
            </span>
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              type="button"
              className="opacity-80 hover:opacity-100"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
