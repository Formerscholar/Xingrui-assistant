import { request } from './request'
import Qs from 'qs'

//控制台首页信息
export function getIndexData(params) {
  return request({
    url: '/ins/Index/index',
    params,
  })
}