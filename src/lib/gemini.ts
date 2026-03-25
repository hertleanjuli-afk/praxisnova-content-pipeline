import { OutputFormat, Branche, GeneratedContent, FORMAT_LABELS } from '@/types/content'
import { buildPrompt, buildImagePrompt } from './prompts'

const GEMINI_TEXT_MODEL = 'gemini-2.5-flash'
const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash'

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

  // Extract hashtags if present
  const hashtagMatch = text.match(/#\w+/g)
  const hashtags = hashtagMatch ? hashtagMatch.map((h: string) => h) : undefined

  return {
    format,
    title: FORMAT_LABELS[format],
    content: text.trim(),
    charCount: text.trim().length,
    hashtags,
  }
}

export async function generateImage(
  apiKey: string,
  input: string,
  branche: Branche
): Promise<string | null> {
  const prompt = buildImagePrompt(input, branche)

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        }),
      }
    )

    if (!response.ok) return null

    const data = await response.json()
    const parts = data.candidates?.[0]?.content?.parts || []

    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
      }
    }

    return null
  } catch {
    return null
  }
}
