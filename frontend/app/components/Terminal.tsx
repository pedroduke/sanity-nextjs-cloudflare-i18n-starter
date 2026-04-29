'use client'

import { useEffect, useState } from 'react'

type TerminalLine = {
  type: 'command' | 'output' | 'success'
  text: string
}

const lines: TerminalLine[] = [
  { type: 'command', text: 'npx degit pedroduke/sanity-nextjs-cloudflare-i18n-starter my-site' },
  { type: 'command', text: 'cd my-site' },
  {
    type: 'command',
    text: 'cp frontend/.env.example frontend/.env.local && cp studio/.env.example studio/.env.local',
  },
  { type: 'command', text: 'pnpm install' },
  { type: 'output', text: '✓ Installing dependencies...' },
  { type: 'output', text: '✓ Linking Sanity project...' },
  { type: 'command', text: 'cd frontend && pnpm run deploy' },
  { type: 'success', text: '✓ Deployed → https://my-site.workers.dev' },
  { type: 'command', text: 'cd studio && pnpm run deploy' },
  { type: 'success', text: '✓ Success! Studio deployed to https://my-site.sanity.studio/' },
]

const TerminalLineRow = ({ line, isTyping }: { line: TerminalLine; isTyping: boolean }) => {
  const colorClass =
    line.type === 'command'
      ? 'text-gray-950'
      : line.type === 'success'
        ? 'text-brand'
        : 'text-gray-600'

  return (
    <div className={`flex gap-2 ${line.type !== 'command' ? 'pl-4' : ''}`}>
      {line.type === 'command' && <span className="text-brand font-semibold">~</span>}
      <span className={colorClass}>
        {line.text}
        {isTyping && <span className="w-2 h-3 bg-gray-950 inline-block ml-1 animate-pulse" />}
      </span>
    </div>
  )
}

export const Terminal = () => {
  const [displayedLines, setDisplayedLines] = useState<TerminalLine[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const typingSpeed = 10

  useEffect(() => {
    if (currentLine >= lines.length) return
    const current: TerminalLine = lines[currentLine]

    if (current.type !== 'command') {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => [...prev, current])
        setCurrentLine(prev => prev + 1)
      }, 300)
      return () => clearTimeout(timeout)
    }

    const fullText = current.text
    if (currentText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setCurrentText(fullText.slice(0, currentText.length + 1))
      }, typingSpeed)
      return () => clearTimeout(timeout)
    } else {
      setDisplayedLines(prev => [...prev, current])
      setCurrentText('')
      setCurrentLine(prev => prev + 1)
    }
  }, [currentText, currentLine])

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
      style={{ boxShadow: '0 8px 24px -4px rgba(255, 85, 0, 0.08)' }}
    >
      {/* Terminal bar */}
      <div className="flex items-center gap-1.5 bg-gray-100 border-b border-gray-200 h-[38px] px-3.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className="ml-auto font-mono text-[10px] text-gray-600">bash</span>
      </div>

      {/* Terminal body */}
      <div className="p-5 font-mono text-xs space-y-1.5">
        {displayedLines.map((line, index) => (
          <TerminalLineRow key={index} line={line} isTyping={false} />
        ))}
        {currentLine < lines.length && (
          <TerminalLineRow
            line={{
              type: lines[currentLine].type,
              text: currentText,
            }}
            isTyping
          />
        )}
        {currentLine >= lines.length && (
          <div className="flex gap-2 mt-1">
            <span className="text-brand font-semibold">~</span>
            <span className="w-2 h-3 bg-gray-950 inline-block animate-pulse" />
          </div>
        )}
      </div>
    </div>
  )
}
