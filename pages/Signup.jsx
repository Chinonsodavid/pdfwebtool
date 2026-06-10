import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle, Lock, Mail, User } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useLanguage } from "../hooks/useLanguage";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

import { auth } from "../utils/firebase";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function suggestEmailCorrection(value) {
  const normalizedValue = value.trim().toLowerCase();
  const parts = normalizedValue.split("@");

  if (parts.length !== 2) return "";

  const [localPart, domain] = parts;
  const commonDomainTypos = {
    "gamil.com": "gmail.com",
    "gmial.com": "gmail.com",
    "gbail.com": "gmail.com",
    "gmai.com": "gmail.com",
    "gmail.co": "gmail.com",
    "hotnail.com": "hotmail.com",
    "hotmai.com": "hotmail.com",
    "outlok.com": "outlook.com",
    "outllok.com": "outlook.com",
    "yaho.com": "yahoo.com",
    "yhoo.com": "yahoo.com",
    "icloud.co": "icloud.com",
  };

  const correctedDomain = commonDomainTypos[domain];
  if (!correctedDomain) return "";

  return `${localPart}@${correctedDomain}`;
}

function getSignupErrorMessages(error) {
  switch (error?.code) {
    case "auth/invalid-email":
      return {
        name: "",
        email: "Enter a valid email address.",
        password: "",
        form: "",
      };
    case "auth/email-already-in-use":
      return {
        name: "",
        email: "An account with this email already exists.",
        password: "",
        form: "",
      };
    case "auth/weak-password":
      return {
        name: "",
        email: "",
        password: "Password should be at least 6 characters.",
        form: "",
      };
    case "auth/too-many-requests":
      return {
        name: "",
        email: "",
        password: "",
        form: "Too many attempts. Please wait a little and try again.",
      };
    default:
      return {
        name: "",
        email: "",
        password: "",
        form: "We could not create your account right now.",
      };
  }
}

export default function Signup() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setFormError("");
    setSuccessMessage("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    if (!normalizedName) {
      setNameError("Enter your full name.");
      return;
    }

    if (!normalizedEmail) {
      setEmailError("Enter your email address.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    const emailSuggestion = suggestEmailCorrection(normalizedEmail);
    if (emailSuggestion) {
      setEmailError(`Did you mean ${emailSuggestion}?`);
      return;
    }

    if (!password) {
      setPasswordError("Enter a password.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password should be at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password,
      );

      await updateProfile(userCredential.user, {
        displayName: normalizedName,
      });

      await sendEmailVerification(userCredential.user);
      await auth.signOut();
      setSuccessMessage(
        "Account created. Please check your email inbox and spam folder to verify your account before logging in.",
      );
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      const nextErrors = getSignupErrorMessages(error);
      setNameError(nextErrors.name);
      setEmailError(nextErrors.email);
      setPasswordError(nextErrors.password);
      setFormError(nextErrors.form);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      mode="signup"
      goBackTo="/"
      title={t("auth.createTitle", "Create new account")}
      rightTitle={t("auth.createRightTitle", "PDF tools for productive people")}
      rightDescription={t("auth.createRightDescription", "Create your account to keep your PDF workflow organized, fast, and easy to access from one place.")}
      footer={
        <>
          <p className="text-center text-[15px] text-[var(--text)]">
            {t("auth.alreadyMember", "Already a member?")}{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--accent)] underline underline-offset-2 hover:opacity-80"
            >
              {t("auth.logIn", "Log in")}
            </Link>
          </p>
          <p className="text-center text-xs leading-relaxed text-[var(--text-muted)]">
            {t("auth.termsNotice", "By creating an account, you agree to our Terms of Service and Privacy Policy.")}
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder={t("auth.name", "Name")}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError("");
                if (formError) setFormError("");
                if (successMessage) setSuccessMessage("");
              }}
              autoComplete="name"
              className="w-full rounded-lg border py-3.5 pl-11 pr-4 text-lg outline-none transition duration-200 focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                borderColor: nameError ? "#ef4444" : "var(--border)",
                background: "var(--bg-card)",
                color: "var(--text)",
              }}
            />
          </div>
          {nameError ? (
            <p className="mt-2 text-sm" style={{ color: "#ef4444" }}>
              {nameError}
            </p>
          ) : null}
        </div>

        <div>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="email"
              placeholder={t("auth.email", "Email")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
                if (formError) setFormError("");
                if (successMessage) setSuccessMessage("");
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
                if (formError) setFormError("");
                if (successMessage) setSuccessMessage("");
              }}
              autoComplete="new-password"
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

        {formError ? (
          <p className="text-sm" style={{ color: "#ef4444" }}>
            {formError}
          </p>
        ) : null}

        {successMessage ? (
          <p className="text-sm" style={{ color: "#16a34a" }}>
            {successMessage}
          </p>
        ) : null}

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
              ? t("auth.creatingAccount", "Creating account...")
              : t("common.signUp", "Sign up")}
          </span>
        </button>
      </form>
    </AuthLayout>
  );
}
