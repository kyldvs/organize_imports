/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

const DEFAULT_CONFIG = {
  sourceType: 'module',
  plugins: [
    'syntax-async-functions',
    'syntax-flow',
    'syntax-jsx',
    'syntax-object-rest-spread',
    'syntax-trailing-function-commas',
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
