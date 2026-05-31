<template>
  <el-container class="layout">
    <!-- ==================== 侧边栏 ==================== -->
    <el-aside :class="['aside', { collapsed: isCollapse }]" :style="{ width: isCollapse ? '64px' : '220px' }">
      <div class="aside-title">
        <span v-if="!isCollapse">智能教学管理</span>
        <span v-else class="aside-title-short">教学</span>
      </div>

      <div class="menu-card">
        <el-menu
          class="menu"
          :default-active="$route.path"
          :collapse-transition="false"
          router
        >
          <el-menu-item index="/dashboard">
            <span class="mi"><span class="mi-icon">🏠</span><span class="mi-text">首页</span></span>
          </el-menu-item>
          <el-menu-item index="/students">
            <span class="mi"><span class="mi-icon">👩‍🎓</span><span class="mi-text">学生管理</span></span>
          </el-menu-item>
          <el-menu-item index="/courses">
            <span class="mi"><span class="mi-icon">📚</span><span class="mi-text">课程管理</span></span>
          </el-menu-item>
          <el-menu-item index="/homeworks">
            <span class="mi"><span class="mi-icon">📝</span><span class="mi-text">作业管理</span></span>
          </el-menu-item>
          <el-menu-item index="/attendances">
            <span class="mi"><span class="mi-icon">📋</span><span class="mi-text">考勤管理</span></span>
          </el-menu-item>
          <el-menu-item index="/questions">
            <span class="mi"><span class="mi-icon">📝</span><span class="mi-text">题库管理</span></span>
          </el-menu-item>
          <el-menu-item index="/tests">
            <span class="mi"><span class="mi-icon">📊</span><span class="mi-text">测试管理</span></span>
          </el-menu-item>
          <el-menu-item index="/profile">
            <span class="mi"><span class="mi-icon">👤</span><span class="mi-text">个人中心</span></span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>

    <!-- ==================== 右侧主体 ==================== -->
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-button class="collapse-btn" text @click="toggleCollapse">
            <span v-if="!isCollapse">◀</span>
            <span v-else>▶</span>
          </el-button>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item
              v-for="crumb in breadcrumbs"
              :key="crumb.path"
              :to="crumb.path ? { path: crumb.path } : undefined"
            >
              {{ crumb.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <span>欢迎，{{ username }}</span>
          <el-button size="small" type="danger" @click="onLogout">退出</el-button>
        </div>
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>

    <div v-if="isMobile && !isCollapse" class="overlay" @click="isCollapse = true" />
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, clearAuth } from '../utils/auth'
import { logout } from '../api/auth'

const router = useRouter()
const username = computed(() => getUser()?.username || '—')

// ===== 侧边栏折叠 =====
const isCollapse = ref(false)
function toggleCollapse() {
  isCollapse.value = !isCollapse.value
}

// ===== 面包屑 =====
const breadcrumbMap = {
  '/dashboard': '首页',
  '/students': '学生管理',
  '/courses': '课程管理',
  '/homeworks': '作业管理',
  '/attendances': '考勤管理',
  '/questions': '题库管理',
  '/tests': '测试管理',
  '/profile': '个人中心',
}
const breadcrumbs = computed(() => {
  return router.currentRoute.value.matched
    .filter((r) => r.path !== '/')
    .map((r) => ({
      title: breadcrumbMap[r.path] || r.meta?.title || r.name || r.path,
      path: r.path,
    }))
})

// ===== 响应式 =====
const isMobile = ref(window.innerWidth < 768)
function handleResize() {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) isCollapse.value = true
}
window.addEventListener('resize', handleResize)

// ===== 退出 =====
async function onLogout() {
  try { await logout() } finally {
    clearAuth()
    router.push('/login')
  }
}
</script>

