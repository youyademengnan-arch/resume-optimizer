import { useState, useCallback } from 'react'

export default function useOptimize() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const optimize = useCallback(async ({ resume, jobDesc, industry }) => {
    setLoading(true)
    setError(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/optimize' : 'https://resume-optimizer-api-uuit.onrender.com/api/optimize')
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDesc, industry })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '请求失败，请稍后重试')
        return null
      }

      return data
    } catch (err) {
      setError('网络错误，请检查网络后重试')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { optimize, loading, error }
}
