import { prisma } from '@/lib/db'
import { badRequest, success, serverError } from '@/lib/api-helpers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const timeSlot = searchParams.get('timeSlot')

  if (!date || !timeSlot) {
    return badRequest('Date and timeSlot are required')
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        date: new Date(date),
        timeSlot,
        status: { in: ['BOOKED', 'CONFIRMED'] }
      },
      select: {
        tableInfo: true
      }
    })

    // Extract table IDs from tableInfo: "Table t1 (2 seats)" -> "t1"
    const bookedTableIds: string[] = reservations
      .map((r: { tableInfo: string | null }) => r.tableInfo?.match(/Table (t\d+)/)?.[1])
      .filter((id: string | undefined): id is string => !!id)

    return success(bookedTableIds)
  } catch (error) {
    console.error('Availability fetch error:', error)
    return serverError('Failed to fetch availability')
  }
}
