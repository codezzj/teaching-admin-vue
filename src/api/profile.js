// src/api/profile.js
import request from '../utils/request'

export function getProfile() {
    return request.get('/profile')
}

export function updateProfile(data) {
    return request.put('/profile', data)
}

export function changePassword(data) {
    return request.post('/profile/change-password', data)
}