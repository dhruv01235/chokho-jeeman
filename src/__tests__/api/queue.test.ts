import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST, PUT } from '@/app/api/queue/route'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'

const mockAdminSession = { user: { email: 'admin@test.com', name: 'Admin', role: 'ADMIN' } }

function jsonRequest(body: unknown, method = 'POST'): Request {
  return new Request('http://localhost/api/queue', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('/api/queue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns queue publicly', async () => {
      vi.mocked(prisma.queueItem.findMany).mockResolvedValue([] as never)
      const res = await GET()
      expect(res.status).toBe(200)
    })
  })

  describe('POST', () => {
    it('returns 400 for invalid body', async () => {
      const res = await POST(jsonRequest({ name: '', partySize: -1 }))
      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toBe('Validation failed')
    })

    it('returns 400 when name missing', async () => {
      const res = await POST(jsonRequest({ partySize: 4 }))
      expect(res.status).toBe(400)
    })

    it('returns 400 when partySize missing', async () => {
      const res = await POST(jsonRequest({ name: 'Test' }))
      expect(res.status).toBe(400)
    })

    it('creates queue item with valid data', async () => {
      vi.mocked(prisma.queueItem.count).mockResolvedValue(2)
      vi.mocked(prisma.queueItem.create).mockResolvedValue({ id: 'q1', name: 'Test', partySize: 4 } as never)
      const res = await POST(jsonRequest({ name: 'Test', partySize: 4 }))
      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.name).toBe('Test')
    })

    it('rejects extra fields', async () => {
      vi.mocked(prisma.queueItem.count).mockResolvedValue(0)
      vi.mocked(prisma.queueItem.create).mockResolvedValue({ id: 'q1' } as never)
      await POST(jsonRequest({ name: 'Test', partySize: 4, status: 'SEATED', injected: true }))
      expect(prisma.queueItem.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ name: 'Test', partySize: 4, status: 'WAITING' }),
      })
    })
  })

  describe('PUT', () => {
    it('returns 401 when unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const res = await PUT(jsonRequest({ id: 'q1', status: 'SEATED' }))
      expect(res.status).toBe(401)
    })

    it('returns 401 when customer (non-admin)', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { email: 'c@test.com', role: 'CUSTOMER' } } as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'CUSTOMER' } as never)
      const res = await PUT(jsonRequest({ id: 'q1', status: 'SEATED' }))
      expect(res.status).toBe(401)
    })

    it('returns 400 for invalid status', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      const res = await PUT(jsonRequest({ id: 'q1', status: 'INVALID' }))
      expect(res.status).toBe(400)
    })

    it('updates queue item as admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      vi.mocked(prisma.queueItem.update).mockResolvedValue({ id: 'q1', status: 'SEATED' } as never)
      const res = await PUT(jsonRequest({ id: 'q1', status: 'SEATED' }))
      expect(res.status).toBe(200)
    })
  })
})
