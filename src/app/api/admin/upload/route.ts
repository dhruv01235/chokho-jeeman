import { requireAdmin } from '@/lib/auth'
import { unauthorized, badRequest, serverError, success } from '@/lib/api-helpers'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return unauthorized()

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return badRequest('No file provided')
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return badRequest('Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.')
    }

    if (file.size > MAX_FILE_SIZE) {
      return badRequest('File size exceeds the 5MB limit.')
    }

    const extMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    }
    const ext = extMap[file.type] || '.jpg'
    const safeFilename = `${crypto.randomUUID()}${ext}`

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filePath = path.join(uploadsDir, safeFilename)

    // Ensure path traversal protection by verifying resolved path starts with uploadsDir
    if (!path.resolve(filePath).startsWith(path.resolve(uploadsDir))) {
      return badRequest('Invalid file path')
    }

    await writeFile(filePath, buffer)

    return success({
      url: `/uploads/${safeFilename}`,
      filename: safeFilename,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return serverError('Failed to upload file')
  }
}
