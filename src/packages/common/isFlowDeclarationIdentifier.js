/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

export default function isFlowDeclarationIdentifier(path) {
  const node = path.node;

  // Need to go one parent up.
  if (path.parentPath) {
    const parent = path.parentPath.node;
    if (parent.type === 'TypeAlias') {
      return parent.id === node;
    }
  }

  // Need to go up two parents.
  if (path.parentPath && path.parentPath.parentPath) {
    const parent = path.parentPath.parentPath.node;
    if (parent.type === 'ImportDeclaration') {
      return parent.specifiers.some(specifier => (
        specifier.local === node
      ));
    }
  }

  return false;
};
