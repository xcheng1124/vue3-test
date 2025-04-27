import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' }
    }
  ]
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    const authStore = useAuthStore()

    // 检查用户是否已登录
    if (!authStore.isAuthenticated) {
      try {
        // 尝试获取用户信息（可能通过cookie自动登录）
        await authStore.checkAuth()

        if (!authStore.isAuthenticated) {
          // 未认证，重定向到登录页
          next({ name: 'login' })
          return
        }
      } catch (error) {
        console.error('认证检查失败:', error)
        next({ name: 'login' })
        return
      }
    }
  }

  next()
})

export default router
