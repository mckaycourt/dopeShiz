'use strict';
import Home from './Home'
import Temp from './Temp'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: Home },
        { path: '/:title', component: Temp },

        { path: '*', redirect: '/' }
    ]
});