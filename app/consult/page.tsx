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
      setError('理想のあなたとの整理中に、通信エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h1>そのメッセージ、送信前に「理想のあなた」に相談してみませんか？</h1>

      <p>
        感情的になりそうな時や、言葉選びに迷った時に、<br />
        「理想のあなたならどう考えるか」を、静かに一緒に整理します。
      </p>

      <textarea
        rows={6}
        style={{ width: '100%' }}
        placeholder={
          'このまま送ろうとしている文章を、そのまま貼り付けてみてください。\n' +
          '（相手から来たメッセージや状況があれば、あわせて書いても大丈夫です）'
        }
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <p style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
        ※ 誰に向けたやり取りか（上司・部下・社外など）や、相手のメッセージも書いていただくと、
        文脈に沿った整理がしやすくなります。
      </p>

      <br />

      <button onClick={consult} disabled={loading || !inputText}>
        {loading ? '整理中…' : '理想のあなたに相談'}
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: 12 }}>
          {error}
        </p>
      )}

      {result && (
        <>
          <hr />
          <h3>理想のあなたからのアドバイス</h3>
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
