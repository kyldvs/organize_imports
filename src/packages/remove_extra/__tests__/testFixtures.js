/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import remove_extra from '../index.js';
import * as babel from 'babel-core';
import forEachFile from '../../common/forEachFile';
import getBabelConfig from '../../common/getBabelConfig';
import path from 'path';

const FIXTURES_DIR = path.join(__dirname, '..', '__fixtures__');

forEachFile(FIXTURES_DIR, ({relativeName, contents}) => {
  test(relativeName, () => {
    expect(run(contents)).toMatchSnapshot();
  });
});

function run(code, options) {
  return babel.transform(code, getBabelConfig({
    plugins: [
      remove_extra(options),
    ],
  })).code;
}
