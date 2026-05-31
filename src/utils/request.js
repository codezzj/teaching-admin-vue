import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, clearAuth } from './auth'

const request = axios.create({
    baseURL: '/api',
    timeout: 10000
})

request.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

request.interceptors.response.use(
    (resp) => {
        const res = resp.data
        if (res && typeof res.code !== 'undefined') {
            if (res.code === 0) return res.data
            ElMessage.error(res.message || '请求失败')
            return Promise.reject(res)
        }
        return res
    },
    (err) => {
        if (err?.response?.status === 401) {
            clearAuth()
            location.href = '/login'
        } else {
            ElMessage.error(err?.message || '网络错误')
        }
        return Promise.reject(err)
    }
)

export default request