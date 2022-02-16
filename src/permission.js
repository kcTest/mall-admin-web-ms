import router from './router'
import store from './store'
import {getToken} from "@/utils/auth";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {Message} from "element-ui";

const whiltList = ['/login']
router.beforeEach((to, from, next) => {
    NProgress.start();
    if (getToken()) {
        if (to.path === '/login') {
            next({path: '/'});
            NProgress.done();
        } else {
            if (store.getters.roles.length === 0) {
                store.dispatch('GetInfo').then(res => {
                    let menus = res.data.menus;
                    let username = res.data.username;
                    //生成路由表
                    store.dispatch('GenerateRoutes', {menus, username})
                        .then(() => {
                            //添加路由表
                            router.addRoutes(store.getters.addRouters);
                            next({...to, replace: true});
                        });
                }).catch((err) => {
                    store.dispatch('FedLogOut')
                        .then(() => {
                            Message.error(err.message || 'Verification failed, please login again');
                            next({path: '/'});
                        });
                })
            } else {
                next();
            }
        }
    } else {
        if (whiltList.indexOf(to.path) !== -1) {
            next();
        } else {
            next('/login');
            NProgress.done();
        }
    }

})

router.afterEach(() => {
    NProgress.done();
})