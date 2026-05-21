import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Check,
  Zap,
  Crown,
  Repeat,
} from "lucide-react";
import { toolGroups, tools } from "../utils/toolCatalog";

/* ─── Tool access lists ──────────────────────────────────────────────── */
const popularToolIds = [
  "merge",
  "compress",
  "pdf-to-word",
  "word-to-pdf",
  "edit",
  "sign",
  "protect",
  "ocr",
];
const popularTools = popularToolIds
  .map((id) => tools.find((t) => t.id === id))
  .filter(Boolean);

/* Premium tools  subscription required */
const premiumToolIds = new Set([
  "pdf-to-word",
  "pdf-to-excel",
  "excel-to-pdf",
  "powerpoint-to-pdf",
  "pdf-to-powerpoint",
  "ocr",
  "watermark",
  "edit",
  "page-labels",
  "crop",
  "metadata",
  "batch",
]);

const faqs = [
  {
    q: "Are my files stored permanently?",
    a: "No. Uploaded and generated files are temporary and scheduled for cleanup after 30 minutes. We never retain your documents beyond that window.",
  },
  {
    q: "Which tools are completely free?",
    a: "14 tools are always free with no signup: Merge, Split, Compress, Rotate, Image to PDF, PDF to Image, Reorder Pages, Extract Pages, Add/Remove Pages, Word to PDF, PDF to Text, Protect PDF, Unlock PDF, and Sign PDF.",
  },
  {
    q: "What do premium tools include?",
    a: "Premium unlocks PDF to Word, PDF to Excel, Excel to PDF, PowerPoint to PDF, PDF to PowerPoint, OCR PDF, Watermark, Edit PDF, Headers & Footers, Crop PDF, Edit Metadata, and Batch Processing.",
  },
  {
    q: "What is the One-Time Pass?",
    a: "For $0.99 you get 24 hours of full premium access  no subscription, no commitment. It's designed for people who just need to convert or edit one document and don't want a recurring plan.",
  },
  {
    q: "Can I unlock any PDF?",
    a: "No. You can only unlock PDFs you own or have explicit permission to modify, and you must supply the current password. We do not support bypassing passwords you don't know.",
  },
  {
    q: "Why are some results downloaded as ZIP files?",
    a: "Tools that produce multiple outputs  such as PDF to image or split PDF  bundle those files into a single ZIP download for convenience.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1.25rem 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            color: "var(--text)",
            lineHeight: 1.45,
          }}
        >
          {q}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: open ? "var(--accent)" : "var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s, transform 0.3s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <ChevronDown
            size={15}
            style={{ color: open ? "#fff" : "var(--text-muted)" }}
          />
        </span>
      </button>
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? "300px" : "0",
          opacity: open ? 1 : 0,
          transition: "max-height 0.35s ease, opacity 0.3s ease",
        }}
      >
        <p
          style={{
            margin: "0 0 1.25rem",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "var(--text-muted)",
            paddingRight: "2.5rem",
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

/* ─── Pricing feature lists ──────────────────────────────────────────── */
const FREE_FEATURES = [
  "Merge, Split & Compress PDFs",
  "Rotate & Reorder pages",
  "Image ↔ PDF conversion",
  "Extract & Add/Remove pages",
  "Word to PDF",
  "Protect, Unlock & Sign PDFs",
  "PDF to Text",
  "No account needed  ever",
];

const PREMIUM_FEATURES = [
  "Everything in Free",
  "PDF → Word, Excel & PowerPoint",
  "Excel & PowerPoint → PDF",
  "OCR scanned documents",
  "Edit PDF text & content",
  "Watermark, Crop & Headers",
  "Edit metadata",
  "Batch process multiple files",
];

const ONETIME_FEATURES = [
  "All 12 premium tools unlocked",
  "24-hour access window",
  "No subscription needed",
  "Instant  no waiting",
  "Perfect for a single document",
];

export default function LandingPage() {
  const [activeGroup, setActiveGroup] = useState("all");
  const [billing, setBilling] = useState("monthly");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") document.documentElement.classList.add("dark");
  }, []);

  const visibleTools =
    activeGroup === "popular"
      ? popularTools
      : activeGroup === "all"
        ? tools
        : tools.filter((t) => t.category === activeGroup);

  return (
    <div className="animate-fade-in">
      {/* ════════ HERO + TOOLS ════════ */}
      <div className="lp-hero-slab bg-shapes">
        <div className="lp-hero-inner">
          <h1 className="lp-hero-title">
            Free Online PDF Tools for Fast
            <br className="hidden sm:block" /> Document Editing &amp; Conversion
          </h1>
          <p className="lp-hero-sub">
            The complete PDF workstation for schools, offices, and freelancers.
            Merge, split, compress, or convert secure OCR and e-signing
            included.
          </p>

          <div className="lp-pills">
            {[
              { id: "all", label: "All PDF Tools" },
              { id: "popular", label: "Popular" },
              ...toolGroups,
            ].map((group) => (
              <button
                key={group.id}
                type="button"
                style={{ cursor: "pointer" }}
                className={
                  activeGroup === group.id
                    ? "category-pill category-pill-active"
                    : "category-pill"
                }
                onClick={() => setActiveGroup(group.id)}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lp-tools-inner">
          <div className="lp-tools-header">
            <div>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--accent)",
                  margin: 0,
                }}
              >
                {activeGroup === "all"
                  ? "All PDF Tools"
                  : activeGroup === "popular"
                    ? "Popular Tools"
                    : toolGroups.find((g) => g.id === activeGroup)?.label}
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
                  fontWeight: 700,
                  color: "var(--text)",
                  margin: "0.1rem 0 0",
                }}
              >
                Choose a tool and get started
              </h2>
            </div>
            <Link
              to="/tools"
              className="btn-secondary"
              style={{
                flexShrink: 0,
                fontSize: "0.8125rem",
                cursor: "pointer",
              }}
            >
              See more <ArrowRight size={14} />
            </Link>
          </div>

          <div className="lp-grid">
            {visibleTools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className="lp-tool-card"
                style={{ cursor: "pointer" }}
              >
                <span
                  className="lp-tool-icon"
                  style={{ background: tool.bg, color: tool.color }}
                >
                  <tool.icon size={18} />
                </span>
                <span className="lp-tool-title">
                  {tool.label}
                  {premiumToolIds.has(tool.id) && (
                    <span
                      style={{
                        marginLeft: "0.4rem",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        padding: "1px 5px",
                        borderRadius: "4px",
                        background: "var(--accent-light)",
                        color: "var(--accent)",
                        verticalAlign: "middle",
                        textTransform: "uppercase",
                      }}
                    >
                      PRO
                    </span>
                  )}
                </span>
                <span className="lp-tool-desc">{tool.desc}</span>
              </Link>
            ))}
          </div>

          {!visibleTools.length && (
            <p
              style={{
                textAlign: "center",
                padding: "3rem 0",
                fontSize: "0.875rem",
                color: "var(--text-muted)",
              }}
            >
              No tools match that filter yet.
            </p>
          )}
        </div>
      </div>
      {/* ════════ end hero slab ════════ */}

      {/* ════════ PRICING ════════ */}
      <section className="lp-pricing bg-shapes">
        <div className="lp-pricing-inner">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent)",
                margin: 0,
              }}
            >
              Pricing
            </p>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
                fontWeight: 800,
                color: "var(--text)",
                lineHeight: 1.12,
                margin: "0.35rem 0 0",
              }}
            >
              Pricing so low you won&apos;t
              <br className="hidden sm:block" /> think twice.
            </h2>
            <p
              style={{
                marginTop: "0.75rem",
                fontSize: "clamp(0.875rem, 2vw, 1.0625rem)",
                color: "var(--text-muted)",
                maxWidth: "32rem",
                margin: "0.75rem auto 0",
              }}
            >
              14 tools are always free no account needed. Upgrade only when you
              need the professional stuff.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1.5rem",
              }}
            >
              <div className="lp-billing-toggle">
                {["monthly", "yearly"].map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => setBilling(plan)}
                    style={{ cursor: "pointer" }}
                    className={`lp-billing-btn ${billing === plan ? "lp-billing-active" : "lp-billing-inactive"}`}
                  >
                    {plan === "monthly" ? "Monthly" : "Yearly"}
                    {plan === "yearly" && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "99px",
                          letterSpacing: "0.03em",
                          background:
                            billing === "yearly"
                              ? "rgba(255,255,255,0.25)"
                              : "var(--accent)",
                          color: "#fff",
                        }}
                      >
                        SAVE 40%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lp-pricing-grid">
            {/* ── FREE ── */}
            <div className="lp-plan-card lp-plan-free">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.25rem",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    width: 28,
                    height: 28,
                    borderRadius: "6px",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-subtle)",
                  }}
                >
                  <Zap size={15} style={{ color: "var(--text-muted)" }} />
                </span>
                <h3
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    margin: 0,
                  }}
                >
                  Free
                </h3>
              </div>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-muted)",
                  margin: "0.2rem 0 0",
                  lineHeight: 1.5,
                }}
              >
                14 tools, always free. No signup, no limits.
              </p>
              <div style={{ margin: "1.25rem 0 0", lineHeight: 1 }}>
                <span
                  style={{
                    fontSize: "2.75rem",
                    fontWeight: 800,
                    color: "var(--text)",
                  }}
                >
                  $0
                </span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-muted)",
                    marginLeft: "0.3rem",
                  }}
                >
                  forever
                </span>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "1.25rem 0 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.55rem",
                }}
              >
                {FREE_FEATURES.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      fontSize: "0.8375rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.45,
                    }}
                  >
                    <Check
                      size={14}
                      style={{
                        color: "var(--text-muted)",
                        flexShrink: 0,
                        marginTop: "0.15rem",
                      }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                style={{
                  marginTop: "1.5rem",
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--bg-subtle)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                Start Using Free Tools
              </button>
            </div>

            {/* ── PREMIUM ── */}
            <div className="lp-plan-card lp-plan-featured lp-plan-premium">
              <div className="lp-plan-badge">MOST POPULAR</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.25rem",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    width: 28,
                    height: 28,
                    borderRadius: "6px",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--accent-light)",
                  }}
                >
                  <Crown size={15} style={{ color: "var(--accent)" }} />
                </span>
                <h3
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    margin: 0,
                  }}
                >
                  Premium
                </h3>
              </div>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-muted)",
                  margin: "0.2rem 0 0",
                  lineHeight: 1.5,
                }}
              >
                For professionals, students &amp; anyone who converts regularly.
              </p>
              <div style={{ margin: "1.25rem 0 0", minHeight: "4rem" }}>
                {billing === "monthly" ? (
                  <>
                    <div style={{ lineHeight: 1 }}>
                      <span
                        style={{
                          fontSize: "2.75rem",
                          fontWeight: 800,
                          color: "var(--text)",
                        }}
                      >
                        $2.99
                      </span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--text-muted)",
                          marginLeft: "0.3rem",
                        }}
                      >
                        /&nbsp;month
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                        margin: "0.3rem 0 0",
                      }}
                    >
                      Billed monthly · cancel anytime
                    </p>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        lineHeight: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "2.75rem",
                            fontWeight: 800,
                            color: "var(--accent)",
                          }}
                        >
                          $4
                        </span>
                        <span
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--text-muted)",
                            marginLeft: "0.3rem",
                          }}
                        >
                          /&nbsp;year
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "0.675rem",
                          fontWeight: 700,
                          padding: "4px 8px",
                          borderRadius: "999px",
                          background: "rgba(255,120,60,0.12)",
                          color: "var(--accent)",
                          letterSpacing: "0.03em",
                          whiteSpace: "nowrap",
                        }}
                        aria-hidden="true"
                      >
                        Limited time
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                        margin: "0.3rem 0 0",
                      }}
                    >
                      That&apos;s $0.33/month · billed once yearly limited time
                      offer
                    </p>
                  </>
                )}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "1.25rem 0 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.55rem",
                }}
              >
                {PREMIUM_FEATURES.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      fontSize: "0.8375rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.45,
                    }}
                  >
                    <Check
                      size={14}
                      style={{
                        color: "var(--accent)",
                        flexShrink: 0,
                        marginTop: "0.15rem",
                      }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                style={{
                  marginTop: "1.5rem",
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--accent-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--accent)")
                }
              >
                {billing === "yearly"
                  ? "Get the Yearly Deal →"
                  : "Upgrade to Premium →"}
              </button>
            </div>

            {/* ── ONE-TIME PASS ── */}
            <div className="lp-plan-card lp-plan-onetime">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.25rem",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    width: 28,
                    height: 28,
                    borderRadius: "6px",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-subtle)",
                  }}
                >
                  <Repeat size={15} style={{ color: "var(--text-muted)" }} />
                </span>
                <h3
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    margin: 0,
                  }}
                >
                  One-Time Pass
                </h3>
              </div>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-muted)",
                  margin: "0.2rem 0 0",
                  lineHeight: 1.5,
                }}
              >
                Just need to convert one doc? Skip the subscription entirely.
              </p>
              <div style={{ margin: "1.25rem 0 0", lineHeight: 1 }}>
                <span
                  style={{
                    fontSize: "2.75rem",
                    fontWeight: 800,
                    color: "var(--text)",
                  }}
                >
                  $0.99
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  margin: "0.3rem 0 0",
                }}
              >
                24 hours of full premium access
              </p>
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "6px",
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border)",
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                💡 Less than a coffee and you only pay once.
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "1rem 0 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.55rem",
                }}
              >
                {ONETIME_FEATURES.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      fontSize: "0.8375rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.45,
                    }}
                  >
                    <Check
                      size={14}
                      style={{
                        color: "var(--text-muted)",
                        flexShrink: 0,
                        marginTop: "0.15rem",
                      }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                style={{
                  marginTop: "1.5rem",
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--bg-subtle)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                Get 24-Hour Access $0.99
              </button>
            </div>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "1.75rem",
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
            }}
          >
            No hidden fees. No auto-renewals on one-time passes. Cancel monthly
            or yearly subscriptions anytime.
          </p>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="lp-faq bg-shapes">
        <div className="lp-faq-inner">
          <div className="lp-faq-header">
            <div>
              <p
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  margin: 0,
                }}
              >
                FAQ
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  fontWeight: 800,
                  color: "var(--text)",
                  margin: "0.25rem 0 0",
                  lineHeight: 1.2,
                }}
              >
                Everything you need to know
              </h2>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)" }}>
            {faqs.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>

          <p
            className="sm:hidden"
            style={{
              marginTop: "1.5rem",
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              textAlign: "center",
            }}
          >
            Still have questions?{" "}
            <a
              href="/contact"
              style={{
                color: "var(--accent)",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Contact support
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
