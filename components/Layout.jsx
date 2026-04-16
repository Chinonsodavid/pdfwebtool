import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, Moon, Sun, ShieldCheck, Wrench, X } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { guideSummaries, siteInfo, trustLinks } from '../data/siteContent'
import CookieNotice from './CookieNotice'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/tools', label: 'Tools' },
  { to: '/guides', label: 'Guides' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Layout({ children }) {
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(circle at top, rgba(249,83,14,0.08), transparent 32%), var(--bg)' }}>
      <header className="sticky top-0 z-20 backdrop-blur border-b" style={{ background: 'color-mix(in srgb, var(--bg) 94%, transparent)', borderColor: 'var(--border)' }}>
        <div className="sm:hidden grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--accent)', color: 'white', boxShadow: '0 10px 24px rgba(249,83,14,0.25)' }}>
              <Wrench size={17} />
            </div>
            <span className="min-w-0 truncate font-display text-sm font-bold leading-none" style={{ color: 'var(--text)' }}>
              {siteInfo.name}
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setMenuOpen(current => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        <div className="hidden max-w-7xl mx-auto px-6 py-4 sm:flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--accent)', color: 'white', boxShadow: '0 10px 24px rgba(249,83,14,0.25)' }}>
              <Wrench size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-base sm:text-lg leading-none truncate" style={{ color: 'var(--text)' }}>
                {siteInfo.name}
              </p>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative px-3 py-2 text-sm font-medium transition-colors nav-link"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  '--nav-line-opacity': isActive ? 1 : 0,
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <Link to="/tools" className="hidden sm:inline-flex btn-primary">
              Open tools
            </Link>
            <button type="button" onClick={toggleTheme} className="btn-secondary px-3 sm:px-5">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </button>
          </div>
        </div>
        {menuOpen ? (
          <nav className="sm:hidden border-t px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
            <div className="grid gap-1">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="relative px-3 py-3 text-sm font-medium transition-colors nav-link"
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    '--nav-line-opacity': isActive ? 1 : 0,
                  })}
                >
                  {item.label}
                </NavLink>
              ))}
              <Link to="/tools" onClick={() => setMenuOpen(false)} className="btn-primary mt-2 justify-center">
                Open tools
              </Link>
            </div>
          </nav>
        ) : null}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">{children}</main>
      <CookieNotice />

      <footer className="border-t mt-12" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="grid md:grid-cols-[1.2fr_0.8fr_0.8fr] gap-8">
            <div className="space-y-3">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)', color: 'white' }}>
                  <Wrench size={18} />
                </div>
                <span className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>
                  {siteInfo.name}
                </span>
              </Link>
              <div className="flex items-start gap-2 text-sm leading-relaxed max-w-xl" style={{ color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                <span>
                  Files are processed by the backend for the selected task and temporary files are scheduled for cleanup after {siteInfo.fileRetention}.
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-display font-bold" style={{ color: 'var(--text)' }}>Helpful guides</h2>
              <div className="mt-3 grid gap-2">
                {guideSummaries.slice(0, 5).map(guide => (
                  <Link key={guide.slug} to={`/guides/${guide.slug}`} className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
                    {guide.title}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-display font-bold" style={{ color: 'var(--text)' }}>Site</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {trustLinks.map(link => (
                  <Link key={link.to} to={link.to} className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} {siteInfo.name}. Document tools for responsible use.
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Contact: {siteInfo.contactEmail}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
