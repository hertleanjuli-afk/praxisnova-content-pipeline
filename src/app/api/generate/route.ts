import { NextRequest, NextResponse } from 'next/server'
import { generateContent, generateImage } from '@/lib/gemini'
import { GenerateRequest, GeneratedContent } from '@/types/content'

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest & { apiKey?: string; generateImg?: boolean } = await request.json()
    const { input, branche, formats, tone, apiKey: clientKey, generateImg } = body

    // API Key: environment variable OR from client
    const apiKey = process.env.GEMINI_API_KEY || clientKey

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Kein Gemini API-Key konfiguriert. Bitte in den Einstellungen hinterlegen.' },
        { status: 400 }
      )
    }

    if (!input || !input.trim()) {
      return NextResponse.json(
        { error: 'Bitte gib einen Text oder eine Idee ein.' },
        { status: 400 }
      )
    }

    if (!formats || formats.length === 0) {
      return NextResponse.json(
        { error: 'Bitte waehle mindestens ein Ausgabeformat.' },
        { status: 400 }
      )
    }

    // Generate all formats in parallel
    const contentPromises = formats.map((format) =>
      generateContent(apiKey, input, format, branche, tone)
    )

    // Optionally generate image
    const imagePromise = generateImg
      ? generateImage(apiKey, input, branche)
      : Promise.resolve(null)

    const [results, imageUrl] = await Promise.all([
      Promise.all(contentPromises),
      imagePromise,
    ])

    return NextResponse.json({
      results,
      imageUrl,
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    )
  }
}
