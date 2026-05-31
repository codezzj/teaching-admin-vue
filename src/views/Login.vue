<template>
  <div class="page">
    <!-- 顶部 logo 区域 -->
    <div class="logo-area">
      <div class="avatar">
        <svg viewBox="0 0 64 64" width="64" height="64">
          <circle cx="32" cy="32" r="32" fill="#12B7F5" />
          <circle cx="22" cy="26" r="5" fill="#fff" />
          <circle cx="42" cy="26" r="5" fill="#fff" />
          <ellipse cx="32" cy="44" rx="14" ry="9" fill="#fff" opacity="0.9" />
          <circle cx="22" cy="24" r="1.8" fill="#1a1a1a" />
          <circle cx="42" cy="24" r="1.8" fill="#1a1a1a" />
        </svg>
      </div>
      <div class="app-name">智能教学管理</div>
    </div>

    <!-- 表单卡片 -->
    <div class="card">
      <div class="input-group">
        <div class="input-row">
          <span class="input-icon">👤</span>
          <el-input
            v-model="form.username"
            class="input-field"
            type="text"
            placeholder="请输入账号"
            autocomplete="off"
          />
        </div>
        <div class="input-row">
          <span class="input-icon">🔒</span>
          <input
            v-model="form.password"
            class="input-field"
            :type="showPwd ? 'text' : 'password'"
            placeholder="请输入密码"
          />
          <span class="pwd-eye" @click="showPwd = !showPwd">
            <!-- {{ showPwd ? '🙈' : '👁' }} -->
            {{ showPwd ? '👁' : '✖' }}
          </span>
        </div>
      </div>

      <div class="row-extra">
        <label class="check-label">
          <span class="check-box" :class="{ on: remember }" @click="remember = !remember">✓</span>
          记住密码
        </label>
      </div>

      <button class="login-btn" :disabled="loading" @click="onSubmit">
        <span v-if="loading" class="spinner"></span>
        {{ loading ? '' : '登 录' }}
      </button>

      <div class="bottom-links">
        <a href="javascript:;">注册账号</a>
        <a href="javascript:;">忘记密码</a>
      </div>
    </div>

    <div class="footer">登录即代表同意《用户协议》和《隐私政策》</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '../api/auth'
import { setToken, setUser } from '../utils/auth'

const router = useRouter()
const loading = ref(false)
const remember = ref(true)
const showPwd = ref(false)

const form = reactive({ username: '', password: '' })

async function onSubmit() {
   //await formRef.value.validate()
  if (!form.username) return ElMessage.warning('请输入账号')
  if (!form.password) return ElMessage.warning('请输入密码')

  loading.value = true
  try {
    const res = await login({ username: form.username, password: form.password, remember: remember.value })
    setToken(res.token)
    setUser(res.user)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (e) {
    // 错误已在拦截器处理
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
* { box-sizing: border-box; }

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
  padding: 0 28px;
}

/* ---- logo ---- */
.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 36px;
}

.avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 28px rgba(18, 183, 245, 0.25);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.app-name {
  margin-top: 16px;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: 1px;
}

/* ---- 卡片 ---- */
.card {
  width: 100%;
  max-width: 360px;
  background: #fff;
  border-radius: 20px;
  padding: 32px 28px 24px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
}

/* ---- 输入组 ---- */
.input-group {
  border: 1px solid #eee;
  border-radius: 14px;
  overflow: hidden;
}

.input-row {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 16px;
  background: #fafbfc;
  transition: background .2s;
}

.input-row:first-child {
  border-bottom: 1px solid #eee;
}

.input-row:focus-within {
  background: #fff;
}

.input-icon {
  font-size: 18px;
  margin-right: 10px;
  opacity: 0.6;
}

.input-field {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #1a1a2e;
}

.input-field::placeholder {
  color: #bbb;
}

.pwd-eye {
  font-size: 18px;
  cursor: pointer;
  opacity: 0.5;
  padding: 4px;
}


.row-extra {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 14px 4px 0;
}

.check-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #999;
  cursor: pointer;
  user-select: none;
}

.check-box {
  width: 18px;
  height: 18px;
  border: 1.5px solid #d5d5d5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: transparent;
  transition: all .2s;
}

.check-box.on {
  background: #12B7F5;
  border-color: #12B7F5;
  color: #fff;
}

/* ---- 登录按钮 ---- */
.login-btn {
  margin-top: 24px;
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 24px;
  background: #12B7F5;
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 6px;
  cursor: pointer;
  transition: all .25s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn:hover { background: #0ea5e0; box-shadow: 0 6px 20px rgba(18, 183, 245, 0.35); }
.login-btn:active { transform: scale(0.97); }
.login-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.spinner {
  width: 20px; height: 20px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ---- 底部链接 ---- */
.bottom-links {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
}

.bottom-links a {
  font-size: 13px;
  color: #12B7F5;
  text-decoration: none;
}

/* ---- 页脚 ---- */
.footer {
  margin-top: 40px;
  font-size: 12px;
  color: #bbb;
  text-align: center;
}
</style>