import React from 'react'

export default function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full py-12 animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Pulsing halo ring */}
        <div 
          className="absolute h-14 w-14 animate-pulse rounded-full opacity-25" 
          style={{ backgroundColor: 'var(--accent)' }} 
        />
        
        {/* Rotating gradient spinner ring */}
        <div 
          className="h-10 w-10 animate-spin rounded-full border-3 border-transparent"
          style={{ 
            borderTopColor: 'var(--accent)',
            borderRightColor: 'var(--accent)',
            opacity: 0.85,
            borderWidth: '3px'
          }} 
        />
        
        {/* Core accent dot */}
        <div className="absolute h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
      </div>
      
      {/* Premium sub-label */}
      <span 
        className="mt-6 text-[11px] font-bold tracking-[0.2em] uppercase opacity-75 animate-pulse" 
        style={{ color: 'var(--text-muted)' }}
      >
        Loading
      </span>
    </div>
  )
}
