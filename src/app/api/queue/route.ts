import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createQueueSchema, updateQueueSchema } from '@/lib/validations'
import { unauthorized, badRequest, serverError, created, success } from '@/lib/api-helpers'
import { rateLimit, RATE_LIMITS, getClientIp } from '@/lib/rate-limit'

export async function GET() {
  try {
    const items = await prisma.queueItem.findMany({
      orderBy: { createdAt: 'asc' },
    })
    return success(items)
  } catch {
    return serverError()
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const limit = RATE_LIMITS.queue
  const rl = await rateLimit(`queue:post:${ip}`, limit, true)
  if (!rl.allowed) {
    const retryAfter = Math.ceil((rl.resetAt - Date.now()) / 1000)
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  try {
    const body = await request.json()
    const parsed = createQueueSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors)
    }

    const waitingCount = await prisma.queueItem.count({
      where: { status: 'WAITING' },
    })
    const estimatedAt = new Date()
    estimatedAt.setMinutes(estimatedAt.getMinutes() + (waitingCount + 1) * 15)

    const item = await prisma.queueItem.create({
      data: {
        name: parsed.data.name,
        partySize: parsed.data.partySize,
        estimatedAt,
        status: 'WAITING',
      },
    })
    return created(item)
  } catch {
    return serverError()
  }
}

export async function PUT(request: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const body = await request.json()
    const parsed = updateQueueSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors)
    }

    const { id, ...data } = parsed.data
    const item = await prisma.queueItem.update({
      where: { id },
      data,
    })
    return success(item)
  } catch {
    return serverError()
  }
}
