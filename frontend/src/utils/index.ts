import { Product } from '../types'

export const formatPrice = (price: number | undefined): string => {
  if (price === undefined) return 'N/A'
  return `${price.toFixed(2)} ₺`
}

export const sortByPrice = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => {
    const priceA = a.minPrice || Infinity
    const priceB = b.minPrice || Infinity
    return priceA - priceB
  })
}

export const sortByFreshness = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => {
    const freshA = a.freshness === 'Taze' ? 1 : 0
    const freshB = b.freshness === 'Taze' ? 1 : 0
    return freshB - freshA
  })
}

export const findCheapestProduct = (products: Product[]): Product | null => {
  if (products.length === 0) return null
  return products.reduce((cheapest, current) => {
    const cheapestPrice = cheapest.minPrice || Infinity
    const currentPrice = current.minPrice || Infinity
    return currentPrice < cheapestPrice ? current : cheapest
  })
}

