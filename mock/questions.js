// mock/questions.js
function randomId() {
    return Date.now() + Math.floor(Math.random() * 10000)
}

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

const courseNames = ['Web前端框架技术1', 'Web前端框架技术2', 'Web前端框架技术3']
const topics = ['Vue3基础', '路由', '组件通信', '状态管理', 'Axios', 'Element Plus']

let questions = Array.from({ length: 12 }).map((_, i) => {
    const id = i + 1
    const type = rand(['single', 'multiple', 'judge', 'short'])
    let options = []
    let answer = ''

    if (type === 'single') {
        options = ['A. 选项A', 'B. 选项B', 'C. 选项C', 'D. 选项D']
        answer = rand(['A', 'B', 'C', 'D'])
    } else if (type === 'multiple') {
        options = ['A. 选项A', 'B. 选项B', 'C. 选项C', 'D. 选项D']
        answer = rand(['A', 'AB', 'AC', 'BD', 'ABC'])
    } else if (type === 'judge') {
        options = ['正确', '错误']
        answer = rand(['正确', '错误'])
    } else {
        options = []
        answer = '参考答案内容...'
    }

    return {
        id,
        type,
        content: `题目${id}：Vue3 中如何使用组合式 API 进行状态管理？请描述 setup 函数的基本用法（第${id}题）。`,
        options,
        answer,
        analysis: `这是第${id}题的解析。setup 是组合式 API 的入口函数，在组件创建前执行...`,
        difficulty: rand(['简单', '中等', '困难']),
        courseName: rand(courseNames),
        topic: rand(topics)
    }
})

export default [
    // 题库列表：按课程、知识点、关键字筛选
    {
        url: '/api/questions',
        method: 'get',
        response: ({ query }) => {
            const keyword = String(query?.keyword || '').trim()
            const course = query?.course || ''
            const topic = query?.topic || ''

            let filtered = questions

            if (keyword) {
                filtered = filtered.filter((q) =>
                    [q.content, q.analysis].some((v) => String(v).includes(keyword))
                )
            }
            if (course) {
                filtered = filtered.filter((q) => q.courseName === course)
            }
            if (topic) {
                filtered = filtered.filter((q) => q.topic === topic)
            }

            return { code: 0, message: 'ok', data: { list: filtered, total: filtered.length } }
        }
    },

    // 新增题目（手动创建）
    {
        url: '/api/questions',
        method: 'post',
        response: ({ body }) => {
            const { content, type, options, answer, analysis, difficulty, courseName, topic } = body || {}
            if (!content || !type || !answer || !courseName) {
                return { code: 1, message: '必填字段不能为空', data: null }
            }

            const item = {
                id: randomId(),
                type,
                content,
                options: options || [],
                answer,
                analysis: analysis || '',
                difficulty: difficulty || '中等',
                courseName,
                topic: topic || ''
            }
            questions.unshift(item)
            return { code: 0, message: 'ok', data: item }
        }
    },

    // 编辑题目
    {
        url: /\/api\/questions\/\d+$/,
        method: 'put',
        response: ({ url, body }) => {
            const id = parseInt(url.split('/').pop(), 10)
            const idx = questions.findIndex((q) => q.id === id)
            if (idx === -1) return { code: 1, message: '题目不存在', data: null }

            const { content, type, options, answer, analysis, difficulty, courseName, topic } = body || {}
            questions[idx] = {
                ...questions[idx],
                content: content || questions[idx].content,
                type: type || questions[idx].type,
                options: options || questions[idx].options,
                answer: answer || questions[idx].answer,
                analysis: analysis || questions[idx].analysis,
                difficulty: difficulty || questions[idx].difficulty,
                courseName: courseName || questions[idx].courseName,
                topic: topic || questions[idx].topic
            }
            return { code: 0, message: 'ok', data: questions[idx] }
        }
    },

    // 删除题目
    {
        url: /\/api\/questions\/\d+$/,
        method: 'delete',
        response: ({ url }) => {
            const id = parseInt(url.split('/').pop(), 10)
            questions = questions.filter((q) => q.id !== id)
            return { code: 0, message: 'ok', data: true }
        }
    },

    // AI 生成题目（mock：返回 3 道随机题目草稿）
    {
        url: '/api/questions/ai-generate',
        method: 'post',
        response: ({ body }) => {
            const { courseName, topic, count = 3 } = body || {}
            if (!courseName) {
                return { code: 1, message: '请选择课程', data: null }
            }

            const generated = Array.from({ length: Math.min(count, 5) }).map((_, i) => ({
                id: randomId() + i,
                type: rand(['single', 'multiple', 'judge']),
                content: `AI生成题目：关于${courseName}中「${topic || '综合'}」的第${i + 1}题，请描述 setup 函数的基本用法。`,
                options: ['A. 选项A', 'B. 选项B', 'C. 选项C', 'D. 选项D'],
                answer: rand(['A', 'B', 'C', 'D']),
                analysis: `AI自动生成的解析：本题考察${topic || '基础知识'}，正确答案思路为...`,
                difficulty: rand(['简单', '中等']),
                courseName,
                topic: topic || ''
            }))

            return { code: 0, message: 'ok', data: { list: generated } }
        }
    }
]