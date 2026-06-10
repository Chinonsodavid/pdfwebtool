import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import {
  ChevronDown,
  Globe,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  X,
  Settings,
  FolderOpen,
  Crown,
  LogOut,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { guideSummaries, siteInfo, trustLinks } from "../data/siteContent";
import { primaryNavTools, toolGroups } from "../utils/toolCatalog";

import CookieNotice from "./CookieNotice";

const convertGroupIds = ["convert-to", "convert-from"];

function BrandWordmark({ size = "base" }) {
  const sizeClass =
    size === "large" ? "text-lg sm:text-xl" : "text-base sm:text-lg";

  return (
    <span className="brand-wordmark">
      Constant<span className="brand-wordmark-pdf">PDF</span>
    </span>
  );
}

export default function Layout({ children }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, languages } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const closeTimerRef = useRef(null);
  const convertGroups = toolGroups.filter((group) =>
    convertGroupIds.includes(group.id),
  );
  const compactFooterPaths = new Set([
    "/merge",
    "/split",
    "/compress",
    "/image-to-pdf",
    "/pdf-to-image",
    "/word-to-pdf",
    "/pdf-to-word",
    "/pdf-to-excel",
    "/excel-to-pdf",
    "/powerpoint-to-pdf",
    "/pdf-to-powerpoint",
    "/rotate",
    "/reorder",
    "/watermark",
    "/edit",
    "/protect",
    "/unlock",
    "/extract-text",
    "/page-labels",
    "/crop",
    "/extract-pages",
    "/ocr",
    "/sign",
    "/metadata",
    "/page-manager",
    "/batch",
  ]);
  const showCompactFooter = compactFooterPaths.has(location.pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    console.log("Firebase User:", user);
  }, [user]);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow || "";
      document.documentElement.style.overflow = previousRootOverflow || "";
    }

    return () => {
      document.body.style.overflow = previousOverflow || "";
      document.documentElement.style.overflow = previousRootOverflow || "";
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [menuOpen]);

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
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      <header
        className="sticky top-0 z-20 backdrop-blur border-b"
        style={{
          background: "color-mix(in srgb, var(--bg) 94%, transparent)",
          borderColor: "var(--border)",
        }}
      >
        <div className="sm:hidden grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <BrandWordmark />
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="mobile-header-icon"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="mobile-header-icon"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
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
              {t("common.guides", "Guides")}
            </NavLink>
            <NavLink
              to="/pricing"
              className="relative px-3 py-2 text-sm font-medium transition-colors nav-link"
              style={({ isActive }) => ({
                color: isActive ? "var(--accent)" : "var(--text-muted)",
                "--nav-line-opacity": isActive ? 1 : 0,
              })}
            >
              {t("common.pricing", "Pricing")}
            </NavLink>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition-all duration-200"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-card)",
              }}
            >
              <Globe size={14} className="shrink-0" style={{ color: "var(--text-muted)" }} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label={t("common.language", "Language")}
                className="bg-transparent border-none outline-none font-medium cursor-pointer"
                style={{
                  color: "var(--text)",
                }}
              >
                {languages.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    style={{ background: "var(--bg-card)", color: "var(--text)" }}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

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
            {user ? (
              <div
                className="relative ml-4"
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border px-2 py-1"
                >
                  <span>{user.displayName}</span>

                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="h-8 w-8 rounded-full"
                  />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 top-full pt-2 w-80 z-50">
                    <div
                      className="overflow-hidden rounded-3xl border shadow-2xl"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--bg-card)",
                      }}
                    >
                      <div
                        className="border-b p-5"
                        style={{
                          borderColor: "var(--border)",
                          background:
                            "linear-gradient(to bottom right, rgba(249,83,14,.10), rgba(249,83,14,.03))",
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="h-14 w-14 rounded-full"
                          />

                          <div className="min-w-0 flex-1">
                            <h3
                              className="truncate text-sm font-bold"
                              style={{ color: "var(--text)" }}
                            >
                              {user.displayName}
                            </h3>

                            <p
                              className="truncate text-xs mt-1"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {user.email}
                            </p>

                            <span
                              className="inline-flex mt-3 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                              style={{
                                background: "rgba(249,83,14,.12)",
                                color: "var(--accent)",
                              }}
                            >
                              Free Plan
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition hover:bg-[var(--bg-subtle)]"
                          style={{ color: "var(--text)" }}
                        >
                          <Settings size={16} />
                          <span>
                            {t("common.accountSettings", "Account Settings")}
                          </span>
                        </button>

                        <button
                          className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition"
                          style={{
                            background: "rgba(249,83,14,.08)",
                            color: "var(--accent)",
                          }}
                        >
                          <Crown size={16} />
                          <span>
                            {t("common.upgradeToPro", "Upgrade to Pro")}
                          </span>
                        </button>
                      </div>

                      <div
                        className="border-t p-2"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <button
                          onClick={() => signOut(auth)}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition"
                          style={{ color: "#ef4444" }}
                        >
                          <LogOut size={16} />
                          <span>{t("common.logOut", "Log out")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-auth-link">
                  Login
                </Link>
                <Link to="/signup" className="nav-signup-button">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ─── REDESIGNED MOBILE MENU DRAWER ─── */}
        {menuOpen ? (
          <nav
            className="fixed inset-0 z-50 sm:hidden overflow-y-auto"
            style={{
              height: "100dvh",
              background: "var(--bg)",
            }}
          >
            <div className="flex flex-col min-h-full px-5 py-5">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-2">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center"
                >
                  <BrandWordmark size="large" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  <X size={17} strokeWidth={2.2} />
                </button>
              </div>

              {/* Thin rule */}
              <div
                style={{
                  height: "1px",
                  background: "var(--border)",
                  margin: "4px 0 0",
                }}
              />

              {/* Primary nav links */}
              <div className="flex flex-col">
                {[
                  { label: t("common.pricing", "Pricing"), to: "/pricing" },
                  { label: t("common.allTools", "All tools"), to: "/tools" },
                  { label: t("common.guides", "Guides"), to: "/guides" },
                ].map((item, i, arr) => (
                  <div key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-[18px]"
                      style={{ textDecoration: "none" }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          color: "var(--text-muted)",
                          letterSpacing: "-0.2px",
                          transition: "color 0.15s",
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        style={{
                          color: "var(--text-muted)",
                          opacity: 0.5,
                          fontSize: 18,
                        }}
                      >
                        →
                      </span>
                    </Link>
                    <div
                      style={{ height: "1px", background: "var(--border)" }}
                    />
                  </div>
                ))}

                {/* Help accordion */}
                <details className="group">
                  <summary
                    className="flex items-center justify-between py-[18px] cursor-pointer list-none"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        letterSpacing: "-0.2px",
                      }}
                    >
                      {t("common.help", "Help")}
                    </span>
                    <ChevronDown
                      size={16}
                      style={{ transition: "transform 0.2s" }}
                      className="group-open:rotate-180"
                    />
                  </summary>
                  <div className="pb-2 flex flex-col gap-1 pl-1">
                    {[
                      { label: t("common.faq", "FAQ"), to: "/faq" },
                      { label: t("common.privacy", "Privacy"), to: "/privacy" },
                    ].map((sub) => (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                        style={{
                          color: "var(--text-muted)",
                          fontSize: 14,
                          textDecoration: "none",
                          background: "var(--bg-subtle)",
                        }}
                      >
                        <span>{sub.label}</span>
                        <span style={{ opacity: 0.4 }}>→</span>
                      </Link>
                    ))}
                  </div>
                </details>
                <div style={{ height: "1px", background: "var(--border)" }} />

                {/* Language row */}
                <div className="flex items-center justify-between py-3.5">
                  <div
                    className="flex items-center gap-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Globe size={17} strokeWidth={2} />
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {t("common.language", "Language")}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{
                      background: "var(--bg-subtle)",
                      border: "1px solid var(--border)",
                      fontSize: 13,
                      color: "var(--text-muted)",
                    }}
                  >
                    <select
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value);
                      }}
                      aria-label={t("common.language", "Language")}
                      style={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        fontSize: 13,
                        color: "var(--text-muted)",
                        cursor: "pointer",
                      }}
                    >
                      {languages.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" style={{ minHeight: 16 }} />

              {/* ─── Account section ─── */}
              <div
                className="rounded-2xl p-4 flex flex-col gap-2.5"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  marginBottom: 12,
                }}
              >
                {user ? (
                  <>
                    {/* Profile row */}
                    <div className="flex items-center gap-3 mb-1">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: 14,
                            flexShrink: 0,
                            objectFit: "cover",
                            border: "1.5px solid var(--border)",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: 14,
                            background: "rgba(249,83,14,0.12)",
                            border: "1.5px solid rgba(249,83,14,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 16,
                            color: "var(--accent)",
                            flexShrink: 0,
                          }}
                        >
                          {user.displayName?.charAt(0).toUpperCase() ?? "U"}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div
                          className="truncate font-semibold"
                          style={{ fontSize: 15, color: "var(--text)" }}
                        >
                          {user.displayName}
                        </div>
                        <div
                          className="truncate"
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            marginTop: 2,
                          }}
                        >
                          {user.email}
                        </div>
                      </div>
                      {/* Free plan badge */}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 9px",
                          borderRadius: 6,
                          background: "rgba(249,83,14,0.10)",
                          color: "var(--accent)",
                          border: "1px solid rgba(249,83,14,0.18)",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {t("common.free", "Free")}
                      </span>
                    </div>

                    {/* Upgrade CTA — primary */}
                    <button
                      style={{
                        width: "100%",
                        padding: "13px",
                        borderRadius: 12,
                        border: "none",
                        cursor: "pointer",
                        background: "var(--accent)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        letterSpacing: "0.1px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      <Crown size={15} />
                      {t("common.upgradeToPro", "Upgrade to Pro")}
                    </button>

                    {/* Settings — ghost */}
                    <button
                      style={{
                        width: "100%",
                        padding: "11px",
                        borderRadius: 12,
                        cursor: "pointer",
                        background: "transparent",
                        border: "1px solid var(--border)",
                        color: "var(--text-muted)",
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      <Settings size={14} />
                      {t("common.accountSettings", "Account Settings")}
                    </button>

                    {/* Log out — text only */}
                    <button
                      onClick={() => {
                        signOut(auth);
                        setMenuOpen(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "9px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--accent)",
                        fontSize: 13,
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        opacity: 0.7,
                      }}
                    >
                      <LogOut size={13} />
                      {t("common.logOut", "Log out")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "13px",
                        borderRadius: 12,
                        background: "var(--accent)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        textAlign: "center",
                        textDecoration: "none",
                      }}
                    >
                      {t("common.signUp", "Sign up")}
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "11px",
                        borderRadius: 12,
                        background: "transparent",
                        border: "1px solid var(--border)",
                        color: "var(--text-muted)",
                        fontSize: 13,
                        textAlign: "center",
                        textDecoration: "none",
                      }}
                    >
                      {t("common.login", "Login")}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        ) : null}
        {/* ─── END MOBILE MENU ─── */}
      </header>

      <main className="flex-1 max-w-screen-2xl w-full mx-auto px-4 sm:px-3 py-5 sm:py-10">
        {children}
      </main>
      <CookieNotice />

      {showCompactFooter ? (
        <footer className="border-t" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-3 py-1">
            <p
              className="text-[12px] leading-none "
              style={{ color: "var(--text-muted)" }}
            >
              © ConstantPDF 2026 ® - Your PDF Editor
            </p>
          </div>
        </footer>
      ) : (
        <footer
          className="border-t mt-16"
          style={{
            borderColor: "var(--border)",
            background: "linear-gradient(to bottom, transparent, rgba(249, 83, 14, 0.02))",
          }}
        >
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-12 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {/* Brand Column */}
              <div className="md:col-span-2 space-y-4">
                <Link to="/" className="inline-flex items-center gap-2">
                  <BrandWordmark size="large" />
                </Link>
                <p
                  className="text-sm leading-relaxed max-w-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  Simple, secure, and fast document workstations. Built for schools, offices, and freelancers to manage their PDF workflow without compromise.
                </p>
                <div
                  className="flex items-start gap-3 rounded-2xl border p-4 max-w-md"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg-card)",
                  }}
                >
                  <ShieldCheck
                    size={20}
                    className="shrink-0 mt-0.5"
                    style={{ color: "var(--accent)" }}
                  />
                  <span
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Files are processed securely on the backend for the selected task and temporary files are scheduled for automatic cleanup after {siteInfo.fileRetention}.
                  </span>
                </div>
              </div>

              {/* Product Column */}
              <div className="space-y-4">
                <h2
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--text)" }}
                >
                  Product
                </h2>
                <nav className="flex flex-col gap-3">
                  <Link
                    to="/tools"
                    className="group inline-flex items-center gap-1 text-sm transition-all duration-200 hover:text-[var(--accent)] hover:translate-x-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>All Tools</span>
                  </Link>
                  <Link
                    to="/pricing"
                    className="group inline-flex items-center gap-1 text-sm transition-all duration-200 hover:text-[var(--accent)] hover:translate-x-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>Pricing</span>
                  </Link>
                  <Link
                    to="/about"
                    className="group inline-flex items-center gap-1 text-sm transition-all duration-200 hover:text-[var(--accent)] hover:translate-x-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>About</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-1 text-sm transition-all duration-200 hover:text-[var(--accent)] hover:translate-x-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>Contact</span>
                  </Link>
                  <Link
                    to="/faq"
                    className="group inline-flex items-center gap-1 text-sm transition-all duration-200 hover:text-[var(--accent)] hover:translate-x-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>FAQ</span>
                  </Link>
                  <Link
                    to="/file-handling"
                    className="group inline-flex items-center gap-1 text-sm transition-all duration-200 hover:text-[var(--accent)] hover:translate-x-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>File Handling</span>
                  </Link>
                </nav>
              </div>

              {/* Legal Column */}
              <div className="space-y-4">
                <h2
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--text)" }}
                >
                  Legal
                </h2>
                <nav className="flex flex-col gap-3">
                  <Link
                    to="/privacy"
                    className="group inline-flex items-center gap-1 text-sm transition-all duration-200 hover:text-[var(--accent)] hover:translate-x-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>Privacy Policy</span>
                  </Link>
                  <Link
                    to="/terms"
                    className="group inline-flex items-center gap-1 text-sm transition-all duration-200 hover:text-[var(--accent)] hover:translate-x-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>Terms of Service</span>
                  </Link>
                  <Link
                    to="/cookies"
                    className="group inline-flex items-center gap-1 text-sm transition-all duration-200 hover:text-[var(--accent)] hover:translate-x-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>Cookie Policy</span>
                  </Link>
                  <Link
                    to="/disclaimer"
                    className="group inline-flex items-center gap-1 text-sm transition-all duration-200 hover:text-[var(--accent)] hover:translate-x-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>Disclaimer</span>
                  </Link>
                  <Link
                    to="/copyright"
                    className="group inline-flex items-center gap-1 text-sm transition-all duration-200 hover:text-[var(--accent)] hover:translate-x-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>Copyright</span>
                  </Link>
                </nav>
              </div>
            </div>

            {/* Bottom Row */}
            <div
              className="pt-8 border-t flex flex-col sm:flex-row gap-4 items-center justify-between"
              style={{ borderColor: "var(--border)" }}
            >
              <p
                className="text-xs text-center sm:text-left"
                style={{ color: "var(--text-muted)" }}
              >
                © {new Date().getFullYear()} {siteInfo.name}. Built for secure and productive document management.
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span style={{ color: "var(--text-muted)" }}>
                  Need help?{" "}
                  <a
                    href={`mailto:${siteInfo.contactEmail}`}
                    className="font-medium underline underline-offset-2 transition hover:text-[var(--accent)]"
                    style={{ color: "var(--text)" }}
                  >
                    {siteInfo.contactEmail}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
