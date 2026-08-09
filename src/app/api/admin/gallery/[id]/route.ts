import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { updateGallerySchema } from '@/lib/validations'
import { unauthorized, badRequest, serverError, success } from '@/lib/api-helpers'
import { revalidatePath } from 'next/cache'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateGallerySchema.safeParse({ ...body, id })
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors)
    }

    const { id: __, ...data } = parsed.data
    void __;

    const updated = await prisma.galleryImage.update({
      where: { id },
      data,
    })

    revalidatePath('/gallery')
    revalidatePath('/admin')

    return success(updated)
  } catch (error) {
    console.error('Update gallery error:', error)
    return serverError('Failed to update gallery image')
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const { id } = await params
    await prisma.galleryImage.delete({
      where: { id },
    })

    revalidatePath('/gallery')
    revalidatePath('/admin')

    return success({ success: true })
  } catch (error) {
    console.error('Delete gallery error:', error)
    return serverError('Failed to delete gallery image')
  }
}
