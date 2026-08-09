import { describe, it, expect } from 'vitest'
import { resolveMenuItemImage, FOOD_IMAGES } from '@/data/menu-data'

describe('Menu Image Priority', () => {
  it('gives database imageUrl absolute priority over FOOD_IMAGES fallback', () => {
    const customImageUrl = '/uploads/test-sada-thali.jpg'
    const resolved = resolveMenuItemImage(customImageUrl, 'Custom photo', 'thali')

    expect(resolved).not.toBeNull()
    expect(resolved!.src).toBe(customImageUrl)
    expect(resolved!.src).not.toBe(FOOD_IMAGES['thali'])
    expect(resolved!.alt).toBe('Custom photo')
  })

  it('falls back to FOOD_IMAGES when imageUrl is absent', () => {
    const resolved = resolveMenuItemImage(null, null, 'thali')

    expect(resolved!.src).toBe(FOOD_IMAGES['thali'])
  })

  it('returns null (SVG fallback) when neither imageUrl nor FOOD_IMAGES exists', () => {
    const resolved = resolveMenuItemImage(null, null, 'unknown-type' as never)

    expect(resolved).toBeNull()
  })
})
