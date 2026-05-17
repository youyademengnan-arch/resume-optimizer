import { useState, useCallback } from 'react'
import ResumeInput from './components/ResumeInput'
import JobInput from './components/JobInput'
import OptimizeButton from './components/OptimizeButton'
import ResultPanel from './components/ResultPanel'
import ExportButton from './components/ExportButton'
import useOptimize from './hooks/useOptimize'

const DAILY_LIMIT = 3

function getUsage() {
  try {
    const data = JSON.parse(localStorage.getItem('resume_usage') || '{}')
    const today = new Date().toDateString()
    if (data.date !== today) return { date: today, count: 0 }
    return data
  } catch {
    return { date: new Date().toDateString(), count: 0 }
  }
}

function saveUsage(usage) {
  localStorage.setItem('resume_usage', JSON.stringify(usage))
}

export default function App() {
  const [resume, setResume] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [industry, setIndustry] = useState('')
  const [result, setResult] = useState(null)
  const { optimize, loading, error } = useOptimize()
  const [usage, setUsage] = useState(getUsage)
  const [copied, setCopied] = useState(false)

  const remaining = DAILY_LIMIT - usage.count

  const handleOptimize = useCallback(async () => {
    if (!resume.trim() || !jobDesc.trim()) return
    if (remaining <= 0) return

    const data = await optimize({ resume: resume.trim(), jobDesc: jobDesc.trim(), industry })
    if (data) {
      setResult(data)
      const next = { date: usage.date, count: usage.count + 1 }
      setUsage(next)
      saveUsage(next)
    }
  }, [resume, jobDesc, industry, remaining, optimize, usage])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <h1 className="text-xl font-bold text-slate-800">AI 简历优化</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">
              今日剩余 <strong className={remaining <= 1 ? 'text-red-500' : 'text-blue-600'}>{remaining}</strong> 次
            </span>
            {remaining === 0 && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">已达上限</span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!result ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <ResumeInput value={resume} onChange={setResume} />
              <JobInput value={jobDesc} onChange={setJobDesc} industry={industry} onIndustryChange={setIndustry} />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <OptimizeButton
              onClick={handleOptimize}
              loading={loading}
              disabled={!resume.trim() || !jobDesc.trim() || remaining <= 0}
              remaining={remaining}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setResult(null)}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              &larr; 返回重新优化
            </button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-slate-800">优化结果</h2>
                {result.score != null && (
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    匹配度 +{result.score}%
                  </span>
                )}
              </div>
              <ExportButton text={result.optimized} copied={copied} setCopied={setCopied} />
            </div>

            <ResultPanel original={resume} optimized={result.optimized} highlights={result.highlights} />

            {result.tips && result.tips.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-amber-800 mb-2">优化建议</h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-amber-700">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-sm text-slate-400">
        AI 简历优化工具 · 保护你的隐私，数据不会存储
      </footer>
    </div>
  )
}
