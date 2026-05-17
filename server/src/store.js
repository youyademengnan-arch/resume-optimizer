// In-memory rate limiting store
export const usageMap = new Map()

// Clean up old entries every hour
setInterval(() => {
  const today = new Date().toDateString()
  for (const key of usageMap.keys()) {
    if (!key.endsWith(today)) usageMap.delete(key)
  }
}, 3600000)
