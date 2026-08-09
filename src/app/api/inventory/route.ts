import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { createInventorySchema, updateInventorySchema, deleteIdSchema } from '@/lib/validations'
import { unauthorized, badRequest, serverError, created, success } from '@/lib/api-helpers'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const items = await prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } })
    return success(items)
  } catch {
    return serverError()
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const body = await request.json()
    const parsed = createInventorySchema.safeParse(body)
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors)
    }

    const item = await prisma.inventoryItem.create({ data: parsed.data })
    return created(item)
  } catch {
    return serverError()
  }
}

export async function PUT(request: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const body = await request.json()
    const parsed = updateInventorySchema.safeParse(body)
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors)
    }

    const { id, ...data } = parsed.data
    const item = await prisma.inventoryItem.update({ where: { id }, data })
    return success(item)
  } catch {
    return serverError()
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const parsed = deleteIdSchema.safeParse({ id })
    if (!parsed.success) {
      return badRequest('ID is required')
    }

    await prisma.inventoryItem.delete({ where: { id: parsed.data.id } })
    return success({ success: true })
  } catch {
    return serverError()
  }
}
