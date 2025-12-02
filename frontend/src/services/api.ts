import axios from 'axios'
import { Product, Market, SearchResponse } from '../types'

const API_BASE_URL = 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const productService = {
  search: async (query: string, marketId?: string): Promise<SearchResponse> => {
    const response = await apiClient.get<SearchResponse>('/products/search', {
      params: { query, marketId: marketId || 'market_1' },
    })
    return response.data
  },

  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products')
    return response.data
  },

  getPrices: async (productId: string, marketId: string) => {
    const response = await apiClient.get(`/products/${productId}/prices`, {
      params: { marketId },
    })
    return response.data
  },

  findCheapest: async (productId: string, marketId: string) => {
    const response = await apiClient.get(`/products/${productId}/cheapest`, {
      params: { marketId },
    })
    return response.data
  },
}

export const marketService = {
  getAll: async (): Promise<Market[]> => {
    const response = await apiClient.get<Market[]>('/markets')
    return response.data
  },

  getById: async (marketId: string) => {
    const response = await apiClient.get(`/markets/${marketId}`)
    return response.data
  },

  getMap: async (marketId: string) => {
    const response = await apiClient.get(`/markets/${marketId}/map`)
    return response.data
  },

  getRoute: async (marketId: string, stallNumber: string) => {
    const response = await apiClient.get(`/markets/${marketId}/route/${stallNumber}`)
    return response.data
  },
}

export default apiClient

