import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { api, withApiBase } from "../utils/api";
import FileDropzone from "./FileDropzone";
import ResultCard from "./ResultCard";
import ProcessingSpinner from "./ProcessingSpinner";
import { siteInfo } from "../data/siteContent";

function TextField({ field, value, onChange, t }) {
  const currentValue =
    value !== undefined ? value : field.defaultValue ?? (field.type === "checkbox" ? false : "");

  if (field.type === "select") {
    return (
      <select
        className="tool-input"
        value={currentValue}
        onChange={(event) => onChange(field.name, event.target.value)}
      >
        {(field.options || []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={Boolean(currentValue)}
          onChange={(event) => onChange(field.name, event.target.checked)}
        />
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {t("tool.enable", "Enable")}
        </span>
      </label>
    );
  }

  if (field.type === "file") {
    return (
      <input
        className="tool-input"
        type="file"
        accept={field.accept}
        onChange={(event) => onChange(field.name, event.target.files?.[0] || null)}
      />
    );
  }

  return (
    <input
      className="tool-input"
      type={field.type || "text"}
      value={currentValue}
      min={field.min}
      max={field.max}
      step={field.step}
      required={field.required}
      placeholder={field.placeholder}
      onChange={(event) => onChange(field.name, event.target.value)}
    />
  );
}

export default function ToolPage({
  title,
  description,
  endpoint,
  accept,
  multiple = false,
  fields = [],
  buildPayload,
  successMessage,
  nextSteps = [],
  seoLanding,
  help,
}) {
  const { t } = useLanguage();
  const [files, setFiles] = useState([]);
  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayTitle = seoLanding?.title || title;
  const displayDescription = seoLanding?.description || description;

  const uploadLabels = useMemo(
    () => ({
      selectLabel: t("tool.selectPdf", "Select PDF file"),
      dropLabel: multiple
        ? t("tool.dragFiles", "or drag and drop files here")
        : t("tool.dragFile", "or drag and drop file here"),
    }),
    [multiple, t],
  );

  const faqItems = seoLanding?.faq?.length
    ? [...seoLanding.faq, ...(help?.faq || [])]
    : help?.faq || [];

  function updateValue(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!files.length) {
      setError(
        multiple
          ? t("tool.chooseOneFile", "Choose at least one file before continuing.")
          : t("tool.chooseFile", "Choose a file before continuing."),
      );
      return;
    }

    const formData = new FormData();
    const selectedFiles = Array.from(files);

    if (multiple) {
      selectedFiles.forEach((file) => formData.append("files", file));
    } else {
      formData.append("file", selectedFiles[0]);
    }

    if (buildPayload) {
      buildPayload({ formData, values, files: selectedFiles });
    } else {
      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length && value[0] instanceof File) {
          value.forEach((file) => formData.append(key, file));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "boolean") {
          formData.append(key, String(value));
        } else if (value !== "" && value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
    }

    setIsSubmitting(true);

    try {
      const { data } = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult({
        title: t("tool.complete", "{title} complete", { title }),
        description:
          successMessage?.(data) || t("tool.readyDownload", "Your processed file is ready to download."),
        downloadUrl: withApiBase(data.url),
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (submitError) {
      setError(
          submitError.response?.data?.error ||
          submitError.message ||
          t("tool.requestFailed", "Request failed."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <section className="mx-auto max-w-5xl space-y-6 py-4 text-center sm:py-8">
        {result ? (
          <div className="sticky top-20 z-20 animate-slide-up">
            <ResultCard {...result} nextSteps={nextSteps} />
          </div>
        ) : null}

        <div className="space-y-3">
          <h1
            className="hero-display-title text-3xl leading-tight sm:text-5xl"
            style={{ color: "var(--text)" }}
          >
            {displayTitle}
          </h1>

          <p
            className="mx-auto max-w-2xl text-sm leading-relaxed sm:text-base"
            style={{ color: "var(--text-muted)" }}
          >
            {displayDescription}
          </p>

          <p
            className="mx-auto max-w-2xl text-xs sm:text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {t("tool.filesSecure", "Files are processed over HTTPS and temporary uploads and results are scheduled for cleanup after {fileRetention}.", { fileRetention: siteInfo.fileRetention })}
          </p>
        </div>

        <form className="tool-panel" onSubmit={handleSubmit}>
          <FileDropzone
            files={files}
            onChange={(nextFiles) => setFiles(Array.from(nextFiles || []))}
            accept={accept}
            multiple={multiple}
            selectLabel={uploadLabels.selectLabel}
            dropLabel={uploadLabels.dropLabel}
          />

          {files.length && fields.length ? (
            <section className="tool-section">
              <div className="tool-section-heading">
                <div>
                  <h2 className="section-title">{t("tool.setOptions", "Set options")}</h2>

                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t("tool.defaultsHelp", "Defaults work for most files. Adjust only what you need.")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <label
                    key={field.name}
                    className={
                      field.fullWidth ? "sm:col-span-2 space-y-2" : "space-y-2"
                    }
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {field.label}
                    </span>

                    <TextField
                      field={field}
                      value={values[field.name]}
                      onChange={updateValue}
                      t={t}
                    />

                    {field.helpText ? (
                      <span
                        className="text-xs block"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {field.helpText}
                      </span>
                    ) : null}
                  </label>
                ))}
              </div>
            </section>
          ) : null}

          {files.length ? (
            <div className="tool-submit-row justify-center">
              <button
                className="btn-primary justify-center px-8 py-4 text-base sm:text-lg"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("tool.processing", "Processing...") : title}
              </button>

              {isSubmitting ? <ProcessingSpinner /> : null}
            </div>
          ) : null}

          {error ? (
            <div
              className="rounded-xl px-4 py-3 text-sm flex items-start gap-2"
              style={{
                background: "rgba(239,68,68,0.08)",
                color: "#b91c1c",
              }}
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}
        </form>

        {help ? (
          <section className="open-section mt-8 grid gap-5 pt-8 lg:grid-cols-3">
            <div className="card p-4 sm:p-6 space-y-3">
              <h2 className="section-title text-2xl">{t("tool.aboutTool", "About this tool")}</h2>

              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {help.intro}
              </p>
            </div>

            <div className="card p-4 sm:p-6 space-y-3">
              <h2 className="section-title text-2xl">{t("tool.steps", "Steps")}</h2>

              <ol className="space-y-2 list-decimal pl-5">
                {help.steps.map((step) => (
                  <li
                    key={step}
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="card p-4 sm:p-6 space-y-3">
              <h2 className="section-title text-2xl">{t("tool.tips", "Tips")}</h2>

              <ul className="space-y-2 list-disc pl-5">
                {help.tips.map((tip) => (
                  <li
                    key={tip}
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-4 sm:p-6 space-y-4 lg:col-span-3">
              <h2 className="section-title text-2xl">{t("tool.commonQuestions", "Common questions")}</h2>

              <div className="space-y-3">
                {faqItems.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-xl border px-4 py-3"
                    style={{
                      borderColor: "var(--border)",
                    }}
                  >
                    <summary
                      className="cursor-pointer list-none font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {item.question}
                    </summary>

                    <p
                      className="mt-3 text-sm leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </section>
    </div>
  );
}
