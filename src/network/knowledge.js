import { request } from './request'
import Qs from 'qs'

export function getquestion(params) {
  return request({
    url: '/ins/question/index',
    params,
  })
}

export function getSearchCondition(params) {
  return request({
    url: '/ins/question/getSearchCondition',
    params,
  })
}

export function getbasketAdd(params) {
  return request({
    url: '/ins/basket/add',
    params,
  })
}

export function getbasketDel(params) {
  return request({
    url: '/ins/basket/deleteById',
    params,
  })
}

export function getbasketDetail(params) {
  return request({
    url: '/ins/basket/detail',
    params,
  })
}

export function getbasketDetailAll(params) {
  return request({
    url: '/ins/basket/deleteAll',
    params,
  })
}

export function getAnswer(params) {
  return request({
    url: '/ins/question/getAnswer',
    params,
  })
}

export function getInfo(params) {
  return request({
    url: '/ins/question/getInfo',
    params,
  })
}
