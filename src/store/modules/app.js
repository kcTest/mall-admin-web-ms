import Cookie from 'js-cookie'

const app = {
    state: {
        sidebar: {
            opened: !+Cookie.get('sidebarStatus'),
            withoutAnimation: false
        },
        device: 'desktop'
    },
    actions: {
        CloseSideBar: function (context, value) {
            context.commit('CLOSE_SIDEBAR', value.withoutAnimation);
        },
        ToggleDevice: function (context, value) {
            context.commit('TOGGLE_DEVICE', value.withoutAnimation);
        }
    },
    mutations: {
        CLOSE_SIDEBAR: function (state, value) {
            Cookie.set('sidebarStatus', 1);
            state.sidebar.opened = false;
            state.sidebar.withoutAnimation = value;
        },
        TOGGLE_DEVICE: function (state, value) {
            state.device = value;
        }
    }
}

export default app