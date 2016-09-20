/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import add_missing from '../index';
import * as babel from 'babel-core';
import forEachFile from '../../common/forEachFile';
import getBabelConfig from '../../common/getBabelConfig';
import path from 'path';

const FIXTURES_DIR = path.join(__dirname, '..', '__fixtures__');

forEachFile(FIXTURES_DIR, ({relativeName, contents}) => {
  test(relativeName, () => {
    expect(run(contents)).toMatchSnapshot();
    expect(run(contents, {importKind: 'auto'})).toMatchSnapshot();
    expect(run(contents, {importKind: 'require'})).toMatchSnapshot();
    expect(run(contents, {importKind: 'import'})).toMatchSnapshot();
  });
});

function run(code, options) {
  return babel.transform(code, getBabelConfig({
    plugins: [
      add_missing(options),
    ],
  })).code;
}
