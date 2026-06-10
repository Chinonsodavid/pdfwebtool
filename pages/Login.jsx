import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import AuthLayout from "../components/AuthLayout";
import { useLanguage } from "../hooks/useLanguage";
import { auth } from "../utils/firebase";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getLoginErrorMessages(error) {
  switch (error?.code) {
    case "auth/invalid-email":
      return { email: "Enter a valid email address.", password: "" };
    case "auth/user-disabled":
      return { email: "This account has been disabled.", password: "" };
    case "auth/user-not-found":
      return { email: "No account was found with this email.", password: "" };
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return { email: "", password: "Incorrect email or password." };
    case "auth/too-many-requests":
      return {
        email: "",
        password: "Too many attempts. Please wait a little and try again.",
      };
    default:
      return { email: "", password: "We could not log you in right now." };
  }
}

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setEmailError("Enter your email address.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    if (!password) {
      setPasswordError("Enter your password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password,
      );

      if (!credential.user.emailVerified) {
        await signOut(auth);
        setEmailError(
          "Please verify your email address. Check your inbox and spam folder.",
        );
        return;
      }

      navigate("/tools");
    } catch (error) {
      const nextErrors = getLoginErrorMessages(error);
      setEmailError(nextErrors.email);
      setPasswordError(nextErrors.password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      mode="login"
      goBackTo="/"
      title={t("auth.loginTitle", "Login to your account")}
      rightTitle={t("auth.loginRightTitle", "Log in to your workspace")}
      rightDescription={t("auth.loginRightDescription", "Enter your email and password to access your ConstantPDF account. You are one step closer to boosting your document productivity.")}
      footer={
        <>
          <p className="text-center text-[15px] text-[var(--text)]">
            {t("auth.noAccount", "Don't have an account?")}{" "}
            <Link
              to="/signup"
              className="font-semibold text-[var(--accent)] underline underline-offset-2 hover:opacity-80"
            >
              {t("auth.createAccount", "Create an account")}
            </Link>
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="email"
              placeholder={t("auth.enterEmail", "Enter your email")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              autoComplete="email"
              className="w-full rounded-lg border py-3.5 pl-11 pr-4 text-lg outline-none transition duration-200 focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                borderColor: emailError ? "#ef4444" : "var(--border)",
                background: "var(--bg-card)",
                color: "var(--text)",
              }}
            />
          </div>
          {emailError ? (
            <p className="mt-2 text-sm" style={{ color: "#ef4444" }}>
              {emailError}
            </p>
          ) : null}
        </div>

        <div>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.password", "Password")}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              autoComplete="current-password"
              className="w-full rounded-lg border py-3.5 pl-11 pr-12 text-lg outline-none transition duration-200 focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                borderColor: passwordError ? "#ef4444" : "var(--border)",
                background: "var(--bg-card)",
                color: "var(--text)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 items-center justify-center transition hover:scale-105"
              style={{ color: "var(--text-muted)" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {passwordError ? (
            <p className="mt-2 text-sm" style={{ color: "#ef4444" }}>
              {passwordError}
            </p>
          ) : null}
        </div>

        <div className="pt-1 text-center">
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-[var(--accent)] underline underline-offset-2 hover:opacity-80"
          >
            {t("auth.forgotPassword", "Forgot your password?")}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mx-auto block min-w-[128px] rounded-xl px-8 py-3 text-[1.05rem] font-semibold text-white transition duration-200 hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-80"
          style={{
            background: "var(--accent)",
          }}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {isSubmitting ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : null}
            {isSubmitting
              ? t("auth.loggingIn", "Logging in...")
              : t("auth.logIn", "Log in")}
          </span>
        </button>
      </form>
    </AuthLayout>
  );
}
