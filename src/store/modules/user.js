import {getToken, setToken, removeToken} from "@/utils/auth";
import {login, getInfo, logout} from "@/api/login";

const user = {
    state: {
        avatar: '',
        roles: [],
        token: getToken(),
        name: ''
    },
    actions: {
        //获取用户信息
        GetInfo: function ({commit}) {
            return new Promise((resolve, reject) => {
                getInfo().then(response => {
                    const data = response.data;
                    const roles = data.roles;
                    if (roles && roles.length > 0) {
                        commit('SET_ROLES', roles);
                    } else {
                        reject('getInfo: roles must be a non-null array !');
                    }
                    commit('SET_NAME', data.username);
                    commit('SET_AVATAR', data.icon);
                    resolve(response);
                }).catch(error => {
                    reject(error);
                })
            })
        },
        LogOut: function ({commit}) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    removeToken();
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },
        FedLogOut: function (context) {
            return new Promise(resolve => {
                context.commit('SET_TOKEN', '');
                removeToken();
                resolve();
            })
        },
        Login: function (context, data) {
            const username = data.username.trim();
            return new Promise((resolve, reject) => {
                login(username, data.password).then(response => {
                    const data = response.data;
                    const tokenStr = data.tokenHead + data.token;
                    setToken(tokenStr);
                    context.commit('SET_TOKEN', tokenStr);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            });
        }
    },
    mutations: {
        SET_TOKEN: function (state, data) {
            state.token = data;
        },
        SET_ROLES: function (state, data) {
            state.roles = data;
        },
        SET_NAME: function (state, data) {
            state.name = data;
        },
        SET_AVATAR: function (state, data) {
            state.avatar = data;
        }
    }
}

export default user;