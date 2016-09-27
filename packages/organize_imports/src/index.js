/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import addMissing from './add_missing/index';
import * as babel from 'babel-core';
import format from './format/index';
import getBabelConfig from './common/getBabelConfig';
import postProcess from './common/postProcess';
import removeExtra from './remove_extra/index';

module.exports = function organize_imports(code, _options) {
  const options = _options || {};
  return postProcess(babel.transform(code, getBabelConfig({
    plugins: [
      removeExtra(options.remove_extra),
      addMissing(options.add_missing),
      format(options.format),
    ],
  })).code);
}
