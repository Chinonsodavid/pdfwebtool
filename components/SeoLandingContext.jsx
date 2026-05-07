import { createContext, useContext } from 'react'

const SeoLandingContext = createContext(null)

export function SeoLandingProvider({ value, children }) {
  return (
    <SeoLandingContext.Provider value={value}>
      {children}
    </SeoLandingContext.Provider>
  )
}

export function useSeoLanding() {
  return useContext(SeoLandingContext)
}
