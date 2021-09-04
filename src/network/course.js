import { request } from './request'
import Qs from 'qs'

export function getCourse(params) {
  return request({
    url: '/ins/Course/index',
    params,
  })
}
export function saveCourse(data) {
  return request({
    method:'post',
    url: '/ins/Course/save',
    data,
  })
}
export function addCourse(data) {
  return request({
    method:'post',
    url: '/ins/Course/add',
    data,
  })
}
export function delelteCourse(params) {
  return request({
    url: '/ins/Course/delete',
    params,
  })
}