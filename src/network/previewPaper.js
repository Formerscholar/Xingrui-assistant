import { request } from './request'
import Qs from 'qs'

export function getbasketList(params) {
  return request({
    url: '/ins/basket/index',
    params,
  })
}

export function getSetScore(params) {
  return request({
    url: '/ins/basket/setScore',
    params,
  })
}

export function getSetSort(params) {
  return request({
    url: '/ins/basket/sort',
    params,
  })
}

export function getdeleteById(params) {
  return request({
    url: '/ins/basket/deleteById',
    params,
  })
}

export function getdeleteByType(params) {
  return request({
    url: '/ins/basket/deleteByType',
    params,
  })
}


export function getPaperAdd(data) {
  return request({
    method: 'POST',
    url: '/ins/paper/add',
    data: Qs.stringify(data),
  })
}



export function getPaperSave(data) {
  return request({
    method: 'POST',
    url: '/ins/paper/save',
    data: Qs.stringify(data),
  })
}