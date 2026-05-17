export default function OptimizeButton({ onClick, loading, disabled, remaining }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl
                   hover:bg-blue-700 active:scale-[0.98]
                   disabled:bg-slate-300 disabled:cursor-not-allowed disabled:active:scale-100
                   transition-all duration-200 shadow-sm hover:shadow-md
                   flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            正在优化中...
          </>
        ) : (
          <>
            <span className="text-lg">✨</span>
            AI 智能优化
          </>
        )}
      </button>
      {remaining === 0 && !loading && (
        <p className="text-xs text-slate-400">今日免费次数已用完，明天自动重置</p>
      )}
    </div>
  )
}
