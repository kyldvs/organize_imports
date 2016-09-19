/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import format from '../index.js';
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
      format(options),
    ],
  })).code;
}
