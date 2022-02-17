import request from "@/utils/request";

export function fetchList(pid, params) {
    return request({
        url: '/sku/' + pid,
        method: 'get',
        params: params
    })
}

export function update(data) {
    return request({
        url: '/sku/update/',
        method: 'post',
        data: data
    });
}
