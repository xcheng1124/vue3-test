// 环境变量配置
// 在开发环境中，使用相对路径让请求通过Vite代理
// 在生产环境中，使用完整URL
export const isDevelopment = import.meta.env.DEV
export const API_BASE_URL = isDevelopment ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://dev.178778.xyz')
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development'
