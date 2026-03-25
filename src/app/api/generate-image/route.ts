import { NextRequest, NextResponse } from 'next/server'

const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash'

export async function POST(request: NextRequest) {
    try {
          const { apiKey, prompt } = await request.json()

          if (!apiKey || !prompt) {
                  return NextResponse.json({ error: 'Missing apiKey or prompt' }, { status: 400 })
                }

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

          if (!response.ok) {
                  const error = await response.text()
                  return NextResponse.json({ error }, { status: response.status })
                }

          const data = await response.json()
          const parts = data.candidates?.[0]?.content?.parts || []

          for (const part of parts) {
                  if (part.inlineData?.mimeType?.startsWith('image/')) {
                            return NextResponse.json({
                                        imageData: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
                                      })
                          }
                }

          return NextResponse.json({ imageData: null })
        } catch (error) {
          return NextResponse.json({ error: String(error) }, { status: 500 })
        }
  }
