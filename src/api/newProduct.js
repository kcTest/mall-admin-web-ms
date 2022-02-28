import request from "@/utils/request";

export function updateNewProductSort(id, params) {
    return request({
        url: '/home/newProduct/update/sort/' + id,
        method: 'post',
        params: params
    });
}


export function createNewProduct(data) {
    return request({
        url: '/home/newProduct/create',
        method: 'post',
        data: data
    });
}


export function deleteNewProduct(data) {
    return request({
        url: '/home/newProduct/delete',
        method: 'post',
        data: data
    });
}


export function updateRecommendStatus(data) {
    return request({
        url: '/home/newProduct/update/recommendStatus',
        method: 'post',
        data: data
    });
}


export function fetchList(params) {
    return request({
        url: '/home/newProduct/list',
        method: 'get',
        params: params
    });
}