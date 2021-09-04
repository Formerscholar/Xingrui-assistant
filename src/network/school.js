import { request } from './request'
import Qs from 'qs'

export function getschool(params) {
  return request({
    url: '/ins/school/index',
    params,
  })
}

export function deleteSchool(params) {
  return request({
    url: '/ins/school/delete',
    params,
  })
}

export function addSchool(data) {
  return request({
    method: 'POST',
    url: '/ins/school/add',
    data,
  })
}

export function saveSchool(data) {
  return request({
    method: 'POST',
    url: '/ins/school/save',
    data,
  })
}
