import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'constant-pdf-cookie-notice'

export default function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(localStorage.getItem(STORAGE_KEY) !== 'accepted')
  }, [])

  function acceptNotice() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-30 max-w-3xl mx-auto card p-4 shadow-lg">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          ConstantPDF uses essential browser storage for preferences. If ads or analytics are enabled later, cookies may also help measure and improve the service.
          {' '}
          <Link to="/cookies" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>Cookie Policy</Link>
          {' '}and{' '}
          <Link to="/privacy" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>
        </p>
        <button type="button" className="btn-primary shrink-0 justify-center" onClick={acceptNotice}>
          Accept
        </button>
      </div>
    </div>
  )
}
