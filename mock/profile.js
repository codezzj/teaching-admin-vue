// mock/profile.js
const profile = {
    id: 1,
    username: 'teacher',
    nickname: '张老师',
    phone: '13800138000',
    email: 'teacher@example.com',
    employeeNo: 'T2025001',
    avatar: ''
}

export default [
    // 获取个人信息
    {
        url: '/api/profile',
        method: 'get',
        response: () => ({ code: 0, message: 'ok', data: profile })
    },

    // 编辑个人信息
    {
        url: '/api/profile',
        method: 'put',
        response: ({ body }) => {
            const { nickname, phone, email, avatar } = body || {}
            if (nickname !== undefined) profile.nickname = nickname
            if (phone !== undefined) profile.phone = phone
            if (email !== undefined) profile.email = email
            if (avatar !== undefined) profile.avatar = avatar
            return { code: 0, message: 'ok', data: profile }
        }
    },

    // 修改密码
    {
        url: '/api/profile/change-password',
        method: 'post',
        response: ({ body }) => {
            const { oldPassword, newPassword, confirmPassword } = body || {}
            if (!oldPassword) return { code: 1, message: '旧密码不能为空', data: null }
            if (!newPassword) return { code: 1, message: '新密码不能为空', data: null }
            if (newPassword !== confirmPassword) return { code: 1, message: '两次输入的新密码不一致', data: null }
            if (newPassword.length < 6) return { code: 1, message: '新密码至少 6 位', data: null }
            return { code: 0, message: '密码修改成功', data: true }
        }
    }
]