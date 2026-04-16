import { ChevronDown } from 'lucide-react'

export default function FAQAccordion({ items = [] }) {
  if (!items.length) return null

  return (
    <div className="faq-list">
      {items.map(([question, answer]) => (
        <details key={question} className="faq-item">
          <summary className="faq-summary">
            <span>{question}</span>
            <ChevronDown size={18} className="faq-icon" />
          </summary>
          <p className="faq-answer">{answer}</p>
        </details>
      ))}
    </div>
  )
}
