'use client'

import { useState, useCallback } from 'react'
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

const ALL_FORMATS: OutputFormat[] = ['linkedin-post', 'facebook-post', 'newsletter', 'karussell', 'thread']

export default function Home() {
  // Input state
  const [input, setInput] = useState('')
  const [branche, setBranche] = useState<Branche>('allgemein')
  const [tone, setTone] = useState<string>('professionell')
  const [selectedFormats, setSelectedFormats] = useState<OutputFormat[]>(['linkedin-post', 'karussell'])
  const [generateImg, setGenerateImg] = useState(false)

  // API Key state
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  // Output state
  const [results, setResults] = useState<GeneratedContent[]>([])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleFormat = (format: OutputFormat) => {
    setSelectedFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    )
  }

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) {
      setError('Bitte gib einen Text oder eine Idee ein.')
      return
    }
    if (selectedFormats.length === 0) {
      setError('Bitte wähle mindestens ein Format.')
      return
    }
    if (!apiKey.trim()) {
      setError('Bitte hinterlege deinen Gemini API-Key in den Einstellungen oben.')
      return
    }

    setError(null)
    setGenerating(true)
    setResults([])
    setImageUrl(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: input.trim(),
          branche,
          formats: selectedFormats,
          tone,
          apiKey: apiKey.trim(),
          generateImg,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler bei der Generierung')
      }

      setResults(data.results)
      if (data.imageUrl) setImageUrl(data.imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten.')
    } finally {
      setGenerating(false)
    }
  }, [input, branche, selectedFormats, tone, apiKey, generateImg])

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="border-b border-brand-border bg-brand-bg/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-accent" />
              <div className="w-2.5 h-2.5 rounded-full bg-brand-accent" />
              <div className="w-2.5 h-2.5 rounded-full bg-brand-accent/50" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Content-Pipeline</h1>
              <p className="text-brand-muted-light text-xs">PraxisNova AI</p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                placeholder="Gemini API-Key"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-sm text-white w-56 placeholder:text-brand-muted"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white text-xs"
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
            {apiKey && (
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" title="API-Key hinterlegt" />
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SIDE: Input */}
          <div className="space-y-6">
            {/* Text Input */}
            <div>
              <label className="block text-white font-semibold text-sm mb-2">
                Dein Text, Idee oder Thema
              </label>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="z.B. 'Wie KI die Angebotserstellung im Handwerk revolutioniert' oder einen ganzen Blogartikel einf&uuml;gen..."
                className="w-full h-48 bg-brand-card border border-brand-border rounded-xl px-4 py-3 text-white text-sm resize-none placeholder:text-brand-muted"
              />
              <div className="flex justify-between mt-1">
                <span className="text-brand-muted text-xs">
                  Tipp: Je mehr Details, desto besser die Ergebnisse.
                </span>
                <span className="text-brand-muted text-xs">{input.length} Zeichen</span>
              </div>
            </div>

            {/* Branche Selection */}
            <div>
              <label className="block text-white font-semibold text-sm mb-2">Ziel-Branche</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(BRANCHE_LABELS) as [Branche, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setBranche(key)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium border transition-all ${
                      branche === key
                        ? 'bg-brand-accent/15 border-brand-accent text-brand-accent'
                        : 'bg-brand-card border-brand-border text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-white font-semibold text-sm mb-2">Tonalität</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(TONE_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTone(key)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium border transition-all ${
                      tone === key
                        ? 'bg-brand-accent/15 border-brand-accent text-brand-accent'
                        : 'bg-brand-card border-brand-border text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-white font-semibold text-sm mb-2">Ausgabeformate</label>
              <div className="space-y-2">
                {ALL_FORMATS.map(format => (
                  <button
                    key={format}
                    onClick={() => toggleFormat(format)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      selectedFormats.includes(format)
                        ? 'bg-brand-accent/10 border-brand-accent/50'
                        : 'bg-brand-card border-brand-border hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-sm font-medium ${
                          selectedFormats.includes(format) ? 'text-brand-accent' : 'text-gray-300'
                        }`}>
                          {FORMAT_LABELS[format]}
                        </span>
                        <p className="text-xs text-brand-muted mt-0.5">{FORMAT_DESCRIPTIONS[format]}</p>
                      </div>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedFormats.includes(format)
                          ? 'bg-brand-accent border-brand-accent'
                          : 'border-gray-600'
                      }`}>
                        {selectedFormats.includes(format) && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Generation Toggle */}
            <div className="flex items-center justify-between px-4 py-3 bg-brand-card border border-brand-border rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-300">LinkedIn-Beitragsbild generieren</span>
                <p className="text-xs text-brand-muted mt-0.5">KI erstellt ein passendes Bild via Gemini (kostenlos)</p>
              </div>
              <button
                onClick={() => setGenerateImg(!generateImg)}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  generateImg ? 'bg-brand-accent' : 'bg-gray-700'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  generateImg ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !input.trim() || selectedFormats.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-white text-base transition-all ${
                generating
                  ? 'bg-brand-accent/50 cursor-wait animate-pulse-accent'
                  : 'bg-brand-accent hover:bg-brand-accent-hover active:scale-[0.98]'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
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

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Output */}
          <div className="space-y-6">
            {results.length === 0 && !generating && (
              <div className="flex flex-col items-center justify-center h-96 bg-brand-card/50 border border-brand-border border-dashed rounded-xl">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-white font-semibold mb-1">Bereit zum Generieren</h3>
                <p className="text-brand-muted-light text-sm text-center max-w-xs">
                  Schreibe links dein Thema oder deine Idee, wähle die Formate und klicke auf Generieren.
                </p>
              </div>
            )}

            {generating && (
              <div className="flex flex-col items-center justify-center h-96 bg-brand-card/50 border border-brand-border rounded-xl">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-border" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-accent animate-spin" />
                </div>
                <h3 className="text-white font-semibold mb-1">KI generiert deine Inhalte...</h3>
                <p className="text-brand-muted-light text-sm">
                  {selectedFormats.length} Format{selectedFormats.length > 1 ? 'e' : ''} werden erstellt
                </p>
              </div>
            )}

            {/* Generated Image */}
            {imageUrl && (
              <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-brand-accent/20 text-brand-accent flex items-center justify-center text-sm font-bold">
                      🖼
                    </span>
                    <h3 className="text-white font-semibold text-sm">LinkedIn-Beitragsbild</h3>
                  </div>
                  <a
                    href={imageUrl}
                    download="linkedin-beitragsbild.png"
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-card-hover text-white border border-brand-border hover:border-brand-accent/50"
                  >
                    Download
                  </a>
                </div>
                <div className="p-4">
                  <img src={imageUrl} alt="Generiertes Beitragsbild" className="rounded-lg w-full" />
                </div>
              </div>
            )}

            {/* Results */}
            {results.map((result, i) => (
              <OutputCard key={`${result.format}-${i}`} result={result} />
            ))}

            {/* Stats */}
            {results.length > 0 && (
              <div className="bg-brand-card/50 border border-brand-border rounded-xl px-5 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-muted-light">
                    {results.length} Format{results.length > 1 ? 'e' : ''} generiert
                  </span>
                  <span className="text-brand-muted-light">
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
