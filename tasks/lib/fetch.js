/*
 * Grunt CSS Url Rewrite
 * https://github.com/jpunt/grunt-css-url-rewrite
 *
 * Copyright (c) 2012 Eric Hynds
 * Licensed under the MIT license.
 */

// Node libs
var request = require('request');
var stream = require('stream');
var buffers = require('buffers');

// Grunt export wrapper
exports.init = function (grunt) {
  'use strict';

  var exports = {};

  /**
   * Fetches a remote image.
   *
   * @param img Remote path, like http://url.to/an/image.png
   * @param done Function to call once done
   */
  exports.image = function (url, done) {
    var resultBuffer;
    var buffList = buffers();
    var imageStream = new stream.Stream();

    imageStream.writable = true;
    imageStream.write = function (data) {
      buffList.push(new Buffer(data));
    };
    imageStream.end = function () {
      resultBuffer = buffList.toBuffer();
    };

    request(url, function (error, response, body) {
      if (error) {
        done('Unable to get ' + url + '. Error: ' + error.message);
        return;
      }

      // Bail if we get anything other than 200
      if (response.statusCode !== 200) {
        done('Unable to get ' + url + ' because the URL did not return an image. Status code ' + response.statusCode + ' received');
        return;
      }

      done(null, resultBuffer, true);
    }).pipe(imageStream);
  };

  return exports;
};
