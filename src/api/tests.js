// src/api/tests.js
import request from '../utils/request'

export function getTests(params) {
    return request.get('/tests', { params })
}

export function getTestDetail(id) {
    return request.get(`/tests/${id}`)
}

export function createTest(data) {
    return request.post('/tests', data)
}

export function manualGrade(testId, data) {
    return request.post(`/tests/${testId}/grade`, data)
}

export function aiGrade(testId) {
    return request.post(`/tests/${testId}/ai-grade`)
}