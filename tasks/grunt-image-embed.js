/*
 * Grunt CSS Url Rewrite
 * https://github.com/jpunt/grunt-css-url-rewrite
 *
 * Copyright (c) 2013 Eric Hynds
 * Licensed under the MIT license.
 */

// Internal libs
var grunt_encode = require('./lib/encode');
var async = require('async');
var _ = require('lodash');

module.exports = function (grunt) {
  'use strict';

  // Grunt lib init
  var encode = grunt_encode.init(grunt);

  grunt.registerMultiTask('cssUrlRewrite', 'Rewrite URIs inside your stylesheets', function () {
    var opts = this.options();
    var done = opts.parallel === false ? function () {} : this.async();

    var filesRemaining = this.files.length;

    // Process each src file
    this.files.forEach(function (file) {
      var dest = file.dest;
      var tasks;

      tasks = file.src.map(function (srcFile) {
        return function (callback) {
          encode.stylesheet(srcFile, opts, callback);
        };
      });

      // Once all files have been processed write them out.
      var callback = function (err, output) {
        grunt.file.write(dest, output);
        grunt.log.writeln('File "' + dest + '" created.');
        filesRemaining--;
        if (filesRemaining === 0) {
          done();
        }
      };

      if (opts.parallel === false) {
        _.each(tasks, function (task) {
          task(callback);
        });
      } else {
        // Once all files have been processed write them out.
        async.parallel(tasks, callback);
      }
    });
  });
};
