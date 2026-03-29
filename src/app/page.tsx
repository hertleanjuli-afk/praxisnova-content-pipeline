'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  OutputFormat,
  Branche,
  GeneratedContent,
  FORMAT_LABELS,
  FORMAT_DESCRIPTIONS,
  BRANCHE_LABELS,
  TONE_LABELS,
} from '@/types/content'
import OutputCard from '@/components/OutputCard'

const FORMAT_ICONS: Record<OutputFormat, { icon: JSX.Element; color: string }> = {
  'linkedin-post': {
    color: '#0A66C2',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>,
  },
  'facebook-post': {
    color: '#1877F2',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
  },
  'newsletter': {
    color: '#E8472A',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
  },
  'karussell': {
    color: '#22C55E',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" /><path d="M9 2v20" /><path d="M15 2v20" /></svg>,
  },
  'thread': {
    color: '#EAB308',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  },
}

const ALL_FORMATS: OutputFormat[] = ['linkedin-post', 'facebook-post', 'newsletter', 'karussell', 'thread']

function SkeletonCard() {
  return (
    <div className="bg-[#111] border border-[#1E1E1E] rounded-xl overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1E1E1E]">
        <div className="w-9 h-9 rounded-lg bg-[#1A1A1A]" />
        <div className="space-y-2"><div className="w-24 h-4 bg-[#1A1A1A] rounded" /><div className="w-16 h-3 bg-[#1A1A1A] rounded" /></div>
      </div>
      <div className="p-5 space-y-3">
        <div className="h-3 bg-[#1A1A1A] rounded w-full" /><div className="h-3 bg-[#1A1A1A] rounded w-5/6" />
        <div className="h-3 bg-[#1A1A1A] rounded w-4/6" /><div className="h-3 bg-[#1A1A1A] rounded w-full" />
        <div className="h-3 bg-[#1A1A1A] rounded w-3/6" />
      </div>
    </div>
  )
}

