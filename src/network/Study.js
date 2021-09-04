import { request } from './request'
import Qs from 'qs'

export function getStudyList(params) {
  return request({
    url: '/ins/Study/index',
    params,
  })
}
export function editStudy(params) {
  return request({
    url: '/ins/Study/edit',
    params,
  })
}
export function saveStudy(data) {
  return request({
    method: 'POST',
    url: '/ins/Study/save',
    data,
  })
}
export function addStudy(data) {
  return request({
    method: 'POST',
    url: '/ins/Study/add',
    data,
  })
}
export function deleteStudy(params) {
  return request({
    url: '/ins/Study/delete',
    params,
  })
}
export function studyDetail(params) {
  return request({
    url: '/ins/Study/detail',
    params,
  })
}