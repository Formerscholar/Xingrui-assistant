import { request } from './request'
import Qs from 'qs'

export function getCondition(params) {
  return request({
    url: '/ins/Famous/getCondition',
    params,
  })
}

export function getList(params) {
  return request({
    url: '/ins/Famous/index',
    params,
  })
}

export function detail(params) {
  return request({
    url: '/ins/Famous/detail',
    params,
  })
}

export function syncToLocal(data) {
  return request({
    method: 'POST',
    url: '/ins/Famous/syncToLocal',
    data: Qs.stringify(data),
  })
}
