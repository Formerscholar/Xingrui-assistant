import { request } from './request'
import Qs from 'qs'

export function getCondition(params) {
  return request({
    url: '/ins/Material/getCondition',
    params,
  })
}

export function getList(params) {
  return request({
    url: '/ins/Material/index',
    params,
  })
}

export function syncToLocal(data) {
  return request({
    method:'post',
    url: '/ins/Material/syncToLocal',
    data,
  })
}

export function getMyList(params) {
  return request({
    url: '/ins/Material/my',
    params,
  })
}
export function remove(params) {
  return request({
    url: '/ins/Material/delete',
    params,
  })
}

export function addMaterial(data) {
  return request({
    method:'post',
    url: '/ins/Material/add',
    data,
  })
}