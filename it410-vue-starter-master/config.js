'use strict';
const path      = require('path');

const config = {

    // build configuration
    build: {
        dest: path.resolve(__dirname, 'www'),               // where to output build file to
        main: path.resolve(__dirname, 'src/js/app.js'),     // the main JavaScript file for your app
        src: path.resolve(__dirname, 'src')                 // the source directory to build from
    },

    // development settings - used with: npm run dev
    development: {
        browserSync: true,                  // whether to use browserSync
        host: 'http://localhost',           // the hostname
        port: 3000,                         // the port to run the development server on
        serverArgs: ['--inspect=9229'],     // arguments to pass to the server when started up - defaults to allow remote debugging on port 9229
        serverSync: true                    // whether to restart the server when code changes on it
    },

    // environment
    production: process.env.NODE_ENV === 'production',     // whether the environment is production or not

    // server settings
    server: {
        directory: path.resolve(__dirname, 'server'),   // the directory that the server resides within
        main: path.resolve(__dirname, 'server/index'),  // the main JavaScript file for the server
        port: 3002                                      // the port to run the server on
    }

};

module.exports = config;