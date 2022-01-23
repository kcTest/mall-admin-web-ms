import Cookie from 'js-cookie'

const app = {
    state: {
        sidebar: {
            opened: !+Cookie.get('sidebarStatus'),
            withoutAnimation: false
        },
        device: 'desktop'
    }
}

export default app