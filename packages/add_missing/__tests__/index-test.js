/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import add_missing from '../index.js';
import * as babel from 'babel-core';

test('something', () => {
  expect(run(`foo(a, b, c); var c = 1;`)).toMatchSnapshot();
});

function run(code) {
  return babel.transform(code, {
    sourceType: 'module',
    plugins: [
      add_missing(),
    ],
  }).code;
}
