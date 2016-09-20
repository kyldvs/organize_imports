/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import isCapitalized from './isCapitalized';

const REQUIRE_CALL_EXPRESSION = {
  type: 'CallExpression',
  callee: {
    type: 'Identifier',
    name: 'require',
  },
  arguments: [{
    type: 'StringLiteral',
  }],
};

const REQUIRE_GROUPS = [
  // Type imports.
  [
    // import type Foo from 'foo';
    {
      type: 'ImportDeclaration',
      importKind: 'type',
      specifiers: [{
        type: 'ImportDefaultSpecifier',
      }],
    },

    // import type {Foo} from 'foo';
    {
      type: 'ImportDeclaration',
      importKind: 'type',
    },
  ],

  // Side effects.
  [
    // require('foo');
    {
      type: 'ExpressionStatement',
      expression: REQUIRE_CALL_EXPRESSION,
    },
  ],

  // Normal imports.
  [
    // import Foo from 'foo';
    {
      type: 'ImportDeclaration',
      importKind: 'value',
      specifiers: [{
        type: 'ImportDefaultSpecifier',
      }],
    },

    // import {Foo} from 'foo';
    {
      type: 'ImportDeclaration',
      importKind: 'value',
    },
  ],

  // TitleCase requires.
  [
    {
      type: 'VariableDeclaration',
      declarations: [{
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: name => isCapitalized(name),
        },
        init: REQUIRE_CALL_EXPRESSION,
      }],
    },
  ],

  // camelCase requires.
  [
    {
      type: 'VariableDeclaration',
      declarations: [{
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: name => !isCapitalized(name),
        },
        init: REQUIRE_CALL_EXPRESSION,
      }],
    },
  ],

  // Object pattern requires.
  [
    {
      type: 'VariableDeclaration',
      declarations: [{
        type: 'VariableDeclarator',
        id: {
          type: 'ObjectPattern',
        },
        init: REQUIRE_CALL_EXPRESSION,
      }],
    },
  ],
];

export default REQUIRE_GROUPS;
