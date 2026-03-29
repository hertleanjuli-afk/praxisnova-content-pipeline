import { NextRequest, NextResponse } from 'next/server'
import { buildImagePrompt } from '@/lib/prompts'
import { Branche } from '@/types/content'

export async function POST(request: NextRequest) {
  try {
    const { prompt, branche } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    const imagePrompt = branche
      ? buildImagePrompt(prompt, branche as Branche)
      : prompt

    const encodedPrompt = encodeURIComponent(imagePrompt)
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1080&nologo=true&seed=${Date.now()}`

    // Verify Pollinations is reachable
    try {
      const check = await fetch(pollinationsUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(20000),
      })

      if (check.ok) {
        return NextResponse.json({ imageData: pollinationsUrl })
      }
    } catch {
      // Pollinations failed, try Together.ai
    }

    // Fallback: Together.ai FLUX.1-schnell
    const togetherKey = process.env.TOGETHER_API_KEY
    if (togetherKey) {
      const response = await fetch('https://api.together.xyz/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${togetherKey}`,
        },
        body: JSON.stringify({
          model: 'black-forest-labs/FLUX.1-schnell-Free',
          prompt: imagePrompt,
          width: 1024,
          height: 1024,
          n: 1,
        }),
        signal: AbortSignal.timeout(30000),
      })

      if (response.ok) {
        const data = await response.json()
        const imageUrl = data.data?.[0]?.url
        if (imageUrl) {
          return NextResponse.json({ imageData: imageUrl })
        }
      }
    }

    return NextResponse.json({ imageData: null })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
