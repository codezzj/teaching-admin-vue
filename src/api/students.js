// src/api/students.js
import request from '../utils/request'

export function getStudents(params) {
    return request.get('/students', { params })
}

export function createStudent(data) {
    return request.post('/students', data)
}

export function updateStudent(id, data) {
    return request.put(`/students/${id}`, data)
}

export function deleteStudent(id) {
    return request.delete(`/students/${id}`)
}