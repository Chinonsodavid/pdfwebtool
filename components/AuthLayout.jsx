import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../utils/firebase";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 64 64" aria-hidden="true">
      <path
        clipRule="evenodd"
        d="M62.72 32.733c0-2.27-.204-4.451-.582-6.545H32v12.378h17.222c-.742 4-2.997 7.389-6.386 9.658v8.029h10.342c6.051-5.571 9.542-13.775 9.542-23.52Z"
        fill="#4285F4"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M32 63.995c8.64 0 15.883-2.865 21.178-7.753l-10.342-8.029c-2.865 1.92-6.53 3.055-10.836 3.055-8.335 0-15.39-5.63-17.906-13.193H3.404v8.29C8.668 56.825 19.49 63.996 32 63.996Z"
        fill="#34A853"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M14.095 38.076a19.236 19.236 0 0 1-1.004-6.08c0-2.11.364-4.16 1.004-6.08v-8.291H3.403A31.987 31.987 0 0 0 0 31.995c0 5.165 1.236 10.052 3.404 14.372l10.69-8.291Z"
        fill="#FBBC05"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M32 12.727c4.698 0 8.916 1.615 12.232 4.786l9.179-9.178C47.869 3.17 40.625 0 32 0 19.49 0 8.669 7.17 3.403 17.63l10.691 8.29C16.611 18.356 23.665 12.727 32 12.727Z"
        fill="#EA4335"
        fillRule="evenodd"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1280px-Microsoft_logo.svg.png?_=20210729021049"
      alt="Microsoft"
      className="h-4 w-4 object-contain"
    />
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19 9.458 12.504H16.594l-5.8-7.584-6.636 7.584H.477l8.6-9.83L0 1.153h7.594l5.243 6.932 6.064-6.932Zm-1.291 19.494h2.039L6.486 3.24H4.298L17.61 20.647Z"
      />
    </svg>
  );
}

export function AuthSocialButtons() {
  const { t } = useLanguage();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      console.log("Logged in:", result.user);

      window.location.href = "/tools";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <button
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
          color: "var(--text)",
        }}
      >
        <MicrosoftIcon />
        {t("auth.socialMicrosoft", "Microsoft")}
      </button>
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition"
        style={{
          borderColor: "var(--accent)",
          background: "var(--bg-card)",
          color: "var(--text)",
        }}
      >
        <GoogleIcon />
        {t("auth.socialGoogle", "Google")}
      </button>
      <button
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
          color: "var(--text)",
        }}
      >
        <XIcon />
        {t("auth.socialX", "X")}
      </button>
    </div>
  );
}

function AuthIllustration() {
  return (
    <div className="relative mx-auto h-[260px] w-full max-w-[380px] scale-[0.85] origin-center mb-6">
      <div
        className="absolute left-0 top-5 h-44 w-20 rounded-[1.4rem] border p-3"
        style={{
          background: "rgba(255,255,255,0.58)",
          borderColor: "rgba(255,255,255,0.52)",
        }}
      >
        <div className="space-y-3">
          <div className="h-3 w-3 rounded-full bg-orange-200" />
          <div className="h-1.5 w-9 rounded-full bg-orange-300" />
          <div className="h-1.5 w-11 rounded-full bg-white/80" />
          <div className="h-1.5 w-10 rounded-full bg-white/80" />
          <div className="h-1.5 w-12 rounded-full bg-orange-100" />
          <div className="h-1.5 w-8 rounded-full bg-orange-100" />
          <div className="h-1.5 w-10 rounded-full bg-white/80" />
        </div>
      </div>

      <div
        className="absolute left-16 top-14 h-48 w-48 rounded-[1.8rem] border p-4"
        style={{
          background: "rgba(255,255,255,0.54)",
          borderColor: "rgba(255,255,255,0.48)",
        }}
      >
        <div className="mb-4 flex gap-2">
          <div className="h-5 flex-1 rounded-lg bg-white/85" />
          <div className="h-5 w-12 rounded-lg bg-white/75" />
        </div>
        <div className="space-y-3">
          <div className="h-8 rounded-xl bg-white/88" />
          <div className="h-8 rounded-xl bg-white/88" />
          <div className="h-8 rounded-xl bg-white/88" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-8 rounded-lg bg-orange-100" />
            <div className="h-8 rounded-lg bg-orange-100" />
            <div className="h-8 rounded-lg bg-orange-100" />
          </div>
        </div>
      </div>

      <div
        className="absolute right-1 top-10 h-52 w-36 rounded-[1.9rem] border p-4"
        style={{
          background: "rgba(255,255,255,0.54)",
          borderColor: "rgba(255,255,255,0.48)",
        }}
      >
        <div className="mb-4 h-2.5 w-20 rounded-full bg-orange-300" />
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="h-10 rounded-xl bg-white/80" />
            <div className="h-10 rounded-xl bg-white/80" />
          </div>
          <div className="h-10 rounded-xl bg-white/80" />
          <div className="h-10 rounded-xl bg-white/80" />
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="h-6 rounded-md bg-green-300" />
            <div className="h-6 rounded-md bg-orange-300" />
            <div className="h-6 rounded-md bg-violet-300" />
            <div className="h-6 rounded-md bg-sky-300" />
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-4 left-[42%] flex h-20 w-16 rotate-[-12deg] items-center justify-center rounded-[1.2rem] border"
        style={{
          background: "rgba(255,255,255,0.86)",
          borderColor: "rgba(255,255,255,0.74)",
        }}
      >
        <div className="text-center">
          <div
            className="text-[10px] font-black uppercase tracking-[0.22em]"
            style={{ color: "var(--accent)" }}
          >
            PDF
          </div>
          <div className="mt-2 h-1 w-8 rounded-full bg-orange-200" />
          <div className="mt-2 h-1 w-6 rounded-full bg-orange-100" />
          <div className="mt-2 h-1 w-8 rounded-full bg-orange-100" />
        </div>
      </div>

      <div className="absolute bottom-11 left-[11%] h-4 w-4 rotate-45 rounded-sm bg-orange-400" />
      <div className="absolute bottom-6 left-[16%] h-3 w-3 rotate-12 rounded-sm bg-orange-300" />
    </div>
  );
}

