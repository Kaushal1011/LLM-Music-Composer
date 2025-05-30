import { NextRequest, NextResponse } from 'next/server'
import { getMelody } from '@/lib/llm'
import { rateLimiter } from '@/lib/rateLimiter'

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for') ||
    'anonymous'

  try {
    await rateLimiter.consume(ip)
    // disable unused eslint rule
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute.' },
      { status: 429 }
    )
  }
  console.log(`Rate limit passed for ${ip}`)

  const { prompt } = await req.json()
  const data = await getMelody(prompt)
  return NextResponse.json(data)
}
