import {request} from "./request";

export function getBuyType(params) {
    return request({
        url: '/ins/BuyType/index',
        params,
    })
}

export function editBuyType(params) {
    return request({
        url: '/ins/BuyType/edit',
        params,
    })
}

export function saveBuyType(data) {
    return request({
        method: 'POST',
        url: '/ins/BuyType/save',
        data,
    })
}

export function addBuyType(data) {
    return request({
        method: 'POST',
        url: '/ins/BuyType/add',
        data,
    })
}

export function deleteBuyType(params) {
    return request({
        url: '/ins/BuyType/delete',
        params,
    })
}