// src/api/attendances.js
import request from '../utils/request'

export function getAttendances(params) {
    return request.get('/attendances', { params })
}

export function getAttendanceStats(params) {
    return request.get('/attendances/stats', { params })
}

export function createAttendanceSession(data) {
    return request.post('/attendances/session', data)
}