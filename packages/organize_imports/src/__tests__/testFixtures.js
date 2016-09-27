/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import organize_imports from '../index';
import path from 'path';
import forEachFile from '../common/forEachFile';

const FIXTURES_DIR = path.join(__dirname, '..', '__fixtures__');

// Suppress console.warn's that happen in babel for using Flow as a binding.
console.warn = () => {};

forEachFile(FIXTURES_DIR, ({relativeName, contents}) => {
  test(relativeName, () => {
    expect(organize_imports(contents)).toMatchSnapshot();
  });
});
