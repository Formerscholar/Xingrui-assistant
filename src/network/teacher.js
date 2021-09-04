import { request } from './request'
import Qs from 'qs'

export function getTeacherList(params) {
  return request({
    url: '/ins/teacher/index',
    params,
  })
}

export function teacherAdd(data) {
  return request({
    method: 'POST',
    url: '/ins/teacher/add',
    data: Qs.stringify(data),
  })
}

export function deleteTeacher(params) {
  return request({
    url: '/ins/teacher/delete',
    params,
  })
}

export function teacherSave(data) {
  return request({
    method: 'POST',
    url: '/ins/teacher/save',
    data: Qs.stringify(data),
  })
}

export function getTeacherDetail(params) {
  return request({
    url: '/ins/teacher/detail',
    params,
  })
}

//保存导入老师数据
export function teacherImport(data) {
  return request({
    method: 'POST',
    url: '/ins/teacher/import',
    data: data,
  })
}