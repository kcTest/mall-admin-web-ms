import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import permission from './modules/permission'
import getters from './getters'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        permission,
        user
    },
    getters
})

export default store