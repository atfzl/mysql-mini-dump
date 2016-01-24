'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var filePath = './../sampleConfig.js';

try {
  var config = require(filePath);
} catch (e) {
  console.log('Please provide path to valid js or json file');
  process.exit(1);
}

exports.default = config;