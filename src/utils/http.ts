import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { API_BASE_URL } from '../config/env'

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true // 允许携带跨域cookie
})

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从cookie获取CSRF token并添加到请求头
    const csrfToken = Cookies.get('XSRF-TOKEN')
    if (csrfToken && config.headers) {
      config.headers['X-XSRF-TOKEN'] = csrfToken
    } else if (!csrfToken) {
      console.warn('CSRF令牌未找到！')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    const { response } = error
    if (response) {
      // 根据不同的HTTP状态码处理错误
      switch (response.status) {
        case 401: // 未授权
          console.error('未授权，请登录')
          break
        case 403: // 禁止访问
          console.error('没有权限访问此资源')
          break
        case 404: // 资源不存在
          console.error('请求的资源不存在')
          break
        case 419: // CSRF令牌不匹配
          console.error('CSRF令牌不匹配，尝试刷新CSRF令牌')
          break
        case 422: // 验证错误
          console.error('数据验证失败')
          break
        case 500: // 服务器错误
          console.error('服务器错误，请稍后再试')
          break
        default:
          console.error(`请求错误: ${response.status}`)
      }
    } else {
      // 网络错误或请求被取消
      console.error('网络错误，请检查您的网络连接')
    }
    return Promise.reject(error)
  }
)

// 获取CSRF令牌并存储为Promise
let csrfPromise: Promise<AxiosResponse> | null = null

// 获取CSRF令牌的函数
export const getCsrfToken = async () => {
  if (!csrfPromise) {
    console.log('正在获取CSRF令牌...')
    csrfPromise = api.get('/csrf-cookie')
      .then(response => {
        Cookies.get('XSRF-TOKEN')
        return response
      })
      .catch(error => {
        console.error('获取CSRF令牌失败:', error)
        csrfPromise = null
        throw error
      })
  }
  return csrfPromise
}

// 封装GET请求
export const get = <T = unknown>(url: string, params?: Record<string, unknown>): Promise<AxiosResponse<T>> => {
  return api.get(url, { params })
}

// 封装POST请求
export const post = <T = unknown>(url: string, data?: Record<string, unknown> | FormData): Promise<AxiosResponse<T>> => {
  return api.post(url, data)
}

// 封装PUT请求
export const put = <T = unknown>(url: string, data?: Record<string, unknown>): Promise<AxiosResponse<T>> => {
  return api.put(url, data)
}

// 封装DELETE请求
export const del = <T = unknown>(url: string, params?: Record<string, unknown>): Promise<AxiosResponse<T>> => {
  return api.delete(url, { params })
}

export default api
