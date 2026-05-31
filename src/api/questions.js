// src/api/questions.js
import request from '../utils/request'

export function getQuestions(params) {
    return request.get('/questions', { params })
}

export function createQuestion(data) {
    return request.post('/questions', data)
}

export function updateQuestion(id, data) {
    return request.put(`/questions/${id}`, data)
}

export function deleteQuestion(id) {
    return request.delete(`/questions/${id}`)
}

export function aiGenerateQuestions(data) {
    return request.post('/questions/ai-generate', data)
}