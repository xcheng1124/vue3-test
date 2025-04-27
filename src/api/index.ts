import { getCsrfToken, get, post } from '@/utils/http'
// API接口定义
export const apiService = {
  // 获取服务器基本信息
  getServerInfo: () => get(`${import.meta.env.VITE_APP_API}/`),

  // 获取CSRF Cookie
  getCsrfCookie: () => getCsrfToken(),

  // 用户登录
  login: async (email: string, password: string) => {
    // 确保先获取CSRF令牌
    // await getCsrfToken()
    return post(`${import.meta.env.VITE_APP_API}/login`, { email, password })
  },

  // 用户登出
  logout: async () => {
    // 确保先获取CSRF令牌
    // await getCsrfToken()
    return post(`${import.meta.env.VITE_APP_API}/logout`)
  },

  // 获取用户信息
  getUserInfo: () => get(`${import.meta.env.VITE_APP_API}/api/user`)
}

export default apiService
