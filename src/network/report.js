import { request } from './request'
import Qs from 'qs'

export function getCondition(params) {
  return request({
    url: '/ins/Report/getCondition',
    params,
  })
}

export function getList(params) {
  return request({
    url: '/ins/Report/index',
    params,
  })
}

export function getQuestionList(params) {
  return request({
    url: '/ins/Report/getQuestionList',
    params,
  })
}