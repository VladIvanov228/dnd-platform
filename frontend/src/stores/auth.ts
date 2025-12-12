import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

interface User {
  id: number
  email: string
  username: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref<boolean>(!!token.value)

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      
      token.value = response.data.token
      user.value = response.data.user
      isAuthenticated.value = true
      
      localStorage.setItem('token', token.value)
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { email, username, password })
      
      token.value = response.data.token
      user.value = response.data.user
      isAuthenticated.value = true
      
      localStorage.setItem('token', token.value)
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout
  }
})