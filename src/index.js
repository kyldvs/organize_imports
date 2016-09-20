/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import addMising from './packages/add_missing/index';
import * as babel from 'babel-core';
import format from './packages/format/index';
import getBabelConfig from './packages/getBabelConfig';
import postProcess from './packages/postProcess';
import removeExtra from './packages/remove_extra/index';

export default function organize_imports(code, _options) {
  const options = _options || {};
  return postProcess(babel.transform(code, getBabelConfig({
    plugins: [
      removeExtra(options.remove_extra),
      addMissing(options.add_missing),
      format(options.format),
    ],
  })).code);
}
