/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import format from '../index';
import * as babel from 'babel-core';
import forEachFile from '../../common/forEachFile';
import getBabelConfig from '../../common/getBabelConfig';
import path from 'path';
import postProcess from '../../common/postProcess';

const FIXTURES_DIR = path.join(__dirname, '..', '__fixtures__');

forEachFile(FIXTURES_DIR, ({relativeName, contents}) => {
  test(relativeName, () => {
    expect(run(contents)).toMatchSnapshot();
  });
});

function run(code, options) {
  return postProcess(babel.transform(code, getBabelConfig({
    plugins: [
      format(options),
    ],
  })).code);
}
