import { Link, NavLink } from 'react-router-dom'
import { Moon, Sun, ShieldCheck, Wrench } from 'lucide-react'
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
