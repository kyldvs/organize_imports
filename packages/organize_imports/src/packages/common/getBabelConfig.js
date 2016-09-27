/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

const DEFAULT_CONFIG = {
  sourceType: 'module',
  plugins: [
    require('babel-plugin-syntax-async-functions'),
    require('babel-plugin-syntax-flow'),
    require('babel-plugin-syntax-jsx'),
    require('babel-plugin-syntax-object-rest-spread'),
    require('babel-plugin-syntax-trailing-function-commas'),
  ],
};

export default function getBabelConfig(config) {
  if (!config) {
    return DEFAULT_CONFIG;
  }
  const result = {};
  const allKeys = [].concat(Object.keys(config), Object.keys(DEFAULT_CONFIG));
  allKeys.forEach(key => {
    if (config[key]) {
      if (Array.isArray(DEFAULT_CONFIG[key])) {
        result[key] = [].concat(DEFAULT_CONFIG[key], config[key]);
      } else {
        result[key] = config[key];
      }
    } else {
      result[key] = DEFAULT_CONFIG[key];
    }
  });
  return result;
};
