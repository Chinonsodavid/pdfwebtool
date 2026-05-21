import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { toolGroups, tools } from "../utils/toolCatalog";
import PricingSection from "../components/PricingSection";

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

export default function LandingPage() {
  const [activeGroup, setActiveGroup] = useState("all");

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
      <div className="lp-hero-slab bg-shapes">
        <div className="lp-hero-inner">
          <h1 className="lp-hero-title">
            Free Online PDF Tools for Fast
            <br className="hidden sm:block" /> Document Editing &amp; Conversion
          </h1>
          <p className="lp-hero-sub">
            The complete PDF workstation for schools, offices, and freelancers.
            Merge, split, compress, or convert with secure OCR and e-signing in
            one focused workspace.
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
        </div>
      </div>

      <PricingSection />
    </div>
  );
}
