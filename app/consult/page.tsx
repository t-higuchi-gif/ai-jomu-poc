'use client'

import { useState } from 'react'
import { generatePersonaPrompt, PersonaInput } from '@/lib/persona'

export default function ConsultPage() {
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  // 仮の人格（あとで setup の結果を渡す）
  const persona: PersonaInput = {
    position: '常務',
    audience: ['部下', '社内関係者'],
    stance: ['冷静', '誠実', '丁寧'],
    primaryStance: '冷静',
    regretPatterns: ['言いすぎる'],
  }

  const consult = async () => {
    setLoading(true)

    // ここではまだ AI を呼ばない
    const personaPrompt = generatePersonaPrompt(persona)

    const fakeResponse = `
AI常務です。

この内容は、伝えたい意図自体は理解できます。
ただ、「${persona.primaryStance}」というスタンスを
より前面に出すなら、次のような整理も考えられます。

・相手の立場を一度受け止める
・結論を急がず、確認の形にする

最終的にどの表現を選ぶかは、
あなた自身で判断してください。
    `.trim()

    setTimeout(() => {
      setResult(fakeResponse)
      setLoading(false)
    }, 800)
  }

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h1>AI常務｜相談</h1>

      <p>
        返信や投稿に迷った時、<br />
        「理想の自分」ならどう返すかを整理します。
      </p>

      <textarea
        rows={6}
        style={{ width: '100%' }}
        placeholder="ここに、送ろうとしている文章を貼ってください"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <br />
      <br />

      <button onClick={consult} disabled={loading || !inputText}>
        {loading ? '相談中…' : 'AI常務に相談する'}
      </button>

      {result && (
        <>
          <hr />
          <h3>AI常務からの整理案</h3>
          <pre
            style={{
              background: '#f5f5f5',
              padding: 16,
              whiteSpace: 'pre-wrap',
            }}
          >
            {result}
          </pre>
        </>
      )}
    </div>
  )
}

