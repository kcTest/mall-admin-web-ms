import request from "@/utils/request";

export function deleteBrand(id) {
    return request({
        url: '/brand/delete/' + id,
        method: 'get',
    });
}


export function updateShowStatus(data) {
    return request({
        url: '/brand/update/showStatus',
        method: 'post',
        data: data
    });
}


export function updateFactoryStatus(data) {
    return request({
        url: '/brand/update/factoryStatus',
        method: 'post',
        data: data
    });
}


export function fetchList(params) {
    return request({
        url: '/brand/list',
        method: 'get',
        params: params
    });
}

