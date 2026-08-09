import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE } from '@/app/api/menu/route'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'

const mockAdminSession = { user: { email: 'admin@test.com', name: 'Admin', role: 'ADMIN' } }
const mockCustomerSession = { user: { email: 'customer@test.com', name: 'Customer', role: 'CUSTOMER' } }

function jsonRequest(body: unknown, method = 'POST'): Request {
  return new Request('http://localhost/api/menu', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('/api/menu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns menu items publicly', async () => {
      vi.mocked(prisma.menuItem.findMany).mockResolvedValue([] as never)
      const res = await GET()
      expect(res.status).toBe(200)
    })
  })

  describe('POST', () => {
    it('returns 401 when unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const res = await POST(jsonRequest({ name: 'Test', price: 100, category: 'Thali' }))
      expect(res.status).toBe(401)
    })

    it('returns 401 when customer (non-admin)', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockCustomerSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'CUSTOMER' } as never)
      const res = await POST(jsonRequest({ name: 'Test', price: 100, category: 'Thali' }))
      expect(res.status).toBe(401)
    })

    it('returns 400 for invalid body', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      const res = await POST(jsonRequest({ name: '', price: -1 }))
      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toBe('Validation failed')
    })

    it('returns 400 when required fields missing', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      const res = await POST(jsonRequest({ name: 'Test' }))
      expect(res.status).toBe(400)
    })

    it('creates menu item as admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      vi.mocked(prisma.menuItem.create).mockResolvedValue({ id: 'm1' } as never)
      const res = await POST(jsonRequest({ name: 'Dal Baati', price: 250, category: 'Thali' }))
      expect(res.status).toBe(201)
    })

    it('rejects extra fields', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      vi.mocked(prisma.menuItem.create).mockResolvedValue({ id: 'm1' } as never)
      await POST(jsonRequest({ name: 'Test', price: 100, category: 'X', injected: true }))
      expect(prisma.menuItem.create).toHaveBeenCalledWith({
        data: expect.not.objectContaining({ injected: true }),
      })
    })
  })

  describe('PUT', () => {
    it('returns 401 when unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const res = await PUT(jsonRequest({ id: 'm1', price: 300 }))
      expect(res.status).toBe(401)
    })

    it('returns 400 for missing id', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      const res = await PUT(jsonRequest({ price: 300 }))
      expect(res.status).toBe(400)
    })

    it('updates as admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      vi.mocked(prisma.menuItem.update).mockResolvedValue({ id: 'm1' } as never)
      const res = await PUT(jsonRequest({ id: 'm1', price: 300 }))
      expect(res.status).toBe(200)
    })
  })

  describe('DELETE', () => {
    it('returns 401 when unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const req = new Request('http://localhost/api/menu?id=m1', { method: 'DELETE' })
      const res = await DELETE(req)
      expect(res.status).toBe(401)
    })

    it('returns 400 when id missing', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      const req = new Request('http://localhost/api/menu', { method: 'DELETE' })
      const res = await DELETE(req)
      expect(res.status).toBe(400)
    })

    it('deletes as admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as never)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)
      vi.mocked(prisma.menuItem.delete).mockResolvedValue({} as never)
      const req = new Request('http://localhost/api/menu?id=m1', { method: 'DELETE' })
      const res = await DELETE(req)
      expect(res.status).toBe(200)
    })
  })
})
