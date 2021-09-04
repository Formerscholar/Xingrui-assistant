import { request } from './request'
import Qs from 'qs'

// export function getWxAuthUrl(params) {
//   return request({
//     url: '/ins/Login/getWxAuthUrl',
//     params,
//   })
// }

export function getLogin(data) {
  return request({
    method: 'POST',
    url: '/ins/login/index',
    data: Qs.stringify(data),
  })
}
