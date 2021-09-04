import { request } from './request'
import Qs from 'qs'

//地区列表
export function getArea(params) {
  return request({
    url: '/ins/Block/getArea',
    params,
  })
}
//校区列表
export function getSchoolList(params) {
  return request({
    url: '/ins/Block/getSchoolList',
    params,
  })
}
//学科列表
export function getSubjectList(params) {
  return request({
    url: '/ins/Block/getSubjectList',
    params,
  })
}
//课程列表
export function getCourseList(params) {
  return request({
    url: '/ins/Block/getCourseList',
    params,
  })
}
//老师列表
export function getTeacherList(params) {
  return request({
    url: '/ins/Block/getTeacherList',
    params,
  })
}
//班级列表
export function getTeamList(params) {
  return request({
    url: '/ins/Block/getTeamList',
    params,
  })
}
//获得学生列表
export function getStudentList(params) {
  return request({
    url: '/ins/Block/getStudentList',
    params,
  })
}
//获得试卷列表
export function getPaperList(params) {
  return request({
    url: '/ins/Block/getPaperList',
    params,
  })
}
//获得试卷下题目列表
export function getPaperQuestionList(params) {
  return request({
    url: '/ins/Block/getPaperQuestionList',
    params,
  })
}
//获得学生的错题列表
export function getStudentQuestionList(params) {
  return request({
    url: '/ins/Block/getStudentQuestionList',
    params,
  })
}

//获得章节列表
export function getChapterList(params) {
  return request({
    url: '/ins/block/getChapterList',
    params,
  })
}

//获得知识点列表
export function getKnowledgeByGradIds(params) {
  return request({
    url: '/ins/block/getKnowledgeByGradIds',
    params,
  })
}

//通过科目获得题型列表
export function getTypeBySubjectId(params) {
  return request({
    url: '/ins/block/getTypeBySubjectId',
    params,
  })
}

//通过角色列表
export function getAllRole(params) {
  return request({
    url: '/ins/block/getAllRole',
    params,
  })
}

//通过课时类型列表
export function getAllBuyType(params) {
  return request({
    url: '/ins/block/getAllBuyType',
    params,
  })
}

//获得老师负责的班级列表
export function getAllTeacherTeam(params) {
  return request({
    url: '/ins/block/getAllTeacherTeam',
    params,
  })
}

//获得年级列表
export function getAllGrade(params) {
  return request({
    url: '/ins/block/getAllGrade',
    params,
  })
}