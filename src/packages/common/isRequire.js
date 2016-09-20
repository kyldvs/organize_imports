/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import RequireGroups from './RequireGroups';

import match from './match';

export default function isRequire(node) {
  return RequireGroups.some(
    group => group.some(
      pattern => match(node, pattern)
    )
  );
};
