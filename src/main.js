import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en';
//css重置
import 'normalize.css/normalize.css'
import '@/styles/index.scss'

import App from './App.vue'

import router from './router'
import store from './store'

Vue.use(ElementUI, {locale})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
