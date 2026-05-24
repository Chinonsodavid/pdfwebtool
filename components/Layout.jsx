import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, Menu, Moon, ShieldCheck, Sun, X } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { guideSummaries, siteInfo, trustLinks } from "../data/siteContent";
import { primaryNavTools, toolGroups } from "../utils/toolCatalog";
import CookieNotice from "./CookieNotice";

const convertGroupIds = ["convert-to", "convert-from"];

function BrandWordmark({ size = "base" }) {
  const sizeClass =
    size === "large" ? "text-lg sm:text-xl" : "text-base sm:text-lg";

  return (
    <span className={`brand-wordmark ${sizeClass}`}>
      Constant<span className="brand-wordmark-pdf">PDF</span>
    </span>
  );
}

export default function Layout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const closeTimerRef = useRef(null);
  const convertGroups = toolGroups.filter((group) =>
    convertGroupIds.includes(group.id),
  );

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const openDropdown = (menuKey) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveMenu(menuKey);
  };

  const closeDropdownWithDelay = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setActiveMenu("");
      closeTimerRef.current = null;
    }, 140);
  };

  function ToolMegaMenu({ groups }) {
    return (
      <div className="mega-menu">
        <div className="mega-menu-grid">
          {groups.map((group) => (
            <div key={group.id} className="space-y-2">
              <p className="mega-menu-title">{group.label}</p>
              <div className="grid gap-1">
                {group.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="mega-menu-link"
                    onClick={() => setActiveMenu("")}
                  >
                    <span
                      className="mega-menu-icon"
                      style={{ background: tool.bg, color: tool.color }}
                    >
                      <tool.icon size={16} />
                    </span>
                    <span>{tool.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header
        className="sticky top-0 z-20 backdrop-blur border-b"
        style={{
          background: "color-mix(in srgb, var(--bg) 94%, transparent)",
          borderColor: "var(--border)",
        }}
      >
        <div className="sm:hidden grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-3 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <BrandWordmark />
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            style={{
              background: "var(--bg-subtle)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              style={{
                background: "var(--bg-subtle)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        <div className="hidden max-w-screen-2xl mx-auto px-3 py-2.5 sm:flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <BrandWordmark size="large" />
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {primaryNavTools.map((tool) => (
              <NavLink
                key={tool.id}
                to={tool.path}
                className="relative px-3 py-2 text-sm font-medium transition-colors nav-link"
                style={({ isActive }) => ({
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                  "--nav-line-opacity": isActive ? 1 : 0,
                })}
              >
                {tool.label}
              </NavLink>
            ))}

            <div className="relative">
              <div
                onMouseEnter={() => openDropdown("convert")}
                onMouseLeave={closeDropdownWithDelay}
              >
                <button type="button" className="nav-dropdown-trigger">
                  Convert PDF
                  <ChevronDown size={15} />
                </button>
                {activeMenu === "convert" ? (
                  <ToolMegaMenu groups={convertGroups} />
                ) : null}
              </div>
            </div>

            <div className="relative">
              <div
                onMouseEnter={() => openDropdown("tools")}
                onMouseLeave={closeDropdownWithDelay}
              >
                <button type="button" className="nav-dropdown-trigger">
                  All PDF Tools
                  <ChevronDown size={15} />
                </button>
                {activeMenu === "tools" ? (
                  <ToolMegaMenu groups={toolGroups} />
                ) : null}
              </div>
            </div>

            <NavLink
              to="/guides"
              className="relative px-3 py-2 text-sm font-medium transition-colors nav-link"
              style={({ isActive }) => ({
                color: isActive ? "var(--accent)" : "var(--text-muted)",
                "--nav-line-opacity": isActive ? 1 : 0,
              })}
            >
              Guides
            </NavLink>
            <NavLink
              to="/pricing"
              className="relative px-3 py-2 text-sm font-medium transition-colors nav-link"
              style={({ isActive }) => ({
                color: isActive ? "var(--accent)" : "var(--text-muted)",
                "--nav-line-opacity": isActive ? 1 : 0,
              })}
            >
              Pricing
            </NavLink>
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="nav-icon-button"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/login" className="nav-auth-link">
              Login
            </Link>
            <Link to="/signup" className="nav-signup-button">
              Sign up
            </Link>
          </div>
        </div>
        {menuOpen ? (
          <nav
            className="sm:hidden border-t px-3 py-4"
            style={{ borderColor: "var(--border)", background: "var(--bg)" }}
          >
            <div className="mobile-menu-shell">
              <div className="mobile-menu-actions">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="mobile-login-link"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="nav-signup-button mobile-signup-button"
                >
                  Sign up
                </Link>
              </div>

              <div className="mobile-menu-primary">
                {primaryNavTools.map((tool) => (
                  <NavLink
                    key={tool.id}
                    to={tool.path}
                    onClick={() => setMenuOpen(false)}
                    className="mobile-primary-link"
                    style={({ isActive }) => ({
                      color: isActive ? "var(--accent)" : "var(--text)",
                    })}
                  >
                    {tool.label}
                  </NavLink>
                ))}
              </div>

              <Link
                to="/tools"
                onClick={() => setMenuOpen(false)}
                className="btn-primary mt-2 justify-center"
              >
                All PDF Tools
              </Link>

              <div
                className="mt-3 space-y-3 border-t pt-4"
                style={{ borderColor: "var(--border)" }}
              >
                {toolGroups.map((group) => (
                  <details key={group.id} className="mobile-menu-group">
                    <summary className="mobile-menu-summary">
                      <span>{group.label}</span>
                      <ChevronDown size={16} className="mobile-menu-chevron" />
                    </summary>
                    <div className="mobile-menu-links">
                      {group.tools.map((tool) => (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          onClick={() => setMenuOpen(false)}
                          className="mobile-menu-link"
                        >
                          {tool.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ))}
              </div>

              <div
                className="mt-3 border-t pt-4"
                style={{ borderColor: "var(--border)" }}
              >
                <Link
                  to="/guides"
                  onClick={() => setMenuOpen(false)}
                  className="mobile-primary-link"
                  style={{ color: "var(--text)" }}
                >
                  Guides
                </Link>
                <Link
                  to="/pricing"
                  onClick={() => setMenuOpen(false)}
                  className="mobile-primary-link"
                  style={{ color: "var(--text)" }}
                >
                  Pricing
                </Link>
              </div>

              <div
                className="mt-3 flex items-center justify-between rounded-md border px-3 py-3"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg-subtle)",
                }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {theme === "dark" ? "Dark mode" : "Light mode"}
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="nav-icon-button"
                  aria-label={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>
            </div>
          </nav>
        ) : null}
      </header>

      <main className="max-w-screen-2xl mx-auto px-3 sm:px-3 py-6 sm:py-10">
        {children}
      </main>
      <CookieNotice />

      <footer
        className="border-t mt-12"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-3 py-10 space-y-8">
          <div className="grid md:grid-cols-[1.2fr_0.8fr_0.8fr] gap-8">
            <div className="space-y-3">
              <Link to="/" className="inline-flex items-center gap-3">
                <BrandWordmark size="large" />
              </Link>
              <div
                className="flex items-start gap-2 text-sm leading-relaxed max-w-xl"
                style={{ color: "var(--text-muted)" }}
              >
                <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                <span>
                  Files are processed by the backend for the selected task and
                  temporary files are scheduled for cleanup after{" "}
                  {siteInfo.fileRetention}.
                </span>
              </div>
            </div>

            <div>
              <h2
                className="text-sm font-display font-bold"
                style={{ color: "var(--text)" }}
              >
                Helpful guides
              </h2>
              <div className="mt-3 grid gap-2">
                {guideSummaries.slice(0, 5).map((guide) => (
                  <Link
                    key={guide.slug}
                    to={`/guides/${guide.slug}`}
                    className="text-sm hover:underline"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {guide.title}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2
                className="text-sm font-display font-bold"
                style={{ color: "var(--text)" }}
              >
                Site
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  to="/faq"
                  className="text-sm hover:underline"
                  style={{ color: "var(--text-muted)" }}
                >
                  FAQ
                </Link>
                {trustLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm hover:underline"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div
            className="pt-6 border-t flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} {siteInfo.name}. Document tools for
              responsible use.
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Contact: {siteInfo.contactEmail}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
