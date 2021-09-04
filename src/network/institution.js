import { request } from './request'
import Qs from 'qs'

export function getInstitutionInfo(params) {
  return request({
    url: '/ins/Institution/info',
    params,
  })
}

export function saveInstitutionInfo(data) {
  return request({
    method:'post',
    url: '/ins/Institution/save',
    data,
  })
}