<style scoped>
.layout { height: 100vh; background: #f5f6fa; position: relative; }

.aside {
  width: 220px; background: #fff; border-right: 1px solid #eef0f5;
  box-shadow: 2px 0 12px rgba(0,0,0,.03); display: flex; flex-direction: column;
  transition: width .22s ease; overflow: hidden; flex-shrink: 0;
}
.aside-title {
  padding: 18px 18px 14px; font-weight: 700; color: #1f2328;
  font-size: 15px; letter-spacing: -.2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.aside-title-short { display: block; text-align: center; font-size: 14px; }

.aside.collapsed .aside-title { padding: 16px 8px 12px; text-align: center; }
.aside.collapsed .menu-card { margin: 8px 6px 12px; padding: 6px; }
.aside.collapsed :deep(.el-menu-item) { margin: 2px 0; border-radius: 8px; }
.aside.collapsed :deep(.el-menu-item.is-active::before) { left: 6px; top: 8px; bottom: 8px; width: 2px; }

.menu-card {
  margin: 8px 12px 12px; padding: 8px; background: #fafbfc;
  border: 1px solid #eef0f5; border-radius: 10px;
  overflow: hidden; flex: 1;
  transition: margin .22s ease, padding .22s ease;
}
.menu {
  border-right: none; background: transparent;
  --el-menu-bg-color: transparent;
  --el-menu-text-color: #656d76;
  --el-menu-active-color: #667eea;
  --el-menu-hover-bg-color: #f5f5ff;
}

:deep(.el-menu-item) {
  height: 42px; line-height: 42px; margin: 3px 0; border-radius: 8px;
  transition: all .15s ease; position: relative; font-weight: 500;
  font-size: 14px;
}
:deep(.el-menu-item:hover) {
  background: #f5f5ff; color: #667eea;
}
:deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #eeefff 0%, #f5f3ff 100%);
  color: #667eea; font-weight: 600;
}
:deep(.el-menu-item.is-active::before) {
  content: ""; position: absolute; left: 10px; top: 10px; bottom: 10px;
  width: 3px; border-radius: 4px;
  background: linear-gradient(180deg, #667eea, #764ba2);
}

.mi { display: inline-flex; align-items: center; gap: 10px; padding-left: 20px; }
.mi-icon { width: 20px; text-align: center; opacity: .65; transition: opacity .15s ease; flex-shrink: 0; font-size: 15px; }
.mi-text { font-size: 14px; white-space: nowrap; }
:deep(.el-menu-item.is-active) .mi-icon { opacity: 1; }
:deep(.el-menu-item:hover) .mi-icon { opacity: 1; }
.aside.collapsed .mi-text { display: none; }
.aside.collapsed .mi { padding-left: 0; justify-content: center; }

.header {
  height: 54px; background: #fff; border-bottom: 1px solid #eef0f5;
  box-shadow: 0 1px 4px rgba(0,0,0,.03); display: flex; align-items: center;
  justify-content: space-between; padding: 0 20px; z-index: 10;
}
.header-left { display: flex; align-items: center; gap: 14px; min-width: 0; }
.collapse-btn { font-size: 14px; padding: 4px 8px; color: #8b949e; flex-shrink: 0; border-radius: 6px; }
.collapse-btn:hover { color: #667eea; background: #f5f5ff; }

.breadcrumb { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.breadcrumb :deep(.el-breadcrumb__item) { font-size: 13px; }
.breadcrumb :deep(.el-breadcrumb__inner) { color: #8b949e; font-weight: 400; }
.breadcrumb :deep(.el-breadcrumb__inner.is-link:hover) { color: #667eea; }
.breadcrumb :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) { color: #1f2328; font-weight: 600; }

.header-right { display: flex; gap: 14px; align-items: center; color: #1f2328; font-size: 13px; flex-shrink: 0; }

:deep(.el-main) { padding: 20px; background: #f5f6fa; min-height: 0; }
:deep(.page-card) {
  background: #fff; border: 1px solid #eef0f5; border-radius: 10px;
  padding: 20px;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .aside { width: 64px !important; }
  .aside .aside-title { padding: 16px 8px 12px; text-align: center; }
  .aside .mi-text { display: none; }
  .aside .mi { padding-left: 0; justify-content: center; }
  .header { padding: 0 14px; }
  :deep(.el-main) { padding: 14px; }
}

@media (max-width: 767px) {
  .aside { position: fixed; top: 0; left: 0; bottom: 0; z-index: 1000; width: 220px !important; transform: translateX(-100%); transition: transform .22s ease; }
  .aside:not(.collapsed) { transform: translateX(0); }
  .aside.collapsed { transform: translateX(-100%); width: 220px !important; }
  .aside.collapsed .mi-text { display: inline; }
  .aside.collapsed .mi { padding-left: 20px; justify-content: flex-start; }
  .aside.collapsed .aside-title-short { display: none; }
  .collapse-btn span { font-size: 18px; }
  .overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,.3); z-index: 999; }
  .header { padding: 0 14px; }
  .header-right span { display: none; }
  :deep(.el-main) { padding: 14px; }
  .breadcrumb { max-width: 140px; }
}
</style>