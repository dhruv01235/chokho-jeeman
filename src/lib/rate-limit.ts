import redis from './redis'

export type RateLimitConfig = {
  windowMs: number
  max: number
}

type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60_000,
  max: 100,
}

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  auth: { windowMs: 60_000, max: 10 },
  reservation: { windowMs: 60_000, max: 5 },
  queue: { windowMs: 60_000, max: 10 },
  menu: { windowMs: 60_000, max: 60 },
  inventory: { windowMs: 60_000, max: 60 },
  analytics: { windowMs: 60_000, max: 30 },
  default: DEFAULT_CONFIG,
}

export async function rateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG,
  failClosed: boolean = false
): Promise<RateLimitResult> {
  try {
    const now = Date.now()
    const windowStart = now - config.windowMs
    const redisKey = `rl:${key}`

    const pipeline = redis.pipeline()
    pipeline.zremrangebyscore(redisKey, 0, windowStart)
    pipeline.zadd(redisKey, now.toString(), `${now}:${Math.random().toString(36).slice(2)}`)
    pipeline.zcard(redisKey)
    pipeline.expire(redisKey, Math.ceil(config.windowMs / 1000))

    const results = await pipeline.exec()
    const count = (results?.[2]?.[1] as number) || 0

    return {
      allowed: count <= config.max,
      remaining: Math.max(0, config.max - count),
      resetAt: now + config.windowMs,
    }
  } catch {
    // If Redis is unavailable, fail closed if requested for sensitive endpoints,
    // otherwise fail open for availability on read-only endpoints.
    if (failClosed) {
      return { allowed: false, remaining: 0, resetAt: Date.now() + config.windowMs }
    }
    return { allowed: true, remaining: config.max, resetAt: Date.now() + config.windowMs }
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp
  return 'unknown'
}
