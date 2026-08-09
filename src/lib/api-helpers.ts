import { NextResponse } from 'next/server'

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 })
}

export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function badRequest(message: string, details?: unknown) {
  const body: Record<string, unknown> = { error: message }
  if (details) body.details = details
  return NextResponse.json(body, { status: 400 })
}

export function serverError(message = 'Internal server error') {
  return NextResponse.json({ error: message }, { status: 500 })
}

export function rateLimited(retryAfter: number, remaining: number, limit: number) {
  return NextResponse.json(
    { error: 'Too many requests' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(remaining),
      },
    }
  )
}

export function success<T>(data: T, options: { status?: number; headers?: Record<string, string> } = {}) {
  return NextResponse.json(data, {
    status: options.status ?? 200,
    headers: options.headers,
  })
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 })
}
