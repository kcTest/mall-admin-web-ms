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
}

export default getters