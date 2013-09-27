/*global module:false*/
module.exports = function(grunt) {
  "use strict";

  grunt.loadTasks("../tasks");

  grunt.initConfig({
    imageEmbed: {
      dist: {
        src: "css/styles.css",
        dest: "css/output.css",

        options: {
          deleteAfterEncoding: false,
          maxImageSize: 0,
          fetchExternal: false,
          warnDuplication: false,
          keepParams: true,
          rewriteUrl: function(loc, opts, resp) {
            var path = loc.replace(opts.baseDir, '');
            var hash = require('crypto').createHash('md5').update(resp).digest('hex');
            return '/v-' + hash + '/' + path;
          }
        }
      }
    }
  });

  grunt.registerTask("default", ["imageEmbed"]);
};
