import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/analytics/route'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'

const mockAdminSession = { user: { email: 'admin@test.com', name: 'Admin', role: 'ADMIN' } }
const mockCustomerSession = { user: { email: 'customer@test.com', name: 'Customer', role: 'CUSTOMER' } }

describe('/api/analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns 401 when unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const res = await GET()
      expect(res.status).toBe(401)
    })

    it('returns 401 when customer (non-admin)', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockCustomerSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'CUSTOMER' } as never)
      const res = await GET()
      expect(res.status).toBe(401)
    })

    it('returns analytics for admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      vi.mocked(prisma.reservation.count).mockResolvedValue(0)
      vi.mocked(prisma.menuItem.count).mockResolvedValue(0)
      vi.mocked(prisma.inventoryItem.count).mockResolvedValue(0)
      vi.mocked(prisma.queueItem.count).mockResolvedValue(0)
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([] as never)
      const res = await GET()
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toHaveProperty('totalReservations')
      expect(data).toHaveProperty('menuItems')
      expect(data).toHaveProperty('dailyRevenue')
    })
  })
})
