import request from "@/utils/request";


export function fetchList(cid, params) {
    return request({
        url: '/productAttribute/list/' + cid,
        method: 'get',
        params: params
    });
}

// 查询单个属性
export function getProductAttr(id) {
    return request({
        url: '/productAttribute/' + id,
        method: 'get',
    });
}

// 根据 商品分类ID 查询 商品属性及商品属性分类
export function getProductAttrInfo(productCateId) {
    return request({
        url: '/productAttribute/attrInfo/' + productCateId,
        method: 'get',
    });
}


export function deleteProductAttr(data) {
    return request({
        url: '/productAttribute/delete',
        method: 'post',
        data: data
    });
}


export function updateProductAttr(id, data) {
    return request({
        url: '/productAttribute/update/' + id,
        method: 'post',
        data: data
    });
}

export function createProductAttr(data) {
    return request({
        url: '/productAttribute/create',
        method: 'post',
        data: data
    });
}
