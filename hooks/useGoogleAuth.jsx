import { useEffect, useState } from 'react'

const STORAGE_KEY = 'constant-pdf-google-user'
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

function decodeJwtPayload(token) {
  const payload = token.split('.')[1]
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
  const decoded = atob(normalized)
  return JSON.parse(decodeURIComponent(decoded.split('').map(char => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`).join('')))
}

function readStoredUser() {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function useGoogleAuth() {
  const [user, setUser] = useState(readStoredUser)
  const [status, setStatus] = useState(googleClientId ? 'loading' : 'missing-config')

  useEffect(() => {
    if (!googleClientId) return undefined

    let cancelled = false

    function handleCredential(response) {
      try {
        const profile = decodeJwtPayload(response.credential)
        const nextUser = {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
        setUser(nextUser)
        setStatus('ready')
      } catch {
        setStatus('error')
      }
    }

    function initializeGoogle() {
      if (cancelled || !window.google?.accounts?.id) return

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      })
      setStatus('ready')
    }

    if (window.google?.accounts?.id) {
      initializeGoogle()
      return undefined
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = initializeGoogle
    script.onerror = () => setStatus('error')
    document.head.appendChild(script)

    return () => {
      cancelled = true
    }
  }, [])

  function signIn() {
    if (!googleClientId) {
      setStatus('missing-config')
      return
    }

    if (!window.google?.accounts?.id) {
      setStatus('loading')
      return
    }

    window.google.accounts.id.prompt(notification => {
      if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
        setStatus('prompt-blocked')
      }
    })
  }

  function signOut() {
    if (user?.email && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setStatus(googleClientId ? 'ready' : 'missing-config')
  }

  return {
    user,
    status,
    signIn,
    signOut,
    isConfigured: Boolean(googleClientId),
  }
}
