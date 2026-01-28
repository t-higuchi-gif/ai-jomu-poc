'use client'

import { useState } from 'react'
import { PersonaInput } from '@/lib/persona'

export default function ConsultPage() {
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 仮の人格（あとで setup 画面の結果に差し替える）
  const persona: PersonaInput = {
    position: '常務',
    audience: ['部下', '社内関係者'],
    stance: ['冷静', '誠実', '丁寧'],
    primaryStance: '冷静',
    regretPatterns: ['言いすぎる'],
  }

  const consult = async () => {
    setLoading(true)
    setError('')
    setResult('')

    try {
      const res = await fetch('/api/consult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          persona,
        }),
      })

      if (!res.ok) {
        throw new Error('API error')
      }

      const data = await res.json()
      setResult(data.reply)
    } catch (e) {
      console.error(e)
      setError('AI常務との通信でエラーが発生しました')
    } finally {
      setLoading(false)
    }
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

      {error && (
        <p style={{ color: 'red', marginTop: 12 }}>
          {error}
        </p>
      )}

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
