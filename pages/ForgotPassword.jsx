import { useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, Mail } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import AuthLayout from "../components/AuthLayout";
import { useLanguage } from "../hooks/useLanguage";
import { auth } from "../utils/firebase";

function getResetErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/user-not-found":
      return "If an account exists for this email, a reset link has been sent.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a little and try again.";
    default:
      return "We could not send the reset email right now. Please try again.";
  }
}

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setEmailError("");
    setSuccessMessage("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setEmailError("Enter the email address linked to your account.");
      return;
    }

    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      setSuccessMessage(
        "Reset email sent. Please check your inbox and spam folder for the password reset link.",
      );
    } catch (error) {
      setEmailError(getResetErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      goBackTo="/login"
      goBackLabel={t("auth.goBackToLogin", "Go back to login")}
      title={t("auth.forgotTitle", "Forgot your password?")}
      description={t("auth.forgotDescription", "Enter your email and we will send you a reset link.")}
      rightTitle={t("auth.forgotRightTitle", "Get back into your workspace")}
      rightDescription={t("auth.forgotRightDescription", "Reset your password and continue working with your PDFs without losing your flow.")}
      footer={
        <p className="text-center text-[15px] text-[var(--text)]">
          {t("auth.remembered", "Remembered it?")}{" "}
          <Link
            to="/login"
            className="font-semibold text-[var(--accent)] underline underline-offset-2 hover:opacity-80"
          >
            {t("auth.goBackToLogin", "Go back to login")}
          </Link>
        </p>
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
              onChange={(event) => {
                setEmail(event.target.value);
                if (emailError) setEmailError("");
                if (successMessage) setSuccessMessage("");
              }}
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
          {successMessage ? (
            <p className="mt-2 text-sm" style={{ color: "#16a34a" }}>
              {successMessage}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mx-auto block min-w-[170px] rounded-xl px-8 py-3 text-[1.05rem] font-semibold text-white transition duration-200 hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-80"
          style={{ background: "var(--accent)" }}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {isSubmitting ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : null}
            {isSubmitting
              ? t("auth.sending", "Sending...")
              : t("auth.sendResetLink", "Send reset link")}
          </span>
        </button>
      </form>
    </AuthLayout>
  );
}
