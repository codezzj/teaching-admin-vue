// mock/homeworks.js
function randomId() {
    return Date.now() + Math.floor(Math.random() * 10000)
}

function future(days) {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().slice(0, 16)
}
function past(days) {
    const d = new Date()
    d.setDate(d.getDate() - days)
    return d.toISOString().slice(0, 16)
}

let homeworks = [
    {
        id: 1,
        title: '实现一个响应式导航栏',
        courseId: 1,
        courseName: 'Web前端框架技术1',
        deadline: future(7),
        requirement: '使用 Vue3 组合式 API + Element Plus 实现一个可折叠、多级展开的侧边导航栏组件。要求支持路由联动、手风琴模式，并提供至少 3 种不同主题样式。',
        status: 'pending' // pending | completed
    },
    {
        id: 2,
        title: '封装 Axios 请求模块',
        courseId: 2,
        courseName: 'Web前端框架技术2',
        deadline: future(1),
        requirement: '封装一个通用的 request 模块，包含请求拦截器（自动添加 token）和响应拦截器（统一错误处理、loading 控制），支持 GET/POST/PUT/DELETE 四种请求方法。',
        status: 'pending'
    },
    {
        id: 3,
        title: '路由守卫实践',
        courseId: 3,
        courseName: 'Web前端框架技术3',
        deadline: past(3),
        requirement: '实现 Vue Router 5 的前置路由守卫和后置路由守卫，完成以下功能：未登录跳转登录页、动态路由加载、页面标题自动更新。撰写一篇分析文档，对比 beforeEach 和 afterEach 的使用场景。',
        status: 'completed'
    },
    {
        id: 4,
        title: 'Element Plus 表格封装',
        courseId: 1,
        courseName: 'Web前端框架技术1',
        deadline: past(7),
        requirement: '基于 Element Plus 的 el-table 组件，封装一个通用表格组件，支持分页、排序、筛选、自定义列插槽、行选择等功能。要求组件 API 设计清晰，文档示例齐全。',
        status: 'completed'
    }
]

export default [
    // 列表：支持 status 筛选
    {
        url: '/api/homeworks',
        method: 'get',
        response: ({ query }) => {
            const st = query?.status || ''
            let filtered = homeworks
            if (st === 'pending') filtered = filtered.filter((h) => h.deadline >= new Date().toISOString().slice(0, 16))
            if (st === 'completed') filtered = filtered.filter((h) => h.deadline < new Date().toISOString().slice(0, 16))
            // 实时计算 status
            filtered = filtered.map((h) => ({
                ...h,
                status: h.deadline >= new Date().toISOString().slice(0, 16) ? 'pending' : 'completed'
            }))

            return { code: 0, message: 'ok', data: { list: filtered, total: filtered.length } }
        }
    },

    // 发布
    {
        url: '/api/homeworks',
        method: 'post',
        response: ({ body }) => {
            const { title, courseId, courseName, deadline, requirement } = body || {}
            if (!title || !courseId || !deadline || !requirement) {
                return { code: 1, message: '字段不能为空', data: null }
            }

            const item = {
                id: randomId(),
                title,
                courseId,
                courseName: courseName || '',
                deadline,
                requirement,
                status: deadline >= new Date().toISOString().slice(0, 16) ? 'pending' : 'completed'
            }
            homeworks.unshift(item)
            return { code: 0, message: 'ok', data: item }
        }
    }
]