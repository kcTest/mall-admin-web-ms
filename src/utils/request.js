import axios from "axios";
import {Message, MessageBox} from "element-ui";
import store from '@/store'
import {getToken} from '@/utils/auth'


//  创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 15000
})

//request拦截器
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['Authorization'] = getToken();
        }
        return config;
    },
    error => {
        console.log(error)
        Promise.reject(error)
    })

//response拦截器
service.interceptors.response.use(
    response => {
        // code非200认为返回错误
        const res = response.data;
        if (res.code !== 200) {
            Message({
                message: res.message,
                type: 'error',
                duration: 3 * 1000
            });

            if (res.code === 401) {
                MessageBox.confirm('你已被登出，可以取消继续留在页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        //重新实例化vue-router对象
                        location.reload()
                    })
                })
            }

            return Promise.reject('error');
        } else {
            return response.data;
        }
    }
    ,
    error => {
        console.log(error);
        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        });
        return Promise.reject(error);
    }
)

export default service