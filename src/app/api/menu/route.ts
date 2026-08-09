import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { createMenuSchema, updateMenuSchema, deleteIdSchema } from '@/lib/validations'
import { unauthorized, badRequest, serverError, created, success } from '@/lib/api-helpers'
import { ALL_MENU_ITEMS } from '@/data/menu-data'

async function ensureMenuSynced() {
  try {
    const existingCount = await prisma.menuItem.count()
    if (existingCount >= 75) {
      return
    }

    for (const item of ALL_MENU_ITEMS) {
      const includedStr = Array.isArray(item.includedItems)
        ? item.includedItems.join(', ')
        : (item.includedItems || null)

      await prisma.menuItem.upsert({
        where: { id: item.id },
        update: {
          name: item.name,
          hindiName: item.hindiName || null,
          description: item.description || null,
          price: item.price,
          category: item.category,
          section: item.section || null,
          context: item.context || 'dine-in',
          imageType: item.imageType || null,
          includedItems: includedStr,
          availability: item.availability || 'daily',
          isSignature: item.isSignature || false,
        },
        create: {
          id: item.id,
          name: item.name,
          hindiName: item.hindiName || null,
          description: item.description || null,
          price: item.price,
          category: item.category,
          section: item.section || null,
          context: item.context || 'dine-in',
          imageType: item.imageType || null,
          includedItems: includedStr,
          availability: item.availability || 'daily',
          isSignature: item.isSignature || false,
        },
      })
    }
  } catch (err) {
    console.error('Menu sync error:', err)
    throw err
  }
}

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await ensureMenuSynced()
    const items = await prisma.menuItem.findMany({ orderBy: { category: 'asc' } })
    return success(items, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('Failed to load menu items:', error)
    return serverError('Unable to load menu items. Check database connection.')
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const body = await request.json()
    const parsed = createMenuSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors)
    }

    const item = await prisma.menuItem.create({ data: parsed.data })
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
    const parsed = updateMenuSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors)
    }

    const { id, ...data } = parsed.data
    const item = await prisma.menuItem.update({ where: { id }, data })
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

    await prisma.menuItem.delete({ where: { id: parsed.data.id } })
    return success({ success: true })
  } catch {
    return serverError()
  }
}
