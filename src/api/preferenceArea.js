import request from "@/utils/request";

export function fetchList() {
    return request({
        url: '/preferenceArea/listAll',
        method: 'get'
    });
}