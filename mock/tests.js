// mock/tests.js
function randomId() {
    return Date.now() + Math.floor(Math.random() * 10000)
}

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

const courseNames = ['Web前端框架技术1', 'Web前端框架技术2', 'Web前端框架技术3']
const topics = ['Vue3基础', '路由', '组件通信', '状态管理']

let tests = [
    {
        id: 1,
        title: 'Vue3 组合式 API 单元测试',
        courseName: 'Web前端框架技术1',
        questions: [
            {
                id: 101, type: 'single', content: 'setup 函数在什么时候执行？',
                options: ['A. 组件创建前', 'B. 组件挂载后', 'C. 数据更新时', 'D. 组件销毁时'],
                answer: 'A', studentAnswer: 'A', score: 10, isGraded: false
            },
            {
                id: 102, type: 'judge', content: 'computed 是响应式的。',
                options: ['正确', '错误'], answer: '正确', studentAnswer: '',
                score: 10, isGraded: false
            },
            {
                id: 103, type: 'short', content: '请简述 ref 和 reactive 的区别。',
                options: [], answer: 'ref 用于基本类型，reactive 用于对象...',
                studentAnswer: 'ref 用于简单值，reactive 用于复杂对象。',
                score: 20, isGraded: false
            }
        ],
        createdAt: '2025-06-10 09:00'
    },
    {
        id: 2,
        title: 'Vue Router 5 路由守卫测试',
        courseName: 'Web前端框架技术2',
        questions: [
            {
                id: 201, type: 'single', content: '路由守卫 beforeEach 中返回 false 会发生什么？',
                options: ['A. 取消导航', 'B. 跳转首页', 'C. 控制台报错', 'D. 啥也不做'],
                answer: 'A', studentAnswer: 'A', score: 10, isGraded: false
            }
        ],
        createdAt: '2025-06-12 14:00'
    }
]

export default [
    // 测试列表（分页）
    {
        url: '/api/tests',
        method: 'get',
        response: ({ query }) => {
            const page = parseInt(query?.page) || 1
            const pageSize = parseInt(query?.pageSize) || 10
            const start = (page - 1) * pageSize
            const paged = tests.slice(start, start + pageSize)
            return {
                code: 0, message: 'ok',
                data: { list: paged, total: tests.length }
            }
        }
    },

    // 测试详情
    {
        url: /\/api\/tests\/\d+$/,
        method: 'get',
        response: ({ url }) => {
            const id = parseInt(url.split('/').pop(), 10)
            const item = tests.find((t) => t.id === id)
            if (!item) return { code: 1, message: '测试不存在', data: null }
            return { code: 0, message: 'ok', data: item }
        }
    },

    // 创建测试
    {
        url: '/api/tests',
        method: 'post',
        response: ({ body }) => {
            const { title, courseName, questionIds } = body || {}
            if (!title || !courseName || !questionIds?.length) {
                return { code: 1, message: '字段不能为空', data: null }
            }

            const questions = (questionIds || []).map((qid) => ({
                id: qid, type: 'single',
                content: `题目ID=${qid}`,
                options: ['A', 'B', 'C', 'D'],
                answer: 'A',
                studentAnswer: '',
                score: 10,
                isGraded: false
            }))

            const item = {
                id: randomId(),
                title,
                courseName,
                questions,
                createdAt: new Date().toISOString().slice(0, 16)
            }
            tests.unshift(item)
            return { code: 0, message: 'ok', data: item }
        }
    },

    // 手动批改单题
    {
        url: /\/api\/tests\/\d+\/grade$/,
        method: 'post',
        response: ({ url, body }) => {
            const testId = parseInt(url.split('/')[url.split('/').length - 2], 10)
            const { questionId, score, comment } = body || {}
            const test = tests.find((t) => t.id === testId)
            if (!test) return { code: 1, message: '测试不存在', data: null }

            const q = test.questions.find((q) => q.id === questionId)
            if (!q) return { code: 1, message: '题目不存在', data: null }

            q.score = score
            q.comment = comment || ''
            q.isGraded = true
            return { code: 0, message: 'ok', data: q }
        }
    },

    // AI 批改
    {
        url: /\/api\/tests\/\d+\/ai-grade$/,
        method: 'post',
        response: ({ url }) => {
            const testId = parseInt(url.split('/')[url.split('/').length - 2], 10)
            const test = tests.find((t) => t.id === testId)
            if (!test) return { code: 1, message: '测试不存在', data: null }

            test.questions.forEach((q) => {
                if (q.type === 'short') {
                    q.aiScore = Math.floor(Math.random() * 16) + 5
                    q.aiComment = 'AI评语：内容基本完整，可进一步补充示例。'
                } else {
                    q.aiScore = q.answer === q.studentAnswer ? q.score : 0
                    q.aiComment = q.answer === q.studentAnswer ? '回答正确' : '答案不正确'
                }
                q.isGraded = true
            })

            return { code: 0, message: 'AI批改完成', data: test }
        }
    },

    // 删除测试
    {
        url: /\/api\/tests\/\d+$/,
        method: 'delete',
        response: ({ url }) => {
            const id = parseInt(url.split('/').pop(), 10)
            const idx = tests.findIndex((t) => t.id === id)
            if (idx === -1) return { code: 1, message: '测试不存在', data: null }
            tests.splice(idx, 1)
            return { code: 0, message: '删除成功', data: true }
        }
    }
]