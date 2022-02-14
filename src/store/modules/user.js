import {getToken, removeToken} from "@/utils/auth";
import {getInfo} from "@/api/login";

const user = {
    state: {
        avatar: '',
        roles: [],
        token: getToken()
    },
    action: {
        GetInfo: function (context) {
            return new Promise((resolve, reject) => {
                getInfo().then(response => {
                    const data = response.data;
                    console.log(data);
                    context.commit('');
                }).catch(error => {
                    reject(error);
                })
            })
        },
        FedLogOut: function (context) {
            return new Promise(resolve => {
                context.commit('SET_TOKEN', '');
                removeToken();
                resolve();
            })
        }
    },
    mutations: {
        SET_TOKEN: function (state, data) {
            state.token = data;
        }
    }
}

export default user;