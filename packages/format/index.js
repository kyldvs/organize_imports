/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import getRequireKind from '../common/getRequireKind';

export default function format(options) {
  return function babel_plugin({types: t}) {
    return {
      visitor: {
        Program(path) {
        },
      },
    };
  };
}
