import { describe, it, expect } from 'vitest'
import { createReservationSchema, createMenuSchema, createQueueSchema, createInventorySchema } from '@/lib/validations'

describe('Validation Schemas', () => {
  describe('createReservationSchema', () => {
    it('accepts valid data', () => {
      const result = createReservationSchema.safeParse({ date: '2026-09-01T10:00:00Z', partySize: 4 })
      expect(result.success).toBe(true)
    })

    it('rejects missing date', () => {
      const result = createReservationSchema.safeParse({ partySize: 4 })
      expect(result.success).toBe(false)
    })

    it('rejects partySize of 0', () => {
      const result = createReservationSchema.safeParse({ date: '2026-09-01T10:00:00Z', partySize: 0 })
      expect(result.success).toBe(false)
    })

    it('rejects partySize > 20', () => {
      const result = createReservationSchema.safeParse({ date: '2026-09-01T10:00:00Z', partySize: 21 })
      expect(result.success).toBe(false)
    })

    it('rejects invalid date format', () => {
      const result = createReservationSchema.safeParse({ date: 'not-a-date', partySize: 4 })
      expect(result.success).toBe(false)
    })

    it('rejects negative partySize', () => {
      const result = createReservationSchema.safeParse({ date: '2026-09-01T10:00:00Z', partySize: -1 })
      expect(result.success).toBe(false)
    })
  })

  describe('createMenuSchema', () => {
    it('accepts valid data', () => {
      const result = createMenuSchema.safeParse({ name: 'Dal Baati', price: 250, category: 'Thali' })
      expect(result.success).toBe(true)
    })

    it('rejects missing name', () => {
      const result = createMenuSchema.safeParse({ price: 250, category: 'Thali' })
      expect(result.success).toBe(false)
    })

    it('rejects negative price', () => {
      const result = createMenuSchema.safeParse({ name: 'Test', price: -10, category: 'Thali' })
      expect(result.success).toBe(false)
    })

    it('rejects zero price', () => {
      const result = createMenuSchema.safeParse({ name: 'Test', price: 0, category: 'Thali' })
      expect(result.success).toBe(false)
    })

    it('rejects empty category', () => {
      const result = createMenuSchema.safeParse({ name: 'Test', price: 100, category: '' })
      expect(result.success).toBe(false)
    })
  })

  describe('createQueueSchema', () => {
    it('accepts valid data', () => {
      const result = createQueueSchema.safeParse({ name: 'Sharma', partySize: 4 })
      expect(result.success).toBe(true)
    })

    it('rejects empty name', () => {
      const result = createQueueSchema.safeParse({ name: '', partySize: 4 })
      expect(result.success).toBe(false)
    })

    it('rejects partySize of 0', () => {
      const result = createQueueSchema.safeParse({ name: 'Test', partySize: 0 })
      expect(result.success).toBe(false)
    })
  })

  describe('createInventorySchema', () => {
    it('accepts valid data', () => {
      const result = createInventorySchema.safeParse({ name: 'Ghee', quantity: 10, unit: 'kg' })
      expect(result.success).toBe(true)
    })

    it('rejects negative quantity', () => {
      const result = createInventorySchema.safeParse({ name: 'Ghee', quantity: -1, unit: 'kg' })
      expect(result.success).toBe(false)
    })

    it('accepts zero quantity', () => {
      const result = createInventorySchema.safeParse({ name: 'Ghee', quantity: 0, unit: 'kg' })
      expect(result.success).toBe(true)
    })

    it('rejects missing unit', () => {
      const result = createInventorySchema.safeParse({ name: 'Ghee', quantity: 10 })
      expect(result.success).toBe(false)
    })
  })
})
