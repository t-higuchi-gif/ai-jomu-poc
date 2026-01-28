import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { generatePersonaPrompt, PersonaInput } from '@/lib/persona'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { text, persona } = body as {
      text: string
      persona: PersonaInput
    }

    if (!text || !persona) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    const systemPrompt = generatePersonaPrompt(persona)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `
以下は、送信しようとしている文章です。
内容や意図を尊重しつつ、
スタンスを踏まえて整理してください。

---
${text}
---
          `.trim(),
        },
      ],
      temperature: 0.4,
    })

    const reply = completion.choices[0].message.content

    return NextResponse.json({ reply })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

