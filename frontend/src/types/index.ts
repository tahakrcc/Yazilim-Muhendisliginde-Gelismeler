export interface Product {
  id: string
  name: string
  category: string
  unit: string
  freshness?: string
  minPrice?: number
  stallNumber?: string
  vendorName?: string
  location?: { x: number; y: number; z: number }
  allPrices?: Array<{ price: number; stallNumber: string; vendorName: string }>
}

export interface Market {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  isOpenToday: boolean
  openingHours: string
}

export interface SearchResponse {
  results: Product[]
  aiSuggestions: string[]
  query: string
  count: number
}

