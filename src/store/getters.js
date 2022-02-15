const getters = {
    sidebar: (state) => {
        return state.app.sidebar
    },
    avatar: (state) => {
        return state.user.avatar
    },
    routers: (state) => {
        return state.permission.routers
    },
    roles: function (state) {
        return state.user.roles
    },
    token: state => state.user.token,
    addRouters: state => state.permission.addRouters
}

export default getters