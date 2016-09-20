/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import organize_imports from '../index';
import path from 'path';
import forEachFile from '../packages/common/forEachFile';

const FIXTURES_DIR = path.join(__dirname, '..', '__fixtures__');

forEachFile(FIXTURES_DIR, ({relativeName, contents}) => {
  test(relativeName, () => {
    expect(organize_imports(contents)).toMatchSnapshot();
  });
});
