import { prisma } from '@/lib/db'
import { serverError, success } from '@/lib/api-helpers'

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return success(images)
  } catch (error) {
    console.error('Fetch public gallery error:', error)
    return serverError('Failed to fetch gallery')
  }
}
