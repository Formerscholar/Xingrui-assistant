import { request } from './request'
import Qs from 'qs'

export function logout(params) {
    return request({
        url: '/ins/Login/logout',
        params,
    })
}
export function getUserInfo(params) {
    return request({
        url: '/ins/user/getUserInfo',
        params,
    })
}
export function saveUserInfo(data) {
    return request({
        method:'post',
        url: '/ins/user/saveUserInfo',
        data,
    })
}
export function updatePassword(data) {
    return request({
        method:'post',
        url: '/ins/user/updatePassword',
        data,
    })
}