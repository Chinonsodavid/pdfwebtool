import { Link, NavLink } from 'react-router-dom'
import { Moon, Sun, ShieldCheck, Wrench } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/tools', label: 'Tools' },
]

export default function Layout({ children }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(circle at top, rgba(249,83,14,0.08), transparent 32%), var(--bg)' }}>
      <header className="sticky top-0 z-20 backdrop-blur border-b" style={{ background: 'color-mix(in srgb, var(--bg) 88%, transparent)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent)', color: 'white', boxShadow: '0 10px 24px rgba(249,83,14,0.25)' }}>
              <Wrench size={20} />
            </div>
            <div>
              <p className="font-display font-bold text-lg leading-none" style={{ color: 'var(--text)' }}>
                PDFForge
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                PDF tools
              </p>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-2">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className="px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                style={({ isActive }) => ({
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/tools" className="hidden sm:inline-flex btn-primary">
              Open tools
            </Link>
            <button type="button" onClick={toggleTheme} className="btn-secondary">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</main>

      <footer className="border-t mt-12" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} />
            Files are processed on your server and cleaned up automatically.
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            PDFForge
          </p>
        </div>
      </footer>
    </div>
  )
}
