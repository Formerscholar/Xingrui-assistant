import { request } from './request'
import Qs from 'qs'

export function getTeamList(params) {
  return request({
    url: '/ins/Team/index',
    params,
  })
}
export function addTeam(data) {
  return request({
    method:'post',
    url: '/ins/Team/add',
    data,
  })
}
export function saveTeam(data) {
  return request({
    method:'post',
    url: '/ins/Team/save',
    data,
  })
}
export function deleteTeam(params) {
  return request({
    url: '/ins/Team/delete',
    params,
  })
}
export function detailTeam(params) {
  return request({
    url: '/ins/Team/detail',
    params,
  })
}
export function detailTeamStudentList(params) {
  return request({
    url: '/ins/Team/detailStudentList',
    params,
  })
}
//将已经存在的学生加入到指定班级中
export function addToTeam(data) {
  return request({
    method: 'POST',
    url: '/ins/Student/addToTeam',
    data: data,
  })
}