export default function Home() {
  const [input, setInput] = useState('')
  const [branche, setBranche] = useState<Branche>('allgemein')
  const [tone, setTone] = useState<string>('professionell')
  const [selectedFormats, setSelectedFormats] = useState<OutputFormat[]>(['linkedin-post', 'karussell'])
  const [generateImg, setGenerateImg] = useState(false)

  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key')
    if (saved) { setApiKey(saved); setApiKeyValid(true) }
  }, [])

  const handleApiKeyChange = (val: string) => {
    setApiKey(val)
    if (val.trim()) {
      localStorage.setItem('gemini_api_key', val.trim())
      setApiKeyValid(val.trim().length >= 20)
    } else {
      localStorage.removeItem('gemini_api_key')
      setApiKeyValid(null)
    }
  }

  const [results, setResults] = useState<GeneratedContent[]>([])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [regeneratingFormat, setRegeneratingFormat] = useState<OutputFormat | null>(null)
  const [error, setError] = useState<string | null>(null)

  const toggleFormat = (format: OutputFormat) => {
    setSelectedFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    )
  }

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) { setError('Bitte gib einen Text oder eine Idee ein.'); return }
    if (selectedFormats.length === 0) { setError('Bitte wähle mindestens ein Format.'); return }
    if (!apiKey.trim()) { setError('Bitte hinterlege deinen Gemini API-Key oben rechts.'); return }

    setError(null)
    setGenerating(true)
    setResults([])
    setImageUrl(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim(), branche, formats: selectedFormats, tone, apiKey: apiKey.trim(), generateImg }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Fehler bei der Generierung')
      setResults(data.results)
      if (data.imageUrl) setImageUrl(data.imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten.')
    } finally {
      setGenerating(false)
    }
  }, [input, branche, selectedFormats, tone, apiKey, generateImg])

  const handleRegenerate = useCallback(async (format: OutputFormat) => {
    if (!apiKey.trim()) return
    setRegeneratingFormat(format)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim(), branche, formats: [format], tone, apiKey: apiKey.trim(), generateImg: false }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      if (data.results?.[0]) {
        setResults(prev => prev.map(r => r.format === format ? data.results[0] : r))
      }
    } catch { /* silently fail */ } finally {
      setRegeneratingFormat(null)
    }
  }, [input, branche, tone, apiKey])

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="border-b border-[#1E1E1E] bg-[#0A0A0A]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm bg-[#E8472A]" />
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Content-Pipeline</h1>
              <p className="text-[#888] text-xs">PraxisNova AI</p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                placeholder="Gemini API-Key"
                value={apiKey}
                onChange={e => handleApiKeyChange(e.target.value)}
                className="bg-[#111] border border-[#1E1E1E] rounded-lg px-3 py-2 text-sm text-white w-44 sm:w-56 placeholder:text-[#555] focus:border-[#E8472A]/50 focus:outline-none transition-colors"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
              >
                {showApiKey ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
            {apiKeyValid === true && <span className="w-2.5 h-2.5 rounded-full bg-green-500" title="API-Key gültig" />}
            {apiKeyValid === false && <span className="w-2.5 h-2.5 rounded-full bg-red-500" title="API-Key zu kurz" />}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT: Input Panel */}
          <div className="space-y-5">
            {/* Text Input */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-xl p-5">
              <label className="block text-white font-semibold text-sm mb-2">Dein Thema oder Idee</label>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="z.B. 'Wie KI die Angebotserstellung im Handwerk revolutioniert' oder einen ganzen Blogartikel einfügen..."
                className="w-full h-40 bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg px-4 py-3 text-white text-sm resize-none placeholder:text-[#555] focus:border-[#E8472A]/40 focus:outline-none transition-colors"
              />
              <div className="flex justify-between mt-2">
                <span className="text-[#555] text-xs">Je mehr Details, desto besser.</span>
                <span className="text-[#555] text-xs">{input.length} Zeichen</span>
              </div>
            </div>

            {/* Branche Selection */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-xl p-5">
              <label className="block text-white font-semibold text-sm mb-3">Ziel-Branche</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(BRANCHE_LABELS) as [Branche, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setBranche(key)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium border transition-all ${
                      branche === key
                        ? 'bg-[#E8472A]/12 border-[#E8472A]/50 text-[#E8472A]'
                        : 'bg-[#0A0A0A] border-[#1E1E1E] text-[#888] hover:border-[#333] hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-xl p-5">
              <label className="block text-white font-semibold text-sm mb-3">Tonalität</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(TONE_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTone(key)}
                    className={`px-3 py-3 rounded-lg text-sm font-medium border transition-all ${
                      tone === key
                        ? 'bg-[#E8472A]/12 border-[#E8472A]/50 text-[#E8472A]'
                        : 'bg-[#0A0A0A] border-[#1E1E1E] text-[#888] hover:border-[#333] hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format Selection with Icons */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-xl p-5">
              <label className="block text-white font-semibold text-sm mb-3">Ausgabeformate</label>
              <div className="space-y-2">
                {ALL_FORMATS.map(format => {
                  const { icon, color } = FORMAT_ICONS[format]
                  const selected = selectedFormats.includes(format)
                  return (
                    <button
                      key={format}
                      onClick={() => toggleFormat(format)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                        selected
                          ? 'bg-[#E8472A]/8 border-[#E8472A]/30'
                          : 'bg-[#0A0A0A] border-[#1E1E1E] hover:border-[#333]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, color }}>
                            {icon}
                          </span>
                          <div>
                            <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-gray-400'}`}>
                              {FORMAT_LABELS[format]}
                            </span>
                            <p className="text-xs text-[#555] mt-0.5">{FORMAT_DESCRIPTIONS[format]}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selected ? 'bg-[#E8472A] border-[#E8472A]' : 'border-[#333]'
                        }`}>
                          {selected && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Image Toggle */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#111] border border-[#1E1E1E] rounded-xl">
              <div>
                <span className="text-sm font-medium text-gray-300">Beitragsbild generieren</span>
                <p className="text-xs text-[#555] mt-0.5">Via Pollinations.ai (kostenlos, kein Key nötig)</p>
              </div>
              <button
                onClick={() => setGenerateImg(!generateImg)}
                className={`w-11 h-6 rounded-full transition-all relative ${generateImg ? 'bg-[#E8472A]' : 'bg-[#333]'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${generateImg ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !input.trim() || selectedFormats.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-white text-base transition-all ${
                generating
                  ? 'bg-[#E8472A]/50 cursor-wait'
                  : 'bg-[#E8472A] hover:bg-[#D63D22] active:scale-[0.98]'
              } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Generiere {selectedFormats.length} Format{selectedFormats.length > 1 ? 'e' : ''}...
                </span>
              ) : (
                `${selectedFormats.length} Format${selectedFormats.length > 1 ? 'e' : ''} generieren`
              )}
            </button>

            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* RIGHT: Output Panel */}
          <div className="space-y-5">
            {/* Empty state */}
            {results.length === 0 && !generating && (
              <div className="flex flex-col items-center justify-center h-80 sm:h-96 bg-[#111]/50 border border-[#1E1E1E] border-dashed rounded-xl">
                <div className="w-14 h-14 rounded-2xl bg-[#E8472A]/10 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8472A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v18" /><path d="m6 9 6-6 6 6" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-1">Bereit zum Generieren</h3>
                <p className="text-[#888] text-sm text-center max-w-xs px-4">
                  Schreibe links dein Thema, wähle die Formate und klicke auf Generieren.
                </p>
              </div>
            )}

            {/* Skeleton loading */}
            {generating && (
              <div className="space-y-5">
                {selectedFormats.map(format => (
                  <SkeletonCard key={format} />
                ))}
              </div>
            )}

            {/* Image Preview */}
            {imageUrl && (
              <div className="bg-[#111] border border-[#1E1E1E] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#1E1E1E] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-[#E8472A]/15 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8472A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                      </svg>
                    </span>
                    <h3 className="text-white font-semibold text-sm">Beitragsbild</h3>
                  </div>
                  <a
                    href={imageUrl}
                    download="praxisnova-beitragsbild.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#E8472A] text-white hover:bg-[#D63D22] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </a>
                </div>
                <div className="p-4">
                  <img src={imageUrl} alt="Generiertes Beitragsbild" className="rounded-lg w-full" loading="lazy" />
                </div>
              </div>
            )}

            {/* Results */}
            {results.map((result, i) => (
              <OutputCard
                key={`${result.format}-${i}`}
                result={result}
                onRegenerate={() => handleRegenerate(result.format)}
                regenerating={regeneratingFormat === result.format}
              />
            ))}

            {/* Stats footer */}
            {results.length > 0 && (
              <div className="bg-[#111]/50 border border-[#1E1E1E] rounded-xl px-5 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#888]">
                    {results.length} Format{results.length > 1 ? 'e' : ''} generiert
                  </span>
                  <span className="text-[#888]">
                    Gesamt: {results.reduce((sum, r) => sum + r.charCount, 0).toLocaleString()} Zeichen
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
