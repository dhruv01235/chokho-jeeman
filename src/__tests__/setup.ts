import { vi } from 'vitest'

const mockPrisma: Record<string, unknown> = {
    user: {
      findUnique: vi.fn(),
    },
    reservation: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
    },
    menuItem: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      upsert: vi.fn(),
    },
    inventoryItem: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    queueItem: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn((callback: (tx: Record<string, unknown>) => Promise<unknown>) => callback(mockPrisma)),
  };

vi.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}))

vi.mock('@/lib/redis', () => ({
  default: {
    pipeline: vi.fn(() => ({
      zremrangebyscore: vi.fn(),
      zadd: vi.fn(),
      zcard: vi.fn(),
      expire: vi.fn(),
      exec: vi.fn(async () => [[null, 0], [null, 'OK'], [null, 1], [null, 1]]),
    })),
  },
}))

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))
