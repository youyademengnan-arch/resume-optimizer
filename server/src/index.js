import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import optimizeRouter from './routes/optimize.js'
import { usageMap } from './store.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '50kb' }))

app.use('/api/optimize', (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  const today = new Date().toDateString()
  const key = `${ip}_${today}`

  const count = usageMap.get(key) || 0
  if (count >= 10) {
    return res.status(429).json({ error: '今日请求次数已达上限，请明天再试' })
  }

  req._usageKey = key
  next()
})

app.use('/api/optimize', optimizeRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
