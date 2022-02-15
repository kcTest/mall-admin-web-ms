import {constantRouterMap, asyncRouterMap} from '@/router/index'

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    actions: {
        GenerateRoutes: function (context, data) {
            return new Promise(resolve => {
                const menus = data.menus;
                const accessRouters = asyncRouterMap.filter(route => {
                    if (hasPermission(menus, route, 0)) {
                        if (route.childen && route.children.length > 0) {
                            route.childen = route.childen.filter(child => {
                                if (hasPermission(menus, child, 1)) {
                                    return child;
                                }
                                return false;
                            });
                            //返回父级
                            return route;
                        } else {
                            return route;
                        }
                    }
                    return false;
                });
                //对菜单进行排序
                sortRouters(accessRouters);
                context.commit('SET_ROUTERS', accessRouters);
                resolve();
            })
        }
    },
    mutations: {
        SET_ROUTERS: function (state, data) {
            state.addRouters = data;
            state.routers = constantRouterMap.concat(data);
        }
    }
}

//判断是否有权限访问菜单 后台返回菜单列表对比已定义路由
function hasPermission(menus, route, level) {
    if (route.name) {
        let currMenu = getMenu(route.name, menus, level);
        if (currMenu != null) {
            //设置菜单的标题、图标和可见性
            if (currMenu.title != null && currMenu.title !== '') {
                route.meta.title = currMenu.title;
            }
            if (currMenu.icon != null && currMenu.icon !== '') {
                route.meta.icon = currMenu.icon;
            }
            if (currMenu.hidden != null) {
                route.hidden = currMenu.hidden !== 0;
            }
            if (currMenu.sort != null && currMenu.sort !== '') {
                route.sort = currMenu.sort;
            }
            return true;
        } else {
            route.sort = 0;
            if (route.hidden !== undefined && route.hidden === true) {
                route.sort = -1;
                return true;
            } else {
                return false;
            }
        }
    } else {
        return false;
    }
}

//根据路由名称获取菜单
function getMenu(routeName, menus, level) {
    for (let i = 0; i < menus.length; i++) {
        let menu = menus[i];
        if (menu.level === level && menu.name === routeName) {
            return menu;
        }
    }

    return null;
}

//对菜单进行排序
function sortRouters(accessedRouters) {
    for (let i = 0; i < accessedRouters.length; i++) {
        let router = accessedRouters[i];
        if (router.children && router.children.length > 0) {
            router.children.sort(compare('sort'));
        }
    }
}

//降序比较 
function compare(prop) {
    // 返回值大于0  prev会被排列到next之后;
    return function (prev, next) {
        let prevSortValue = prev[prop];
        let nextSortValue = next[prop];
        return nextSortValue - prevSortValue;
    }
}

export default permission