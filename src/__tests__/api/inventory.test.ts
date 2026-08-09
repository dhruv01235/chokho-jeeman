import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE } from '@/app/api/inventory/route'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'

const mockAdminSession = { user: { email: 'admin@test.com', name: 'Admin', role: 'ADMIN' } }
const mockCustomerSession = { user: { email: 'customer@test.com', name: 'Customer', role: 'CUSTOMER' } }

function jsonRequest(body: unknown, method = 'POST'): Request {
  return new Request('http://localhost/api/inventory', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('/api/inventory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns 401 when unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const res = await GET()
      expect(res.status).toBe(401)
    })

    it('returns 401 when customer', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockCustomerSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'CUSTOMER' } as never)
      const res = await GET()
      expect(res.status).toBe(401)
    })

    it('returns inventory for admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      vi.mocked(prisma.inventoryItem.findMany).mockResolvedValue([] as never)
      const res = await GET()
      expect(res.status).toBe(200)
    })
  })

  describe('POST', () => {
    it('returns 401 when unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const res = await POST(jsonRequest({ name: 'Ghee', quantity: 10, unit: 'kg' }))
      expect(res.status).toBe(401)
    })

    it('returns 400 for invalid body', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      const res = await POST(jsonRequest({ name: '', quantity: -1 }))
      expect(res.status).toBe(400)
    })

    it('creates inventory item as admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      vi.mocked(prisma.inventoryItem.create).mockResolvedValue({ id: 'i1' } as never)
      const res = await POST(jsonRequest({ name: 'Ghee', quantity: 10, unit: 'kg' }))
      expect(res.status).toBe(201)
    })
  })

  describe('PUT', () => {
    it('returns 401 when unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const res = await PUT(jsonRequest({ id: 'i1', quantity: 20 }))
      expect(res.status).toBe(401)
    })

    it('returns 400 for missing id', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      const res = await PUT(jsonRequest({ quantity: 20 }))
      expect(res.status).toBe(400)
    })

    it('updates as admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      vi.mocked(prisma.inventoryItem.update).mockResolvedValue({ id: 'i1' } as never)
      const res = await PUT(jsonRequest({ id: 'i1', quantity: 20 }))
      expect(res.status).toBe(200)
    })
  })

  describe('DELETE', () => {
    it('returns 401 when unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const req = new Request('http://localhost/api/inventory?id=i1', { method: 'DELETE' })
      const res = await DELETE(req)
      expect(res.status).toBe(401)
    })

    it('returns 400 when id missing', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      const req = new Request('http://localhost/api/inventory', { method: 'DELETE' })
      const res = await DELETE(req)
      expect(res.status).toBe(400)
    })

    it('deletes as admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      vi.mocked(prisma.inventoryItem.delete).mockResolvedValue({} as never)
      const req = new Request('http://localhost/api/inventory?id=i1', { method: 'DELETE' })
      const res = await DELETE(req)
      expect(res.status).toBe(200)
    })
  })
})
