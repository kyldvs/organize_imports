/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

export default function postProcess(code) {
  return code.replace(/\s*\$\$NEWLINE\$\$;\s*/g, '\n');
};
