import { Download, CheckCircle2, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResultCard({
  title,
  description,
  downloadUrl,
  nextSteps = [],
}) {
  return (
    <div className="animate-slide-up text-center">
      <div
        className="mx-auto max-w-2xl rounded-2xl border p-8 sm:p-10"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: "var(--accent-light)",
            color: "var(--accent)",
          }}
        >
          <CheckCircle2 size={42} />
        </div>

        <h2
          className="hero-display-title text-3xl sm:text-4xl"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h2>

        <p
          className="mx-auto mt-3 max-w-lg text-sm sm:text-base"
          style={{ color: "var(--text-muted)" }}
        >
          {description}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={downloadUrl}
            className="btn-primary min-w-[240px] justify-center px-8 py-4 text-base"
            download
          >
            <Download size={18} />
            Download PDF
          </a>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-secondary min-w-[240px] justify-center px-8 py-4 text-base"
          >
            <RotateCcw size={18} />
            Merge more PDFs
          </button>
        </div>

        {nextSteps.length ? (
          <div
            className="mt-10 border-t pt-6"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="mb-4 text-xs font-display font-bold uppercase tracking-wide"
              style={{ color: "var(--text-muted)" }}
            >
              You may also like
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {nextSteps.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="rounded-xl border px-4 py-3 text-sm font-medium transition-all hover:-translate-y-0.5"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg-subtle)",
                    color: "var(--text)",
                  }}
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
