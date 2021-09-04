import { request } from './request'
import Qs from 'qs'

export function getStudent(params) {
  return request({
    url: '/ins/Student/index',
    params,
  })
}

export function StudentSave(data) {
  return request({
    method: 'POST',
    url: '/ins/Student/save',
    data,
  })
}


export function StudentAdd(data) {
  return request({
    method: 'POST',
    url: '/ins/Student/add',
    data: Qs.stringify(data),
  })
}

export function deleteStudent(params) {
  return request({
    url: '/ins/Student/delete',
    params,
  })
}

export function studentDetail(params) {
  return request({
    url: '/ins/Student/detail',
    params,
  })
}

export function studentReport(params) {
  return request({
    url: '/ins/Student/report',
    params,
  })
}
export function addMistake(data) {
  return request({
    method: 'POST',
    url: '/ins/Student/addMistake',
    data: data,
  })
}
export function removeMistake(data) {
  return request({
    method: 'POST',
    url: '/ins/Student/removeMistake',
    data: data,
  })
}
export function studentDetailStudy(params) {
  return request({
    url: '/ins/Student/studyList',
    params,
  })
}
export function studentDetailBuy(params) {
  return request({
    url: '/ins/Student/buyList',
    params,
  })
}
//保存导入学生数据
export function studentImport(data) {
  return request({
    method: 'POST',
    url: '/ins/Student/import',
    data: data,
  })
}

