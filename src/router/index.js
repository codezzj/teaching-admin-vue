import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

import Dashboard from '../views/Dashboard.vue'
import StudentsList from '../views/students/StudentsList.vue'
import CoursesList from '../views/courses/CoursesList.vue'
import CourseDetail from '../views/courses/CourseDetail.vue'


import { getToken } from '../utils/auth'

const routes = [

    { path: '/login', component: Login,meta: { title: '登录' } },

    {
        path: '/',
        component: AdminLayout,
         meta: { requiresAuth: true },
        children: [
            { path: '', redirect: '/dashboard' },
            { path: 'dashboard', component: Dashboard },
            { path: 'students', component: StudentsList },
            { path: 'courses', component: CoursesList },
            { path: 'courses/:id', component: CourseDetail },
    // {     
    //     path: 'dashboard', 
    //     component: Dashboard,
    //     meta: { title: '首页' }
    //   },
    //   { 
    //     path: 'students', 
    //     component: StudentsList,
    //     meta: { title: '学生管理' }
    //   },
    //   { 
    //     path: 'courses', 
    //     component: CoursesList,
    //     meta: { title: '课程管理' }
    //   },
    //   { 
    //     path: 'courses/:id', 
    //     component: CourseDetail,
    //     meta: { title: '课程详情' }
    //   },
            // 作业：
            { path: 'homeworks', component: () => import('../views/homeworks/HomeworksList.vue') },
            { path: 'homeworks/create', component: () => import('../views/homeworks/HomeworkCreate.vue') },

            //考勤
            { path: 'attendances', component: () => import('../views/attendances/AttendancesList.vue') },
            //个人信息
            { path: 'profile', component: () => import('../views/profile/Profile.vue') },
            //问题
            { path: 'questions', component: () => import('../views/questions/QuestionsList.vue') },
            { path: 'tests', component: () => import('../views/tests/TestsList.vue') },
            { path: 'tests/create', component: () => import('../views/tests/TestCreate.vue') },
            { path: 'tests/:id', component: () => import('../views/tests/TestDetail.vue') }
        ],
        meta: { requiresAuth: true }
    }
]



const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router


router.beforeEach((to) => {
    const token = getToken()
    if (to.path === '/login') {
        if (token) return '/dashboard'
        return true
    }
    if (to.meta.requiresAuth && !token) return '/login'
    return true
})