export default function AuthLayout({
  title,
  description,
  rightTitle,
  rightDescription,
  goBackTo,
  goBackLabel,
  children,
  footer,
}) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="mx-auto grid min-h-screen lg:h-full max-w-[100%] lg:grid-cols-[0.6fr_0.4fr]">
        <section
          className="flex items-center justify-center px-6 py-6 sm:px-10 lg:px-14 overflow-y-auto h-full"
          style={{
            background: isDark
              ? "linear-gradient(180deg, #141414 0%, #191919 100%)"
              : "#ffffff",
          }}
        >
          <div className="w-full max-w-[560px] -mt-10 lg:-mt-16">
            <div className="mx-auto max-w-[480px]">
              {goBackTo ? (
                <div className="mb-4">
                  <Link
                    to={goBackTo}
                    className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide transition hover:opacity-70"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span aria-hidden="true">&larr;</span>
                    <span>{goBackLabel || t("common.goBack", "Go back")}</span>
                  </Link>
                </div>
              ) : null}

              <div className="mb-5 text-center">
                <Link to="/" className="inline-flex items-center gap-2">
                  <span className="brand-wordmark text-4xl inline-flex items-center gap-3">
                    <img
                      src="/logo.png"
                      alt="Constant PDF logo"
                      className="h-10 w-10 object-contain"
                    />
                    Constant<span className="brand-wordmark-pdf">PDF</span>
                  </span>
                </Link>
              </div>

              <div className="space-y-5">
                <div className="text-center">
                  <h1 className="text-3xl font-display font-extrabold tracking-tight text-[var(--text)]">
                    {title}
                  </h1>
                  {description ? (
                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-muted)]">
                      {description}
                    </p>
                  ) : null}
                </div>

                <AuthSocialButtons />
                {children}
                {footer}
              </div>
            </div>
          </div>
        </section>

        <aside
          className="hidden lg:flex flex-col justify-center px-16 py-10 overflow-y-auto h-full"
          style={{
            background: isDark
              ? "linear-gradient(180deg, #212121 0%, #1c1c1c 100%)"
              : "var(--bg-subtle)",
          }}
        >
          <AuthIllustration />
          <div className="mx-auto mt-6 max-w-[420px]">
            <h2 className="text-2xl font-display font-extrabold leading-tight text-[var(--text)]">
              {rightTitle || t("auth.rightPanelTitle", "Everything you need for PDFs")}
            </h2>

            <div className="mt-6 space-y-3">
              {t("auth.rightPanelTools", [
                "Merge PDF",
                "Split PDF",
                "Compress PDF",
                "PDF to Word",
                "OCR Documents",
                "Protect PDFs",
              ]).map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-[16px]"
                  style={{ color: "var(--text)" }}
                >
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(249,83,14,.12)",
                      color: "var(--accent)",
                    }}
                  >
                    ✓
                  </div>

                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p
              className="mt-6 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              {rightDescription || "No installation required."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
