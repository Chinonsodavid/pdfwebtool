import { useState } from "react";
import { Check, Crown, Repeat, Zap } from "lucide-react";

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

export default function PricingSection() {
  const [billing, setBilling] = useState("monthly");

  return (
    <section id="pricing" className="lp-pricing bg-shapes">
      <div className="lp-pricing-inner">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4.5vw, 4rem)",
              fontWeight: 800,
              color: "var(--text)",
              lineHeight: 1.12,
              margin: "0.55rem 0 0",
            }}
          >
            Pricing
          </h1>
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
          No hidden fees. No auto-renewals on one-time passes. Cancel monthly or
          yearly subscriptions anytime.
        </p>
      </div>
    </section>
  );
}
