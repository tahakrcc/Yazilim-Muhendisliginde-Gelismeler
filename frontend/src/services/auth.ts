const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_data'

export interface User {
  email: string
  role: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:8080/api' : '/api')

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      if (data.success && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token)
        localStorage.setItem(USER_KEY, JSON.stringify({ email: data.email, role: data.role }))
        return data
      }
      throw new Error(data.message || 'Login failed')
    } catch (error) {
      console.warn("Backend login failed, attempting mock login...", error);

      // MOCK FALLBACK for MVP/Demo
      if (email === 'admin@pazar.com' && password === '123456') {
        const mockData = {
          success: true,
          token: 'mock-admin-token',
          email: email,
          role: 'ADMIN'
        };
        localStorage.setItem(TOKEN_KEY, mockData.token)
        localStorage.setItem(USER_KEY, JSON.stringify({ email: mockData.email, role: mockData.role }))
        return mockData;
      }
      if (email === 'user@pazar.com' && password === '123456') {
        const mockData = {
          success: true,
          token: 'mock-user-token',
          email: email,
          role: 'USER'
        };
        localStorage.setItem(TOKEN_KEY, mockData.token)
        localStorage.setItem(USER_KEY, JSON.stringify({ email: mockData.email, role: mockData.role }))
        return mockData;
      }

      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY)
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY)
  },
}

