'use client'

import { useState } from 'react'
import { GeneratedContent, FORMAT_LABELS } from '@/types/content'

const FORMAT_ICONS: Record<string, string> = {
  'linkedin-post': 'in',
  'facebook-post': 'f',
  'newsletter': '@',
  'karussell': '▦',
  'thread': '≡',
}

export default function OutputCard({ result }: { result: GeneratedContent }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-brand-accent/20 text-brand-accent flex items-center justify-center text-sm font-bold">
            {FORMAT_ICONS[result.format] || '?'}
          </span>
          <div>
            <h3 className="text-white font-semibold text-sm">{result.title}</h3>
            <span className="text-brand-muted-light text-xs">{result.charCount} Zeichen</span>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            copied
              ? 'bg-green-600/20 text-green-400 border border-green-600/30'
              : 'bg-brand-card-hover text-white border border-brand-border hover:border-brand-accent/50'
          }`}
        >
          {copied ? 'Kopiert!' : 'Kopieren'}
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300 leading-relaxed max-h-96 overflow-y-auto">
          {result.content}
        </pre>
      </div>

      {/* Hashtags */}
      {result.hashtags && result.hashtags.length > 0 && (
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {result.hashtags.map((tag, i) => (
            <span key={i} className="text-xs bg-brand-accent/10 text-brand-accent px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
