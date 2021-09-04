import { request } from './request'
import Qs from 'qs'

export function getbuyList(params) {
  return request({
    url: '/ins/Course/buyList',
    params,
  })
}
export function saveBuy(data) {
  return request({
    method: 'POST',
    url: '/ins/Course/saveBuy',
    data,
  })
}
export function addBuy(data) {
  return request({
    method: 'POST',
    url: '/ins/Course/addBuy',
    data,
  })
}
export function deleteBuy(params) {
  return request({
    url: '/ins/Course/deleteBuy',
    params,
  })
}
export function BuyImport(data) {
  return request({
    method: 'POST',
    url: '/ins/Course/importBuy',
    data,
  })
}