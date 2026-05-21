import { useState } from "react";
import { ChevronDown } from "lucide-react";

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

export default function FaqSection() {
  return (
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
            <h1
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 800,
                color: "var(--text)",
                margin: "0.25rem 0 0",
                lineHeight: 1.2,
              }}
            >
              Everything you need to know
            </h1>
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
  );
}
