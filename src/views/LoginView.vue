<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h1 class="card-header">登录</h1>
      </template>

      <el-alert v-if="authStore.error" :title="authStore.error" type="error" :closable="false" show-icon
        class="mb-20" />

      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-position="top" @submit.prevent="handleLogin">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginForm.email" placeholder="请输入邮箱">
            <template #prefix>
              <el-icon>
                <UserFilled />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password>
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="authStore.loading" class="login-button" @click="handleLogin">
            {{ authStore.loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiService from '@/api'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const loginFormRef = ref<FormInstance>()

// 登录表单
const loginForm = reactive({
  email: 'test@example.com',
  password: 'password'
})

// 表单验证规则
const rules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ]
}

// 检查CSRF令牌
const checkCsrfToken = () => {
  const token = Cookies.get('XSRF-TOKEN')
  console.log('当前CSRF令牌状态:', token || '未获取')
  if (!token) {
    console.log('尝试获取CSRF令牌...')
    authStore.getCsrfToken().then(() => {
      console.log('CSRF令牌获取后状态:', Cookies.get('XSRF-TOKEN') || '获取失败')
    })
  }
}

// 服务器信息
const serverInfo = ref<unknown>(null)

onMounted(async () => {
  // 检查CSRF令牌
  checkCsrfToken()

  try {
    // 获取服务器信息
    const response = await apiService.getServerInfo()
    serverInfo.value = response.data
  } catch (error) {
    // 生产环境不输出错误日志
    if (import.meta.env.DEV) {
      console.error('获取服务器信息失败:', error)
    }
    ElMessage.error('获取服务器信息失败')
  }
})

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    const valid = await loginFormRef.value.validate()
    if (valid) {
      try {
        await authStore.login(loginForm.email, loginForm.password)

        if (authStore.isAuthenticated) {
          ElMessage.success('登录成功')
          router.push({ name: 'home' })
        }
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error('登录失败，请检查您的凭据')
      }
    } else {
      ElMessage.warning('请填写正确的邮箱和密码')
    }
  } catch (error) {
    console.error('表单验证错误:', error)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.login-card {
  width: 100%;
  max-width: 450px;
}

.card-header {
  text-align: center;
  margin: 0;
  color: #333;
}

.login-button {
  width: 100%;
}

.test-link {
  margin-top: 20px;
  text-align: center;
}

.test-link a {
  color: #409EFF;
  text-decoration: none;
}

.mb-20 {
  margin-bottom: 20px;
}
</style>
