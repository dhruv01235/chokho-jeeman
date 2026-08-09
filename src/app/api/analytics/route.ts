import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { serverError, success } from '@/lib/api-helpers'

export async function GET() {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const totalReservations = await prisma.reservation.count()
    const confirmedReservations = await prisma.reservation.count({ where: { status: 'CONFIRMED' } })
    const pendingReservations = await prisma.reservation.count({ where: { status: 'PENDING' } })
    const cancelledReservations = await prisma.reservation.count({ where: { status: 'CANCELLED' } })

    const menuItems = await prisma.menuItem.count()
    const inventoryItems = await prisma.inventoryItem.count()
    const queueItems = await prisma.queueItem.count({ where: { status: 'WAITING' } })

    const reservations = await prisma.reservation.findMany({
      select: { partySize: true, date: true, status: true },
    })

    const avgPartySize = reservations.length > 0
      ? reservations.reduce((acc, r) => acc + r.partySize, 0) / reservations.length
      : 0

    const hourlyMap = new Map<number, number>()
    reservations.forEach(r => {
      const hour = new Date(r.date).getHours()
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1)
    })
    const peakHours = Array.from(hourlyMap.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const dailyMap = new Map<string, number>()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    }).reverse()

    last7Days.forEach(date => dailyMap.set(date, 0))
    reservations.forEach(r => {
      const date = new Date(r.date).toISOString().split('T')[0]
      if (dailyMap.has(date)) {
        dailyMap.set(date, (dailyMap.get(date) || 0) + r.partySize * 500)
      }
    })
    const dailyRevenue = last7Days.map(date => ({
      date,
      revenue: dailyMap.get(date) || 0,
    }))

    return success({
      totalReservations,
      confirmedReservations,
      pendingReservations,
      cancelledReservations,
      totalRevenue: reservations.reduce((acc, r) => acc + r.partySize * 500, 0),
      averagePartySize: Math.round(avgPartySize * 10) / 10,
      menuItems,
      inventoryItems,
      queueItems,
      peakHours,
      reservationsByStatus: [
        { status: 'CONFIRMED', count: confirmedReservations },
        { status: 'PENDING', count: pendingReservations },
        { status: 'CANCELLED', count: cancelledReservations },
      ],
      dailyRevenue,
    })
  } catch {
    return serverError()
  }
}
