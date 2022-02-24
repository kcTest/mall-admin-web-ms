import store from '@/store'

const {body} = document
const WIDTH = 1024
const RATIO = 3

export default {
    watch: {
        $route: function () {
            if (this.device === 'mobile' && this.sidebar.opened) {
                store.dispatch('CloseSidebar', {withoutAnimation: false});
            }
        },
        beforeMount() {
            window.addEventListener('resize', this.resizeHandler);
        }
    },
    methods: {
        isMobile: function () {
            const rect = body.getBoundingClientRect();
            return rect.width - RATIO < WIDTH;
        },
        resizeHandler: function () {
            if (!document.hidden) {
                const isMobile = this.isMobile();
                store.dispatch('ToggleDevice', isMobile ? 'mobile' : 'desktop');
                if (isMobile) {
                    store.dispatch('CloseSidebar', {withoutAnimation: true})
                }
            }
        }
    }
}