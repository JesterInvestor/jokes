import { NextResponse } from 'next/server'

type Body = { prompt?: string }

function fallbackJoke(prompt?: string) {
  const subjects = ['chicken', 'cat', 'developer', 'robot', 'banana', 'cowboy', 'pirate', 'teacher']
  const actions = ['cross the road', 'debug the code', 'drink coffee', 'tell a secret', 'dance on stage', 'walk into a bar']
  const punchlines = [
    "to get to the other side!",
    "because it saw a semicolon and thought it was crying!",
    "because someone said 'return' and it followed instructions!",
    "to avoid the infinite loop of life",
    "because the coffee said 'I'll be back'",
    "to find its missing sense of humor"
  ]

  const s = subjects[Math.floor(Math.random() * subjects.length)]
  const a = actions[Math.floor(Math.random() * actions.length)]
  const p = punchlines[Math.floor(Math.random() * punchlines.length)]
  const base = `Why did the ${s} ${a}? ${p}`
  if (!prompt) return base
  // Try to make the fallback reflect the prompt simply
  return `${base} (${prompt.slice(0, 100)})`
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json().catch(() => ({}))
    const prompt = body?.prompt?.trim()

    const OPENAI_KEY = process.env.OPENAI_API_KEY
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'

    if (OPENAI_KEY) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are a witty family-friendly joke writer. Keep jokes short (under 280 characters).' },
            { role: 'user', content: prompt ? `Write a short joke about: ${prompt}` : 'Write a short, family-friendly joke.' },
          ],
          temperature: 0.9,
          max_tokens: 120,
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => 'openai error')
        return NextResponse.json({ joke: fallbackJoke(prompt), error: text }, { status: 502 })
      }

      const data = await res.json()
      const content = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text
      const joke = String(content ?? fallbackJoke(prompt)).trim()
      return NextResponse.json({ joke })
    }

    // No OpenAI key configured — return a small fallback generated joke
    const joke = fallbackJoke(prompt)
    return NextResponse.json({ joke })
  } catch (e) {
    return NextResponse.json({ joke: fallbackJoke(), error: String(e) }, { status: 500 })
  }
}
