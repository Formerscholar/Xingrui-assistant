import { request } from './request'
import Qs from 'qs'

export function getMenus(params) {
  return request({
    url: '/ins/User/getMenus',
    params,
  })
}

export function getTeamList(params) {
  return request({
    url: '/ins/Block/getTeamList',
    params,
  })
}

export function getSubjectList(params) {
  return request({
    url: '/ins/Block/getSubjectList',
    params,
  })
}

export function getSchoolList(params) {
  return request({
    url: '/ins/Block/getSchoolList',
    params,
  })
}

export function getTeacherList(params) {
  return request({
    url: '/ins/Block/getTeacherList',
    params,
  })
}

export function getArea(params) {
  return request({
    url: '/ins/Block/getArea',
    params,
  })
}
