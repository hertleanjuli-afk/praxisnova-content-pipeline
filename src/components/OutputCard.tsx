'use client'

import { useState } from 'react'
import { GeneratedContent, FORMAT_LABELS } from '@/types/content'

const FORMAT_ICONS: Record<string, JSX.Element> = {
  'linkedin-post': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  ),
  'facebook-post': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  'newsletter': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  'karussell': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" /><path d="M9 2v20" /><path d="M15 2v20" />
    </svg>
  ),
  'thread': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
}

interface OutputCardProps {
  result: GeneratedContent
  onRegenerate?: () => void
  regenerating?: boolean
}

export default function OutputCard({ result, onRegenerate, regenerating }: OutputCardProps) {
  const [copied, setCopied] = useState(false)
  const [showVariantB, setShowVariantB] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Extract variant B from content if present
  const variantBMarker = '--- VARIANTE B HOOK ---'
  const hasVariantB = result.content.includes(variantBMarker)
  const mainContent = hasVariantB ? result.content.split(variantBMarker)[0].trim() : result.content
  const variantBContent = hasVariantB ? result.content.split(variantBMarker)[1]?.trim() : null

  return (
    <div className="bg-[#111] border border-[#1E1E1E] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-[#E8472A]/15 text-[#E8472A] flex items-center justify-center">
            {FORMAT_ICONS[result.format] || <span className="text-sm font-bold">?</span>}
          </span>
          <div>
            <h3 className="text-white font-semibold text-sm">{result.title}</h3>
            <span className="text-[#888] text-xs">{mainContent.length} Zeichen</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={regenerating}
              className="p-2 rounded-lg text-[#888] hover:text-white hover:bg-[#1A1A1A] border border-[#1E1E1E] hover:border-[#333] transition-all disabled:opacity-40"
              title="Neu generieren"
            >
              <svg className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              copied
                ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                : 'bg-[#1A1A1A] text-white border border-[#1E1E1E] hover:border-[#E8472A]/40'
            }`}
          >
            {copied ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Kopiert!
              </span>
            ) : 'Kopieren'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300 leading-relaxed max-h-96 overflow-y-auto">
          {mainContent}
        </pre>
      </div>

      {/* Variant B Toggle */}
      {variantBContent && (
        <div className="px-5 pb-4">
          <button
            onClick={() => setShowVariantB(!showVariantB)}
            className="flex items-center gap-2 text-xs font-medium text-[#E8472A] hover:text-[#ff6b4a] transition-colors"
          >
            <svg className={`w-3 h-3 transition-transform ${showVariantB ? 'rotate-90' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 2l4 4-4 4" />
            </svg>
            Variante B (alternativer Hook)
          </button>
          {showVariantB && (
            <div className="mt-3 p-4 bg-[#0A0A0A] border border-[#E8472A]/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#E8472A]">VARIANTE B</span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(variantBContent)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="text-xs text-[#888] hover:text-white transition-colors"
                >
                  Kopieren
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-400 leading-relaxed">
                {variantBContent}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Hashtags */}
      {result.hashtags && result.hashtags.length > 0 && (
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {result.hashtags.map((tag, i) => (
            <span key={i} className="text-xs bg-[#E8472A]/10 text-[#E8472A] px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Warnings and Tips */}
      {(result.charWarning || result.optimizationTip) && (
        <div className="px-5 pb-4 space-y-2">
          {result.charWarning && (
            <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-400/10 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              {result.charWarning}
            </div>
          )}
          {result.optimizationTip && (
            <div className="flex items-center gap-2 text-xs text-[#888] bg-[#0A0A0A] rounded-lg px-3 py-2">
              <svg className="w-4 h-4 flex-shrink-0 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
              </svg>
              {result.optimizationTip}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
