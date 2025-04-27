import { defineStore } from 'pinia'
import apiService from '@/api'
import type { AxiosError } from 'axios'
import Cookies from 'js-cookie'

interface UserInfo {
  id: number
  name: string
  email: string
  [key: string]: unknown
}

interface AuthState {
  user: UserInfo | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  csrfToken: string | null
}

interface ErrorResponse {
  message?: string
  [key: string]: unknown
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    csrfToken: null
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    // 获取CSRF令牌
    async getCsrfToken() {
      try {
        console.log('认证存储：获取CSRF令牌')
        await apiService.getCsrfCookie()
        // 获取后从cookie中读取token
        this.csrfToken = Cookies.get('XSRF-TOKEN') || null
        console.log('认证存储：CSRF令牌已更新', this.csrfToken)
        return this.csrfToken
      } catch (error) {
        console.error('获取CSRF令牌失败:', error)
        return null
      }
    },

    // 登录
    async login(email: string, password: string) {
      this.loading = true
      this.error = null

      try {
        // 先获取CSRF令牌
        const token = await this.getCsrfToken()
        console.log('登录前CSRF令牌状态:', token ? '已获取' : '未获取')

        // 登录请求
        const response = await apiService.login(email, password)

        if (response.status === 200) {
          // 获取用户信息
          await this.fetchUserInfo()
        }
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        // 处理419 CSRF错误
        if (axiosError.response?.status === 419) {
          this.error = 'CSRF令牌不匹配，请刷新页面后重试'
          console.error('CSRF令牌不匹配:', axiosError.response.data)
        } else {
          this.error = axiosError.response?.data?.message || '登录失败，请检查邮箱和密码'
        }
        this.isAuthenticated = false
        this.user = null
      } finally {
        this.loading = false
      }
    },

    // 登出
    async logout() {
      this.loading = true

      try {
        await apiService.logout()
        this.user = null
        this.isAuthenticated = false
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        this.error = axiosError.response?.data?.message || '登出失败'
      } finally {
        this.loading = false
      }
    },

    // 获取用户信息
    async fetchUserInfo() {
      this.loading = true

      try {
        const response = await apiService.getUserInfo()
        if (response.status === 200) {
          this.user = response.data?.data
          this.isAuthenticated = true
          this.error = null
        }
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        this.error = axiosError.response?.data?.message || '获取用户信息失败'
        this.isAuthenticated = false
        this.user = null
      } finally {
        this.loading = false
      }
    },

    // 检查认证状态
    async checkAuth() {
      if (!this.isAuthenticated) {
        // 获取CSRF令牌
        await this.getCsrfToken()
        // 尝试获取用户信息
        await this.fetchUserInfo()
      }
    }
  }
})
