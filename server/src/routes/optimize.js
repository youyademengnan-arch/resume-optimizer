import { Router } from 'express'
import { optimizeResume } from '../services/ai.js'
import { usageMap } from '../store.js'

const router = Router()

router.post('/', async (req, res) => {
  const { resume, jobDesc, industry } = req.body

  if (!resume || !jobDesc) {
    return res.status(400).json({ error: '请提供简历内容和职位描述' })
  }

  if (resume.length < 50) {
    return res.status(400).json({ error: '简历内容过短，请提供更完整的简历' })
  }

  if (jobDesc.length < 30) {
    return res.status(400).json({ error: '职位描述过短，请提供更详细的JD' })
  }

  if (resume.length > 20000 || jobDesc.length > 10000) {
    return res.status(400).json({ error: '内容过长，简历不超过20000字，JD不超过10000字' })
  }

  try {
    const result = await optimizeResume(resume, jobDesc, industry)

    // Increment usage counter
    const count = usageMap.get(req._usageKey) || 0
    usageMap.set(req._usageKey, count + 1)

    res.json(result)
  } catch (err) {
    console.error('Optimize error:', err.message)
    res.status(500).json({ error: '优化失败：' + err.message })
  }
})

export default router
