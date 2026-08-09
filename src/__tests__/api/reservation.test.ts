import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST, PUT } from '@/app/api/reservation/route'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'

const mockSession = { user: { email: 'admin@test.com', name: 'Admin', role: 'ADMIN' } }
const mockCustomerSession = { user: { email: 'customer@test.com', name: 'Customer', role: 'CUSTOMER' } }

function jsonRequest(body: unknown, method = 'POST'): Request {
  return new Request('http://localhost/api/reservation', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('/api/reservation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns 401 when unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const res = await GET()
      expect(res.status).toBe(401)
    })

    it('returns 200 and reservations when customer (non-admin)', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockCustomerSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'u1', role: 'CUSTOMER' } as never)
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([] as never)
      const res = await GET()
      expect(res.status).toBe(200)
    })

    it('returns reservations for admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([] as never)
      const res = await GET()
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual([])
    })
  })

  describe('POST', () => {
    it('returns 401 when unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const res = await POST(jsonRequest({ date: '2026-09-01T10:00:00Z', partySize: 4 }))
      expect(res.status).toBe(401)
    })

    it('returns 400 for invalid body', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockCustomerSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'u1', role: 'CUSTOMER' } as never)
      const res = await POST(jsonRequest({ date: 'invalid', partySize: -1 }))
      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toBe('Validation failed')
    })

    it('returns 400 when partySize exceeds max', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockCustomerSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'u1', role: 'CUSTOMER' } as never)
      const res = await POST(jsonRequest({ date: '2026-09-01T10:00:00Z', partySize: 99 }))
      expect(res.status).toBe(400)
    })

    it('creates reservation with valid data', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockCustomerSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'u1', role: 'CUSTOMER' } as never)
      vi.mocked(prisma.reservation.create).mockResolvedValue({ id: 'r1', userId: 'u1', status: 'PENDING' } as never)
      const res = await POST(jsonRequest({ date: '2026-09-01T10:00:00Z', partySize: 4 }))
      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.id).toBe('r1')
      expect(data.status).toBe('PENDING')
    })

    it('rejects extra fields (no mass assignment)', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockCustomerSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'u1', role: 'CUSTOMER' } as never)
      vi.mocked(prisma.reservation.create).mockResolvedValue({ id: 'r1' } as never)
      await POST(jsonRequest({ date: '2026-09-01T10:00:00Z', partySize: 4, role: 'ADMIN', userId: 'hacker' }))
      expect(prisma.reservation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ userId: 'u1' }),
      })
    })
  })

  describe('PUT', () => {
    it('returns 401 when unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const res = await PUT(jsonRequest({ id: 'r1', status: 'CONFIRMED' }))
      expect(res.status).toBe(401)
    })

    it('returns 401 when customer (non-admin)', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockCustomerSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'CUSTOMER' } as never)
      const res = await PUT(jsonRequest({ id: 'r1', status: 'CONFIRMED' }))
      expect(res.status).toBe(401)
    })

    it('returns 400 for missing id', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      const res = await PUT(jsonRequest({ status: 'CONFIRMED' }))
      expect(res.status).toBe(400)
    })

    it('updates reservation for admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      vi.mocked(prisma.reservation.update).mockResolvedValue({ id: 'r1', status: 'CONFIRMED' } as never)
      const res = await PUT(jsonRequest({ id: 'r1', status: 'CONFIRMED' }))
      expect(res.status).toBe(200)
    })
  })
})
