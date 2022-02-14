import router from './router'
import store from './store'
import NProgress from 'nprogress'
import {getToken} from "@/utils/auth";

const whiltList = ['/login']
router.beforeEach((to, from, next) => {
    NProgress.start();
    if (getToken()) {
        if (to.path === 'login') {
            next({path: '/'});
            NProgress.done();
        } else {
            if (store.getters.roles.length === 0) {
                store.dispatch('GetInfo').then(res => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
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