// https://vuex.vuejs.org/en/modules.html
/**
 * The following is an example of a Vuex module.
 * The module is exported here and imported by the file
 * at src/store/index.js.
 **/
'use strict';
export default {
    state: {
        count: 0
    },
    mutations: {
        incrementCount (state) {
            state.count++;
        },
        setCount (state, value) {
            state.count = value;
        }
    },
    getters: {
        doubleCount (state) {
            return state.doubleCount++;
        }
    }
};