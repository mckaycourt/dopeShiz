'use strict';
import actions from './actions'
import mutations from './mutations'
import Vue from 'vue'
import Vuex from 'vuex'

import counter from './modules/counter'

Vue.use(Vuex);

const state = {

};

const store = new Vuex.Store({
    actions,
    mutations,
    state,
    modules: {
        counter
    }
});

export default store