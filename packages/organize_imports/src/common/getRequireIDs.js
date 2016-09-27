/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import match from './match';

const IMPORT_DECLARATION = {
  type: 'ImportDeclaration',
};

const SIDE_EFFECT = {
  type: 'ExpressionStatement',
};

const SIMPLE_VARIABLE_DECLARATION = {
  type: 'VariableDeclaration',
  declarations: [{
    type: 'VariableDeclarator',
    id: {
      type: 'Identifier',
    },
  }],
};

const DESTRUCTURE_VARIABLE_DECLARATION = {
  type: 'VariableDeclaration',
  declarations: [{
    type: 'VariableDeclarator',
    id: {
      type: 'ObjectPattern',
    },
  }],
};

const SIMPLE_PROPERTY = {
  type: 'ObjectProperty',
  shorthand: true,
  key: {
    type: 'Identifier',
  },
};

/**
 * Precondition: isRequire(node) is true
 */
export default function getRequireIDs(node) {
  if (match(node, IMPORT_DECLARATION)) {
    return node.specifiers.map(s => s.local.name);
  }
  if (match(node, SIDE_EFFECT)) {
    return [node.expression.arguments[0].value];
  }
  if (match(node, SIMPLE_VARIABLE_DECLARATION)) {
    return [node.declarations[0].id.name];
  }
  if (match(node, DESTRUCTURE_VARIABLE_DECLARATION)) {
    return node.declarations[0].id.properties
      .map(property => {
        if (match(property, SIMPLE_PROPERTY)) {
          return property.key.name;
        }
        return null;
      })
      .filter(s => !!s);
  }
  return [];
}
