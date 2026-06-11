import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Bug,
  Mail,
  MessageSquareText,
  Send,
  ShieldAlert,
  User,
} from "lucide-react";
import { siteInfo } from "../data/siteContent";
import { useLanguage } from "../hooks/useLanguage";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const issueTypes = [
  { value: "complaint", label: "Complaint" },
  { value: "bug-report", label: "Bug report" },
  { value: "billing", label: "Billing issue" },
  { value: "account", label: "Account support" },
  { value: "business", label: "Business enquiry" },
];

export default function ContactPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issueType, setIssueType] = useState("complaint");
  const [message, setMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setNameError("");
    setEmailError("");
    setMessageError("");
    setSuccessMessage("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim();
    const normalizedMessage = message.trim();

    if (!normalizedName) {
      setNameError("Enter your name.");
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

    if (!normalizedMessage) {
      setMessageError("Describe what happened or what you need help with.");
      return;
    }

    if (normalizedMessage.length < 20) {
      setMessageError("Please add a little more detail so support can help properly.");
      return;
    }

    const selectedIssue =
      t(`contact.issueTypes.${issueType}`, issueTypes.find((item) => item.value === issueType)?.label || "Support");
    const subject = `${siteInfo.name} ${selectedIssue} - ${normalizedName}`;
    const body = [
      `Name: ${normalizedName}`,
      `Email: ${normalizedEmail}`,
      `Issue type: ${selectedIssue}`,
      "",
      "Message:",
      normalizedMessage,
      "",
      "Browser:",
      "",
      "Tool used (if any):",
      "",
      "Screenshot or steps to reproduce (optional):",
    ].join("\n");

    const mailtoLink = `mailto:${siteInfo.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
    setSuccessMessage(
      t("contact.success", "Your email app is opening with your support message. Send it there to reach ConstantPDF support."),
    );
  };

  return (
    <div id="contact" className="mx-auto max-w-6xl animate-fade-in px-4 py-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide transition hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
        >
          <span aria-hidden="true">&larr;</span>
          <span>{t("common.goBack", "Go back")}</span>
        </Link>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <p
              className="text-sm font-display font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--accent)" }}
            >
              {t("contact.eyebrow", "Contact Support")}
            </p>
            <h1 className="page-title text-4xl md:text-5xl">
              {t("contact.title", "Contact us for personalised support")}
            </h1>
            <p
              className="max-w-2xl text-lg leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {t("contact.description", "Send a complaint, report a bug, or ask for help with your account or PDF workflow. The more detail you share, the faster we can help.")}
            </p>
          </div>

          <div
            className="rounded-[28px] border p-5 sm:p-6"
            style={{
              borderColor: "var(--border)",
              background: "color-mix(in srgb, var(--bg-card) 92%, transparent)",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {t("contact.name", "Your Name")}
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      if (nameError) setNameError("");
                      if (successMessage) setSuccessMessage("");
                    }}
                    placeholder={t("contact.namePlaceholder", "Your name")}
                    className="w-full rounded-2xl border py-4 pl-11 pr-4 text-base outline-none transition duration-200 focus:ring-2 focus:ring-[var(--accent)]"
                    style={{
                      borderColor: nameError ? "#ef4444" : "var(--border)",
                      background: "var(--bg)",
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
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {t("contact.email", "Your Email")}
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (emailError) setEmailError("");
                      if (successMessage) setSuccessMessage("");
                    }}
                    placeholder={t("contact.emailPlaceholder", "your@email.com")}
                    className="w-full rounded-2xl border py-4 pl-11 pr-4 text-base outline-none transition duration-200 focus:ring-2 focus:ring-[var(--accent)]"
                    style={{
                      borderColor: emailError ? "#ef4444" : "var(--border)",
                      background: "var(--bg)",
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
                <label
                  htmlFor="contact-issue-type"
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {t("contact.issueType", "Issue Type")}
                </label>
                <select
                  id="contact-issue-type"
                  value={issueType}
                  onChange={(event) => setIssueType(event.target.value)}
                  className="w-full rounded-2xl border px-4 py-4 text-base outline-none transition duration-200 focus:ring-2 focus:ring-[var(--accent)]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg)",
                    color: "var(--text)",
                  }}
                >
                  {issueTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {t(`contact.issueTypes.${item.value}`, item.label)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {t("contact.message", "Your Message")}
                </label>
                <div className="relative">
                  <MessageSquareText
                    size={18}
                    className="absolute left-4 top-5"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(event) => {
                      setMessage(event.target.value);
                      if (messageError) setMessageError("");
                      if (successMessage) setSuccessMessage("");
                    }}
                    placeholder={t("contact.messagePlaceholder", "Tell us what happened, what tool you used, and how we can help.")}
                    rows={7}
                    className="w-full rounded-2xl border py-4 pl-11 pr-4 text-base outline-none transition duration-200 focus:ring-2 focus:ring-[var(--accent)]"
                    style={{
                      borderColor: messageError ? "#ef4444" : "var(--border)",
                      background: "var(--bg)",
                      color: "var(--text)",
                      resize: "vertical",
                    }}
                  />
                </div>
                {messageError ? (
                  <p className="mt-2 text-sm" style={{ color: "#ef4444" }}>
                    {messageError}
                  </p>
                ) : null}
              </div>

              {successMessage ? (
                <p className="text-sm" style={{ color: "#16a34a" }}>
                  {successMessage}
                </p>
              ) : null}

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: "var(--accent)" }}
              >
                <Send size={16} />
                {t("contact.sendComplaint", "Send complaint")}
              </button>
            </form>
          </div>
        </div>

        <aside className="space-y-4">
          <div
            className="rounded-[28px] border p-6"
            style={{
              borderColor: "var(--border)",
              background: "color-mix(in srgb, var(--bg-card) 92%, transparent)",
            }}
          >
            <div
              className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                color: "var(--accent)",
              }}
            >
              <ShieldAlert size={22} />
            </div>
            <h2 className="section-title text-2xl">{t("contact.beforeYouSend", "Before you send")}</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t("contact.beforeSendBullets", [
                "Include the tool name, the file type, and what happened just before the issue appeared.",
                "For bugs, mention your browser and device so support can reproduce the problem faster.",
                "Do not send highly sensitive documents unless you are comfortable sharing them.",
              ]).map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>

          <div
            className="rounded-[28px] border p-6"
            style={{
              borderColor: "var(--border)",
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--bg-card) 96%, transparent) 0%, color-mix(in srgb, var(--accent) 8%, var(--bg-card)) 100%)",
            }}
          >
            <h2 className="section-title text-2xl">{t("contact.supportOptions", "Support options")}</h2>
            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-[var(--accent)]">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    {t("contact.emailSupport", "Email support")}
                  </p>
                  <a
                    href={`mailto:${siteInfo.contactEmail}`}
                    className="text-sm hover:underline"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {siteInfo.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-[var(--accent)]">
                  <Bug size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    {t("contact.bugReports", "Bug reports")}
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {t("contact.bugReportsText", "Best for upload issues, conversion failures, broken previews, or download problems.")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-[var(--accent)]">
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    {t("contact.helpResources", "Help resources")}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-3 text-sm">
                    <Link to="/faq" className="hover:underline" style={{ color: "var(--text-muted)" }}>
                      FAQ
                    </Link>
                    <Link to="/guides" className="hover:underline" style={{ color: "var(--text-muted)" }}>
                      Guides
                    </Link>
                    <Link to="/file-handling" className="hover:underline" style={{ color: "var(--text-muted)" }}>
                      File handling
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
