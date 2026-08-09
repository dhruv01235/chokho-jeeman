import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { createGallerySchema } from '@/lib/validations'
import { unauthorized, badRequest, serverError, created, success } from '@/lib/api-helpers'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return success(images)
  } catch (error) {
    console.error('Fetch gallery error:', error)
    return serverError('Failed to fetch gallery images')
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const body = await request.json()
    const parsed = createGallerySchema.safeParse(body)
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors)
    }

    const item = await prisma.galleryImage.create({
      data: parsed.data,
    })

    revalidatePath('/gallery')
    revalidatePath('/admin')

    return created(item)
  } catch (error) {
    console.error('Create gallery error:', error)
    return serverError('Failed to create gallery image')
  }
}
