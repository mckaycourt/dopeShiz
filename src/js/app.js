'use strict';
import App from '../components/App';
import router from '../router/router'
import store from '../store/index'
import Vue from 'vue'

import '../css/main.scss';

// an array of strings for all components that are not vue components
Vue.config.ignoredElements = [];

window.app = new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
});