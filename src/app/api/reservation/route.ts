import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireAuth, requireAdmin } from '@/lib/auth'
import { createReservationSchema, updateReservationSchema } from '@/lib/validations'
import { unauthorized, badRequest, serverError, created, success } from '@/lib/api-helpers'
import { rateLimit, RATE_LIMITS, getClientIp } from '@/lib/rate-limit'
import { sendReservationConfirmationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function GET() {
  const session = await requireAuth()
  if (!session) return unauthorized()

  try {
    const adminCheck = await requireAdmin()
    
    if (adminCheck) {
      const reservations = await prisma.reservation.findMany({
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { date: 'asc' },
      })
      return success(reservations)
    }

    const reservations = await prisma.reservation.findMany({
      where: { email: session.user.email! },
      orderBy: { date: 'asc' },
    })
    return success(reservations)
  } catch {
    return serverError()
  }
}

export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return unauthorized()

  const ip = getClientIp(request)
  const limit = RATE_LIMITS.reservation
  const rl = await rateLimit(`reservation:post:${ip}`, limit, true)
  if (!rl.allowed) {
    const retryAfter = Math.ceil((rl.resetAt - Date.now()) / 1000)
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  try {
    const body = await request.json()
    const parsed = createReservationSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors)
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    })

    const reservationId = `CJ-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

    // Use transaction for atomic check-and-create
    const reservation = await prisma.$transaction(async (tx) => {
      const existing = await tx.reservation.findFirst({
        where: {
          date: new Date(parsed.data.date),
          timeSlot: parsed.data.timeSlot,
          tableInfo: parsed.data.tableInfo,
          status: { in: ['BOOKED', 'CONFIRMED'] }
        }
      })

      if (existing) {
        throw new Error('This table is already reserved for the selected time slot.')
      }

      return await tx.reservation.create({
        data: {
          reservationId,
          userId: user ? user.id : null,
          name: parsed.data.name || session.user.name || 'Guest',
          email: parsed.data.email || session.user.email || 'guest@chokhojeeman.com',
          phone: parsed.data.phone || '',
          date: new Date(parsed.data.date),
          timeSlot: parsed.data.timeSlot || '12:00 PM',
          partySize: parsed.data.partySize,
          tableInfo: parsed.data.tableInfo || null,
          status: 'BOOKED',
          emailStatus: 'PENDING',
        },
      })
    })

    // Send confirmation email independently (non-blocking / error caught; never rolls back reservation)
    const [emailResult] = await Promise.all([
      sendReservationConfirmationEmail({
        to: reservation.email,
        reservationId: reservation.reservationId,
        name: reservation.name,
        date: new Date(reservation.date).toLocaleDateString('en-GB'),
        timeSlot: reservation.timeSlot,
        partySize: reservation.partySize,
        tableInfo: reservation.tableInfo,
        phone: reservation.phone || null,
      }),
    ])

    const emailStatusStr = emailResult.success ? 'SENT' : 'FAILED'

    await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        emailStatus: emailStatusStr,
      },
    })

    const responseBody = {
      ...reservation,
      emailStatus: emailStatusStr,
      email: emailResult.success
        ? { status: 'sent', messageId: emailResult.emailId }
        : { status: 'failed', message: 'Confirmation email could not be delivered.' },
    }

    return created(responseBody)
  } catch (error) {
    if (error instanceof Error && error.message === 'This table is already reserved for the selected time slot.') {
      return badRequest(error.message)
    }
    console.error('Create reservation error:', error)
    return serverError('Failed to create reservation')
  }
}

export async function PUT(request: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const body = await request.json()
    const parsed = updateReservationSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors)
    }

    const { id, ...data } = parsed.data
    const updateData: Record<string, unknown> = {}
    if (data.date) updateData.date = new Date(data.date)
    if (data.partySize !== undefined) updateData.partySize = data.partySize
    if (data.status) updateData.status = data.status
    if (data.timeSlot) updateData.timeSlot = data.timeSlot
    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email
    if (data.phone) updateData.phone = data.phone
    if (data.tableInfo !== undefined) updateData.tableInfo = data.tableInfo

    const reservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
    })
    return success(reservation)
  } catch (error) {
    console.error('Update reservation error:', error)
    return serverError('Failed to update reservation')
  }
}
