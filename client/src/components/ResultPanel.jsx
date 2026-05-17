import { useMemo } from 'react'

function highlightDiff(text, highlights = []) {
  if (!highlights.length) return text

  const parts = []
  let lastIdx = 0
  const sorted = [...highlights].sort((a, b) => a[0] - b[0])

  for (const [start, end] of sorted) {
    if (start > lastIdx) {
      parts.push(text.slice(lastIdx, start))
    }
    parts.push(
      <mark key={start} className="bg-green-200 text-green-900 rounded px-0.5">
        {text.slice(start, end)}
      </mark>
    )
    lastIdx = end
  }
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx))
  }
  return parts
}

export default function ResultPanel({ original, optimized, highlights }) {
  const highlightedOptimized = useMemo(
    () => highlightDiff(optimized, highlights),
    [optimized, highlights]
  )

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">
          原始简历
        </h3>
        <pre className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-sans">
          {original}
        </pre>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-green-200 ring-1 ring-green-100 p-5">
        <h3 className="text-sm font-semibold text-green-600 mb-3 uppercase tracking-wide">
          优化后简历
        </h3>
        <pre className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap font-sans">
          {highlightedOptimized}
        </pre>
      </div>
    </div>
  )
}
