'use strict';
const gulp      = require('gulp');
const webpack   = require('./webpack');
const server    = require('./server');

gulp.task('dev', server);

gulp.task('build', webpack.build);

gulp.task('default', ['build']);