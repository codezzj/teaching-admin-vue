// mock/attendances.js
function randomId() {
    return Date.now() + Math.floor(Math.random() * 10000)
}

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

let attendances = Array.from({ length: 32 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - Math.floor(Math.random() * 14))
    return {
        id: i + 1,
        studentName: `学生${(i % 20) + 1}`,
        courseName: rand(['Web前端框架技术1', 'Web前端框架技术2', 'Web前端框架技术3']),
        time: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(Math.floor(Math.random() * 8) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        status: rand(['正常', '正常', '正常', '迟到', '缺勤'])
    }
})

let sessions = []

export default [
    // 考勤记录列表：支持 course、date 筛选
    {
        url: '/api/attendances',
        method: 'get',
        response: ({ query }) => {
            const course = query?.course || ''
            const date = query?.date || ''
            const page = parseInt(query?.page, 10) || 1
            const pageSize = parseInt(query?.pageSize, 10) || 10
            let filtered = attendances

            if (course) {
                filtered = filtered.filter((a) => a.courseName === course)
            }
            if (date) {
                filtered = filtered.filter((a) => a.time.startsWith(date))
            }

            const total = filtered.length
            const start = (page - 1) * pageSize
            const paged = filtered.slice(start, start + pageSize)

            return { code: 0, message: 'ok', data: { list: paged, total } }
        }
    },

    // 考勤统计：按课程 + 日期聚合
    {
        url: '/api/attendances/stats',
        method: 'get',
        response: ({ query }) => {
            const course = query?.course || ''
            const date = query?.date || ''
            let filtered = attendances

            if (course) {
                filtered = filtered.filter((a) => a.courseName === course)
            }
            if (date) {
                filtered = filtered.filter((a) => a.time.startsWith(date))
            }

            const normal = filtered.filter((a) => a.status === '正常').length
            const late = filtered.filter((a) => a.status === '迟到').length
            const absent = filtered.filter((a) => a.status === '缺勤').length

            return {
                code: 0,
                message: 'ok',
                data: { total: filtered.length, normal, late, absent }
            }
        }
    },

    // // 创建签到（返回签到码 + 有效期）
    // {
    //     url: '/api/attendances/session',
    //     method: 'post',
    //     response: ({ body }) => {
    //         const { courseName } = body || {}
    //         if (!courseName) {
    //             return { code: 1, message: '请选择课程', data: null }
    //         }
    //
    //         const code = Math.random().toString(36).slice(2, 6).toUpperCase()
    //         const expires = new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16)
    //
    //         const item = { id: randomId(), courseName, code, expires, createdAt: new Date().toISOString().slice(0, 16) }
    //         sessions.unshift(item)
    //         return { code: 0, message: 'ok', data: item }
    //     }
    // }

    // 创建签到（返回签到码 + 手动选择有效期）
    {
        url: '/api/attendances/session',
        method: 'post',
        response: ({ body }) => {
            const { courseName, attendanceTime, duration } = body || {}
            if (!courseName) {
                return { code: 1, message: '请选择课程', data: null }
            }
            if (!attendanceTime) {
                return { code: 1, message: '请选择考勤时间', data: null }
            }
            if (!duration) {
                return { code: 1, message: '请选择有效期', data: null }
            }

            const code = Math.random().toString(36).slice(2, 6).toUpperCase()
            const durationSec = parseInt(duration, 10)
            const expires = new Date(new Date(attendanceTime).getTime() + durationSec * 1000)
                .toISOString().slice(0, 16)

            const item = {
                id: randomId(),
                courseName,
                code,
                durationSec,
                attendanceTime,
                expires,
                createdAt: new Date().toISOString().slice(0, 16)
            }
            sessions.unshift(item)
            return { code: 0, message: 'ok', data: item }
        }
    },








]