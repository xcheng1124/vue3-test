<template>
  <div class="home-container">
    <el-card v-if="authStore.user" class="user-card">
      <template #header>
        <div class="card-header">
          <h1>欢迎, {{ authStore.user.name }}!</h1>
        </div>
      </template>

      <el-descriptions title="用户信息" :column="1" border class="user-info">
        <el-descriptions-item label="ID">{{ authStore.user.id }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ authStore.user.email }}</el-descriptions-item>
      </el-descriptions>

      <el-button type="danger" :loading="authStore.loading" class="logout-button" @click="handleLogout">
        {{ authStore.loading ? '退出中...' : '退出登录' }}
      </el-button>
    </el-card>

    <el-card v-else-if="authStore.loading" class="loading-card">
      <el-skeleton :rows="3" animated />
      <div class="text-center">
        <el-text type="info">加载用户信息中...</el-text>
      </div>
    </el-card>

    <el-card v-else-if="authStore.error" class="error-card">
      <el-result icon="error" title="错误" :sub-title="authStore.error">
        <template #extra>
          <el-button type="primary" @click="goToLogin">返回登录</el-button>
        </template>
      </el-result>
    </el-card>

    <el-card v-else class="not-logged-card">
      <el-result icon="warning" title="未登录" sub-title="您尚未登录，请先登录访问此页面">
        <template #extra>
          <el-button type="primary" @click="goToLogin">去登录</el-button>
        </template>
      </el-result>
    </el-card>


  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const protocol = computed(() => window.location.protocol)

onMounted(async () => {
  try {
    // 尝试获取CSRF令牌
    await authStore.getCsrfToken()

    // 检查认证状态
    await authStore.checkAuth()

    // 如果未登录且没有错误，重定向到登录页
    if (!authStore.isAuthenticated && !authStore.error) {
      ElMessage.warning('您尚未登录，即将跳转到登录页')
      router.push({ name: 'login' })
    }

    // 检查协议
    if (protocol.value !== 'https:') {
      ElMessage.warning({
        message: '您正在使用HTTP连接，浏览器可能不会保存带Secure属性的Cookie，建议使用HTTPS',
        duration: 5000
      })
    }
  } catch (error) {
    console.error('检查认证状态失败:', error)
    ElMessage.error('检查认证状态失败')
  }
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    ElMessage.success('已退出登录')
    router.push({ name: 'login' })
  } catch (error) {
    console.error('登出失败:', error)
    ElMessage.error('登出失败')
  }
}

const goToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<style scoped>
.home-container {
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
  gap: 20px;
}

.user-card,
.loading-card,
.error-card,
.not-logged-card,
.csrf-card {
  width: 100%;
  max-width: 500px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  margin-bottom: 20px;
}

.logout-button {
  width: 100%;
  margin-top: 20px;
}

.text-center {
  text-align: center;
  margin-top: 16px;
}

.csrf-actions {
  margin-top: 20px;
  text-align: center;
}
</style>
