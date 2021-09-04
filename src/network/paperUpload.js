import { request } from './request'
import Qs from 'qs'

export function getList(params) {
  return request({
    url: '/ins/paperupload/index',
    params,
  })
}

export function add(data) {
  return request({
    method: 'POST',
    url: '/ins/paperupload/add',
    data,
  })
}

