import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import Layout from '@/views/layout/Layout'

export const constantRouterMap = [
    {path: '/login', component: () => import('@/views/login/index'), hidden: true},
    {path: '/404', component: () => import('@/views/404'), hidden: true},
    {
        path: '',
        component: Layout,
        redirect: '/home',
        children: [{
            path: 'home',
            name: 'home',
            component: () => import('@/views/home/index'),
            mata: {title: '首页', icon: 'home'}
        }]
    }
]

export const asyncRouterMap = [
    {
        path: '/pms',
        component: Layout,
        redirect: '/pms/product',
        name: 'pms',
        meta: {title: '商品', icon: 'product'},
        children: [
            {
                path: 'product',
                name: 'product',
                component: () => import('@/views/pms/product/index'),
                meta: {title: '商品列表', icon: 'product-list'}
            }
        ]
    },
    {
        path: '/oms',
        component: Layout,
        redirect: '/oms/order',
        name: 'oms',
        meta: {title: '订单', icon: 'order'},
        children: [
            {
                path: 'order',
                name: 'order',
                component: () => import('@/views/oms/order/index'),
                meta: {title: '订单列表', icon: 'order-list'}

            }
        ]
    },
    {
        path: '/sms',
        component: Layout,
        redirect: '/sms/coupon',
        name: 'sms',
        meta: {title: '营销', icon: 'sms'},
        children: [
            {
                path: 'coupon',
                name: 'coupon',
                component: () => import('@/views/sms/coupon/index'),
                meta: {title: '优惠券列表', icon: 'sms-coupon'}

            }
        ]
    },
    {
        path: '/ums',
        component: Layout,
        redirect: '/ums/admin',
        name: 'ums',
        meta: {title: '权限', icon: 'ums'},
        children: [
            {
                path: 'admin',
                name: 'admin',
                component: () => import('@/views/ums/admin/index'),
                meta: {title: '用户列表', icon: 'ums-admin'}

            }
        ]
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]


export default new Router({
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

