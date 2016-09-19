/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

export default function getRequireKind(node) {
  if (node.type === 'ImportDeclaration') {
    if (node.importKind === 'type') {
      return 'type';
    } else {
      return 'value';
    }
  }
  if (
    node.type === 'VariableDeclaration' &&
    node.declarations &&
    node.declarations.length === 1 &&
    node.declarations[0] &&
    node.declarations[0].type === 'VariableDeclarator' &&
    node.declarations[0].init &&
    node.declarations[0].init.type === 'CallExpression' &&
    node.declarations[0].init.callee &&
    node.declarations[0].init.callee.type === 'Identifier' &&
    node.declarations[0].init.callee.name === 'require'
  ) {
    return 'value';
  }
  return null;
}
