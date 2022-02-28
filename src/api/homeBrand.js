import request from "@/utils/request";

export function updateHomeBrandSort(id, params) {
    return request({
        url: '/home/brand/update/sort/' + id,
        method: 'post',
        params: params
    });
}


export function createHomeBrand(data) {
    return request({
        url: '/home/brand/create',
        method: 'post',
        data: data
    });
}


export function deleteHomeBrand(data) {
    return request({
        url: '/home/brand/delete',
        method: 'post',
        data: data
    });
}


export function updateRecommendStatus(data) {
    return request({
        url: '/home/brand/update/recommendStatus',
        method: 'post',
        data: data
    });
}


export function fetchList(params) {
    return request({
        url: '/home/brand/list',
        method: 'get',
        params: params
    });
}