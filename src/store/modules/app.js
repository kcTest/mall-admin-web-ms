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
        CloseSidebar: function (context, value) {
            context.commit('CLOSE_SIDEBAR', value.withoutAnimation);
        },
        ToggleDevice: function (context, value) {
            context.commit('TOGGLE_DEVICE', value.withoutAnimation);
        },
        ToggleSidebar: function (context) {
            context.commit('TOGGLE_SIDEBAR')
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
        },
        TOGGLE_SIDEBAR: function (state) {
            state.sidebar.opened ? Cookie.set('sidebarStatus', 1) : Cookie.set('sidebarStatus', 0);
            state.sidebar.opened = !state.sidebar.opened;
        }
    }
}

export default app