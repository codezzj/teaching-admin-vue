export default [
    {
        url: '/api/auth/login',
        method: 'post',
        response: ({ body }) => {
            const { username, password } = body || {}
            if (!username || !password) return { code: 1, message: '账号或密码不能为空', data: null }
            if (username !== 'teacher' || password !== '123456') return { code: 1, message: '账号或密码错误', data: null }
            return {
                code: 0,
                message: 'ok',
                data: { token: 'mock-token-123', user: { username, role: 'teacher' } }
            }
        }
    },
    {
        url: '/api/auth/me',
        method: 'get',
        response: ({ headers }) => {
            const auth = headers?.authorization || ''
            if (!auth) return { code: 401, message: '未登录', data: null }
            return { code: 0, message: 'ok', data: { username: 'teacher', role: 'teacher' } }
        }
    },
    {
        url: '/api/auth/logout',
        method: 'post',
        response: () => ({ code: 0, message: 'ok', data: true })
    }
]