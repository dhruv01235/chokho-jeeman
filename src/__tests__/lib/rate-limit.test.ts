import { describe, it, expect, vi, beforeEach } from 'vitest'
import { rateLimit, RATE_LIMITS, getClientIp } from '@/lib/rate-limit'
import redis from '@/lib/redis'

describe('rateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows request within limit', async () => {
    const pipeline = {
      zremrangebyscore: vi.fn(),
      zadd: vi.fn(),
      zcard: vi.fn(),
      expire: vi.fn(),
      exec: vi.fn(async () => [[null, 0], [null, 'OK'], [null, 1], [null, 1]]),
    }
    vi.mocked(redis.pipeline).mockReturnValue(pipeline as never)

    const result = await rateLimit('test:key', { windowMs: 60000, max: 10 })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(9)
  })

  it('rejects request over limit', async () => {
    const pipeline = {
      zremrangebyscore: vi.fn(),
      zadd: vi.fn(),
      zcard: vi.fn(),
      expire: vi.fn(),
      exec: vi.fn(async () => [[null, 0], [null, 'OK'], [null, 11], [null, 1]]),
    }
    vi.mocked(redis.pipeline).mockReturnValue(pipeline as never)

    const result = await rateLimit('test:key', { windowMs: 60000, max: 10 })
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('fails open on Redis error', async () => {
    const failFn = (): never => { throw new Error('Redis down') }
    vi.mocked(redis.pipeline).mockImplementation(failFn)

    const result = await rateLimit('test:key', { windowMs: 60000, max: 10 })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(10)
  })

  it('has correct rate limit configs', () => {
    expect(RATE_LIMITS.auth.max).toBe(10)
    expect(RATE_LIMITS.reservation.max).toBe(5)
    expect(RATE_LIMITS.queue.max).toBe(10)
    expect(RATE_LIMITS.menu.max).toBe(60)
    expect(RATE_LIMITS.inventory.max).toBe(60)
    expect(RATE_LIMITS.analytics.max).toBe(30)
  })
})

describe('getClientIp', () => {
  it('extracts IP from x-forwarded-for', () => {
    const request = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    })
    expect(getClientIp(request)).toBe('1.2.3.4')
  })

  it('extracts IP from x-real-ip', () => {
    const request = new Request('http://localhost', {
      headers: { 'x-real-ip': '1.2.3.4' },
    })
    expect(getClientIp(request)).toBe('1.2.3.4')
  })

  it('returns unknown when no IP headers', () => {
    const request = new Request('http://localhost')
    expect(getClientIp(request)).toBe('unknown')
  })
})
