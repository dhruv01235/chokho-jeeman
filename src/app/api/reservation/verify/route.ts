import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { unauthorized, badRequest, serverError, success } from '@/lib/api-helpers'

export async function GET(request: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const { searchParams } = new URL(request.url)
    const reservationId = searchParams.get('reservationId')

    if (!reservationId) {
      return badRequest('Reservation ID is required')
    }

    const reservation = await prisma.reservation.findUnique({
      where: { reservationId: reservationId.trim() },
      select: {
        id: true,
        reservationId: true,
        name: true,
        email: true,
        phone: true,
        date: true,
        timeSlot: true,
        partySize: true,
        tableInfo: true,
        status: true,
        createdAt: true,
      },
    })

    if (!reservation) {
      return badRequest('Reservation not found')
    }

    return success(reservation)
  } catch (error) {
    console.error('Verify reservation error:', error)
    return serverError('Failed to verify reservation')
  }
}
