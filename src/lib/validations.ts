import { z } from 'zod'

const idSchema = z.string().min(1, 'ID is required')

export const reservationStatusEnum = z.enum(['BOOKED', 'COMPLETED', 'CANCELLED', 'PENDING', 'CONFIRMED'])

export const createReservationSchema = z.object({
  date: z.string().min(1, 'Date is required').refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  partySize: z.number().int().min(1, 'Party size must be at least 1').max(20, 'Party size cannot exceed 20'),
  timeSlot: z.string().max(50).optional().default('12:00 PM'),
  name: z.string().max(100).optional().default('Guest'),
  email: z.string().email('Invalid email address').optional().default('guest@chokhojeeman.com'),
  phone: z.string().max(30).optional().default(''),
  tableInfo: z.string().max(100).optional().nullable(),
})

export const updateReservationSchema = z.object({
  id: idSchema,
  date: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid date format'),
  partySize: z.number().int().min(1).max(20).optional(),
  status: reservationStatusEnum.optional(),
  timeSlot: z.string().max(50).optional(),
  name: z.string().max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  tableInfo: z.string().max(100).optional().nullable(),
})

export const createQueueSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  partySize: z.number().int().min(1, 'Party size must be at least 1').max(20, 'Party size cannot exceed 20'),
})

export const queueStatusEnum = z.enum(['WAITING', 'SEATED', 'CANCELLED'])

export const updateQueueSchema = z.object({
  id: idSchema,
  status: queueStatusEnum.optional(),
})

export const createMenuSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  hindiName: z.string().max(200).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required').max(100),
  section: z.string().max(100).optional().nullable(),
  context: z.string().max(50).optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  imageType: z.string().max(100).optional().nullable(),
  includedItems: z.string().max(2000).optional().nullable(),
  availability: z.string().max(50).optional().nullable(),
  isSignature: z.boolean().optional(),
})

export const updateMenuSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(200).optional(),
  hindiName: z.string().max(200).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  price: z.number().positive().optional(),
  category: z.string().min(1).max(100).optional(),
  section: z.string().max(100).optional().nullable(),
  context: z.string().max(50).optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  imageType: z.string().max(100).optional().nullable(),
  includedItems: z.string().max(2000).optional().nullable(),
  availability: z.string().max(50).optional().nullable(),
  isSignature: z.boolean().optional(),
})

export const deleteIdSchema = z.object({
  id: idSchema,
})

export const createInventorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  unit: z.string().min(1, 'Unit is required').max(50),
})

export const updateInventorySchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(200).optional(),
  quantity: z.number().int().min(0).optional(),
  unit: z.string().min(1).max(50).optional(),
})

export const createGallerySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional().nullable(),
  imageUrl: z.string().min(1, 'Image URL is required'),
  imageAlt: z.string().min(1, 'Image alt text is required').max(200),
  category: z.string().min(1, 'Category is required').max(50),
  sortOrder: z.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(false),
})

export const updateGallerySchema = createGallerySchema.partial().extend({
  id: idSchema,
})

export const updateMenuImageSchema = z.object({
  id: idSchema,
  imageUrl: z.string().nullable(),
  imageAlt: z.string().optional().nullable(),
})
