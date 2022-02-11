import Vue from 'vue'

import ElementUI from 'element-ui'
//主题
import '@/styles/element-variables.scss'
//国际化
import locale from 'element-ui/lib/locale/lang/en';

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
