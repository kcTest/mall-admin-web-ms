import request from "@/utils/request";

export function fetchList(params) {
    return request({
        url: '/productAttribute/category/list/',
        method: 'get',
        params: params
    });
}

// 查询所有 商品属性分类 及其下 属性
export function fetchListWithAttr() {
    return request({
        url: '/productAttribute/category/list/withAttr',
        method: 'get',
    });
}

export function deleteProductAttrCate(id) {
    return request({
        url: '/productAttribute/category/delete/' + id,
        method: 'get'
    });
}

export function createProductAttrCate(data) {
    return request({
        url: '/productAttribute/category/create',
        method: 'post',
        data: data
    });
}

export function updateProductAttrCate(id, data) {
    return request({
        url: '/productAttribute/category/update/' + id,
        method: 'post',
        data: data
    });
}

