'use strict';
const config    = require('../config');
const webpack   = require('webpack');

const appPath = config.build.main;

exports.config = {

    // if not production then we also want to load the dev tools onto the client
    entry: config.production
        ? { app: appPath }
        : { app: [ appPath, 'webpack/hot/dev-server', 'webpack-hot-middleware/client' ] },

    output: {
        filename: 'bundle.js',
        path: config.build.dest
    },

    context: config.build.dest,

    // if not production then we also want source maps for easier front-end debugging
    devtool: config.production ? 'none' : 'eval-source-map',

    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        }
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    { loader: "style-loader" }, // creates style nodes from JS strings
                    { loader: "css-loader" },   // translates CSS into CommonJS
                    { loader: "sass-loader" }   // compiles Sass to CSS
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },

    // if production then minimize JavaScript, otherwise enable hot module replacements
    plugins: config.production
        ? [
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
            new webpack.optimize.UglifyJsPlugin()
        ]
        : [ new webpack.HotModuleReplacementPlugin() ]
};

exports.build = function () {
    return new Promise((resolve, reject) => {
        webpack(exports.config, err => {
            if (err) return reject(err);
            resolve()
        });
    });
};
