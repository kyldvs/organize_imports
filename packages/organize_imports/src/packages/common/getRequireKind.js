/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

export default function getRequireKind(node) {
  if (node.type === 'ImportDeclaration') {
    if (node.importKind === 'type') {
      return 'type';
    }
  }
  return 'value';
}
