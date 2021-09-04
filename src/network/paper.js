import { request } from './request'
import Qs from 'qs'

export function getpaperList(params) {
  return request({
    url: '/ins/paper/index',
    params,
  })
}


export function getdeleteItem(params) {
  return request({
    url: '/ins/paper/delete',
    params,
  })
}

export function geteditItem(params) {
  return request({
    url: '/ins/paper/edit',
    params,
  })
}

export function getPaperDetail(params) {
  return request({
    url: '/ins/paper/detail',
    params,
  })
}

