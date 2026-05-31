// src/api/homeworks.js
import request from '../utils/request'

export function getHomeworks(params) {
    return request.get('/homeworks', { params })
}

export function createHomework(data) {
    return request.post('/homeworks', data)
}