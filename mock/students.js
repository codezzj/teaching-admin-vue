// mock/students.js
function nowString() {
    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

let students = Array.from({ length: 27 }).map((_, i) => {
    const idx = i + 1
    return {
        id: idx,
        studentNo: `2025${String(idx).padStart(4, '0')}`,
        name: `学生${idx}`,
        className: `计科${(idx % 3) + 1}班`,
        createdAt: nowString()
    }
})

export default [
    // 列表：分页 + keyword 模糊搜索
    {
        url: '/api/students',
        method: 'get',
        response: ({ query }) => {
            const page = parseInt(query?.page || '1', 10)
            const pageSize = parseInt(query?.pageSize || '10', 10)
            const keyword = String(query?.keyword || '').trim()

            let filtered = students
            if (keyword) {
                filtered = students.filter((s) =>
                    [s.studentNo, s.name, s.className].some((v) => String(v).includes(keyword))
                )
            }

            const total = filtered.length
            const start = (page - 1) * pageSize
            const list = filtered.slice(start, start + pageSize)

            return { code: 0, message: 'ok', data: { list, total } }
        }
    },

    // 新增
    {
        url: '/api/students',
        method: 'post',
        response: ({ body }) => {
            const { studentNo, name, className } = body || {}
            if (!studentNo || !name || !className) {
                return { code: 1, message: '学号/姓名/班级不能为空', data: null }
            }
            if (students.some((s) => s.studentNo === studentNo)) {
                return { code: 1, message: '学号已存在', data: null }
            }

            const id = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1
            const item = { id, studentNo, name, className, createdAt: nowString() }
            students.unshift(item)
            return { code: 0, message: 'ok', data: item }
        }
    },

    // 编辑：/api/students/:id
    {
        url: /\/api\/students\/\d+$/,
        method: 'put',
        response: ({ url, body }) => {
            const id = parseInt(url.split('/').pop(), 10)
            const idx = students.findIndex((s) => s.id === id)
            if (idx === -1) return { code: 1, message: '学生不存在', data: null }

            const { studentNo, name, className } = body || {}
            if (!studentNo || !name || !className) {
                return { code: 1, message: '学号/姓名/班级不能为空', data: null }
            }

            // 学号唯一校验（排除自己）
            if (students.some((s) => s.studentNo === studentNo && s.id !== id)) {
                return { code: 1, message: '学号已存在', data: null }
            }

            students[idx] = { ...students[idx], studentNo, name, className }
            return { code: 0, message: 'ok', data: students[idx] }
        }
    },

    // 删除：/api/students/:id
    {
        url: /\/api\/students\/\d+$/,
        method: 'delete',
        response: ({ url }) => {
            const id = parseInt(url.split('/').pop(), 10)
            students = students.filter((s) => s.id !== id)
            return { code: 0, message: 'ok', data: true }
        }
    }
]