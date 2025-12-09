import apiClient from './api'

export const adminService = {
  // Product Management
  createProduct: async (productData: any) => {
    const response = await apiClient.post('/admin/products', productData)
    return response.data
  },

  updateProduct: async (productId: string, productData: any) => {
    const response = await apiClient.put(`/admin/products/${productId}`, productData)
    return response.data
  },

  deleteProduct: async (productId: string) => {
    const response = await apiClient.delete(`/admin/products/${productId}`)
    return response.data
  },

  // Market Management
  createMarket: async (marketData: any) => {
    const response = await apiClient.post('/admin/markets', marketData)
    return response.data
  },

  updateMarket: async (marketId: string, marketData: any) => {
    const response = await apiClient.put(`/admin/markets/${marketId}`, marketData)
    return response.data
  },

  deleteMarket: async (marketId: string) => {
    const response = await apiClient.delete(`/admin/markets/${marketId}`)
    return response.data
  },

  // Dashboard
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard')
    return response.data
  },

  getStats: async () => {
    const response = await apiClient.get('/admin/stats')
    return response.data
  },

  // Product Price Management
  addProductToMarket: async (marketId: string, productData: any) => {
    const response = await apiClient.post(`/admin/markets/${marketId}/products`, productData)
    return response.data
  },

  removeProductFromMarket: async (marketId: string, productId: string, stallNumber: string) => {
    const response = await apiClient.delete(`/admin/markets/${marketId}/products/${productId}/stalls/${stallNumber}`)
    return response.data
  },
}

