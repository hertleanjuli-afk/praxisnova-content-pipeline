import { OutputFormat, Branche, GeneratedContent, FORMAT_LABELS } from '@/types/content'
import { buildPrompt, buildImagePrompt } from './prompts'

const GEMINI_TEXT_MODEL = 'gemini-2.5-flash'

// ─── Text Generation (Gemini) ───────────────────────────────────────────────

export async function generateContent(
  apiKey: string,
  input: string,
  format: OutputFormat,
  branche: Branche,
  tone: string
): Promise<GeneratedContent> {
  const prompt = buildPrompt(input, format, branche, tone)

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TEXT_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 4096,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API Fehler: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

  const hashtagMatch = text.match(/#\w+/g)
  const hashtags = hashtagMatch ? hashtagMatch.map((h: string) => h) : undefined

  const charLimits: Record<OutputFormat, number> = {
    'linkedin-post': 3000,
    'facebook-post': 500,
    'newsletter': 5000,
    'karussell': 2000,
    'thread': 6000,
  }

  const charCount = text.trim().length
  const limit = charLimits[format]
  const charWarning = charCount > limit
    ? `Zeichenlimit überschritten: ${charCount}/${limit} Zeichen`
    : undefined

  const optimizationTips: Record<OutputFormat, string> = {
    'linkedin-post': 'Tipp: Die ersten 2 Zeilen sind der Hook. LinkedIn zeigt nur ~150 Zeichen vor "mehr anzeigen".',
    'facebook-post': 'Tipp: Facebook-Posts unter 80 Zeichen erhalten 66% mehr Engagement.',
    'newsletter': 'Tipp: Betreffzeile unter 50 Zeichen hat die beste Öffnungsrate. Vorschautext nutzen.',
    'karussell': 'Tipp: Cover-Titel unter 10 Wörter. Jede Slide max. 2 kurze Sätze.',
    'thread': 'Tipp: Post 1 entscheidet ob jemand weiterliest. Die stärkste Aussage gehört an den Anfang.',
  }

  return {
    format,
    title: FORMAT_LABELS[format],
    content: text.trim(),
    charCount,
    hashtags,
    charWarning,
    optimizationTip: optimizationTips[format],
  }
}

// ─── Image Generation (Pollinations.ai → Together.ai fallback) ──────────────

export async function generateImage(
  _apiKey: string,
  input: string,
  branche: Branche
): Promise<string | null> {
  const prompt = buildImagePrompt(input, branche)

  // Try Pollinations.ai first (free, no API key)
  const pollinationsUrl = await tryPollinations(prompt)
  if (pollinationsUrl) return pollinationsUrl

  // Fallback: Together.ai FLUX.1-schnell (free tier)
  const togetherApiKey = process.env.TOGETHER_API_KEY
  if (togetherApiKey) {
    const togetherUrl = await tryTogether(togetherApiKey, prompt)
    if (togetherUrl) return togetherUrl
  }

  return null
}

async function tryPollinations(prompt: string): Promise<string | null> {
  try {
    const encodedPrompt = encodeURIComponent(prompt)
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1080&nologo=true&seed=${Date.now()}`

    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(20000),
    })

    if (response.ok) return url
    return null
  } catch {
    return null
  }
}

async function tryTogether(apiKey: string, prompt: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-schnell-Free',
        prompt,
        width: 1024,
        height: 1024,
        n: 1,
      }),
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) return null

    const data = await response.json()
    const imageUrl = data.data?.[0]?.url
    return imageUrl || null
  } catch {
    return null
  }
}
