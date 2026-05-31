// mock/courses.js
function genCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase()
}

let courses = Array.from({ length: 18 }).map((_, i) => {
    const id = i + 1
    return {
        id,
        term: `2025-${(i % 2) + 1}`,
        name: `Web前端框架技术${id}`,
        teacher: `张老师`,
        className: `计科${(id % 3) + 1}班`,
        joinCode: genCode()
    }
})

export default [
    // 列表：支持 keyword 模糊搜索（课程名/教师/班级/学期/加课码）
    {
        url: '/api/courses',
        method: 'get',
        response: ({ query }) => {
            const keyword = String(query?.keyword || '').trim()
            const page = parseInt(query?.page, 10) || 1
            const pageSize = parseInt(query?.pageSize, 10) || 8
            let filtered = courses

            if (keyword) {
                filtered = courses.filter((c) =>
                    [c.term, c.name, c.teacher, c.className, c.joinCode].some((v) =>
                        String(v).includes(keyword)
                    )
                )
            }

            const total = filtered.length
            const start = (page - 1) * pageSize
            const paged = filtered.slice(start, start + pageSize)

            return { code: 0, message: 'ok', data: { list: paged, total } }
        }
    },

    // 详情
    {
        url: /\/api\/courses\/\d+$/,
        method: 'get',
        response: ({ url }) => {
            const id = parseInt(url.split('/').pop(), 10)
            const item = courses.find((c) => c.id === id)
            if (!item) return { code: 1, message: '课程不存在', data: null }
            return { code: 0, message: 'ok', data: item }
        }
    },

    // 新增
    {
        url: '/api/courses',
        method: 'post',
        response: ({ body }) => {
            const { term, name, teacher, className, joinCode } = body || {}
            if (!term || !name || !teacher || !className || !joinCode) {
                return { code: 1, message: '字段不能为空', data: null }
            }
            if (courses.some((c) => c.joinCode === joinCode)) {
                return { code: 1, message: '加课码已存在', data: null }
            }
            const id = courses.length ? Math.max(...courses.map((c) => c.id)) + 1 : 1
            const item = { id, term, name, teacher, className, joinCode }
            courses.unshift(item)
            return { code: 0, message: 'ok', data: item }
        }
    },

    // 编辑
    {
        url: /\/api\/courses\/\d+$/,
        method: 'put',
        response: ({ url, body }) => {
            const id = parseInt(url.split('/').pop(), 10)
            const idx = courses.findIndex((c) => c.id === id)
            if (idx === -1) return { code: 1, message: '课程不存在', data: null }

            const { term, name, teacher, className, joinCode } = body || {}
            if (!term || !name || !teacher || !className || !joinCode) {
                return { code: 1, message: '字段不能为空', data: null }
            }
            if (courses.some((c) => c.joinCode === joinCode && c.id !== id)) {
                return { code: 1, message: '加课码已存在', data: null }
            }

            courses[idx] = { ...courses[idx], term, name, teacher, className, joinCode }
            return { code: 0, message: 'ok', data: courses[idx] }
        }
    },

    // 删除
    {
        url: /\/api\/courses\/\d+$/,
        method: 'delete',
        response: ({ url }) => {
            const id = parseInt(url.split('/').pop(), 10)
            courses = courses.filter((c) => c.id !== id)
            return { code: 0, message: 'ok', data: true }
        }
    },

    // 批量删除
    {
        url: '/api/courses/batch-delete',
        method: 'post',
        response: ({ body }) => {
            const ids = body?.ids || []
            courses = courses.filter((c) => !ids.includes(c.id))
            return { code: 0, message: 'ok', data: true }
        }
    }
]