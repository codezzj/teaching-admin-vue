import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '../utils/auth'

import Login from '../views/Login.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import StudentsList from '../views/students/StudentsList.vue'
import CoursesList from '../views/courses/CoursesList.vue'
import CourseDetail from '../views/courses/CourseDetail.vue'

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: Dashboard, meta: { title: '首页' } },
      { path: 'students', component: StudentsList, meta: { title: '学生管理' } },
      { path: 'courses', component: CoursesList, meta: { title: '课程管理' } },
      { path: 'courses/:id', component: CourseDetail, meta: { title: '课程详情' } },

      { path: 'homeworks', component: () => import('../views/homeworks/HomeworksList.vue'), meta: { title: '作业管理' } },
      { path: 'homeworks/create', component: () => import('../views/homeworks/HomeworkCreate.vue'), meta: { title: '创建作业' } },

      { path: 'attendances', component: () => import('../views/attendances/AttendancesList.vue'), meta: { title: '考勤管理' } },

      { path: 'profile', component: () => import('../views/profile/Profile.vue'), meta: { title: '个人中心' } },

      { path: 'questions', component: () => import('../views/questions/QuestionsList.vue'), meta: { title: '问题管理' } },

      { path: 'tests', component: () => import('../views/tests/TestsList.vue'), meta: { title: '考试管理' } },
      { path: 'tests/create', component: () => import('../views/tests/TestCreate.vue'), meta: { title: '创建考试' } },
      { path: 'tests/:id', component: () => import('../views/tests/TestDetail.vue'), meta: { title: '考试详情' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/teaching-admin-vue'),
  routes
})

router.beforeEach((to) => {
  const token = getToken()
  if (to.path === '/login') {
    return token ? '/dashboard' : true
  }
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
  return true
})

export default router
