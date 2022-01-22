import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import Layout from '@/views/Layout/Layout'

export const constantRouteMap = [
    {
        path: '',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: 'home',
                name: 'home',
                component: () => import('@/views/home/index'),
                mata: {title: '首页', icon: 'home'}
            }
        ]
    },
    {path: '/login', component: () => import('@/views/login/index'), hidden: true},
]

export default new Router({
    scrollBehavior: () => ({y: 0}),
    routes: constantRouteMap
})

