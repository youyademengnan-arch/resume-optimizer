import { buildPrompt } from '../prompts/resume.js'

const PROVIDER = process.env.AI_PROVIDER || 'claude'
const CLAUDE_KEY = process.env.ANTHROPIC_API_KEY
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error: ${res.status}`)
  }

  const data = await res.json()
  return data.content[0].text
}

async function callDeepSeek(prompt) {
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096
    })
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error: ${res.status}`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}

function parseAIResponse(text) {
  // Try to extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0])
    } catch { /* fall through */ }
  }

  // Fallback: treat whole text as optimized resume
  return {
    optimized: text,
    score: null,
    highlights: [],
    tips: []
  }
}

export async function optimizeResume(resume, jobDesc, industry) {
  const prompt = buildPrompt(resume, jobDesc, industry)

  let responseText

  if (PROVIDER === 'deepseek' && DEEPSEEK_KEY) {
    responseText = await callDeepSeek(prompt)
  } else if (CLAUDE_KEY) {
    responseText = await callClaude(prompt)
  } else {
    throw new Error('未配置 AI API Key，请在 server/.env 中设置 ANTHROPIC_API_KEY 或 DEEPSEEK_API_KEY')
  }

  return parseAIResponse(responseText)
}
