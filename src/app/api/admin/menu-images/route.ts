import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { updateMenuImageSchema } from '@/lib/validations'
import { unauthorized, badRequest, serverError, success } from '@/lib/api-helpers'
import { revalidatePath } from 'next/cache'

export async function PUT(request: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const body = await request.json()
    const parsed = updateMenuImageSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors)
    }

    const { id, imageUrl, imageAlt } = parsed.data

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        imageUrl,
        imageAlt,
        imageUpdatedAt: new Date(),
      },
    })

    revalidatePath('/menu')
    revalidatePath('/admin')
    revalidatePath('/')

    return success(updated)
  } catch (error) {
    console.error('Menu image update error:', error)
    return serverError('Failed to update menu image')
  }
}
