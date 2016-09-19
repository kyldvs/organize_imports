/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import getRequireKind from '../common/getRequireKind';
import match from '../common/match';

const transforms = [
  sortDestructures,
  sortSpecifiers,
];

// Only valid requires should be passed into this function
const config = [
  // Type Imports
  {
    type: 'ImportDeclaration',
    importKind: 'type',
  },

  // Side Effects
  {
    type: 'ExpressionStatement',
  },

  // TitleCase
  node => {
    if (node.type === 'ImportDeclaration') {
      return isCapitalized(node.specifiers[0].local.name);
    }
    if (node.type === 'VariableDeclaration') {
      const id = node.declarations[0].id;
      if (id.type === 'Identifier') {
        return isCapitalized(id.name);
      }
      if (id.type === 'ObjectPatern') {
        if (id.key.type === 'ObjectProperty') {
          return isCapitalized(id.key.name);
        }
        if (id.key.type === 'RestProperty') {
          // We treat rest arguments as "camelCase"
          return false;
        }
      }
    }
    return false;
  },

  // camelCase
  node => {
    if (node.type === 'ImportDeclaration') {
      return !isCapitalized(node.specifiers[0].local.name);
    }
    if (node.type === 'VariableDeclaration') {
      const id = node.declarations[0].id;
      if (id.type === 'Identifier') {
        return !isCapitalized(id.name);
      }
      if (id.type === 'ObjectPatern') {
        if (id.key.type === 'ObjectProperty') {
          return !isCapitalized(id.key.name);
        }
        if (id.key.type === 'RestProperty') {
          // We treat rest arguments as "camelCase"
          return true;
        }
      }
    }
    return false;
  },
];

export default function format(options) {
  return function babel_plugin({types: t}) {
    return {
      visitor: {
        Program(path) {

          const pre = [];
          const requires = [];
          const post = [];

          path.node.body.forEach(node => {
            if (getRequireKind(node)) {
              requires.push(node);
            } else {
              if (requires.length > 0) {
                post.push(node);
              } else {
                pre.push(node);
              }
            }
          });

          const transformed = requires.map(node => transforms.reduce(
            (node, fn) => fn(node),
            node,
          ));

          const groups = [];
          for (let i = 0; i < config.length; i++) {
            groups.push([]);
            transformed.forEach(node => {
              if (match(node, config[i])) {
                groups[i].push(node);
              }
            });
          }

          const resultRequires = [].concat(...groups);
          const resultBody = [].concat(pre, resultRequires, post);

          path.node.body = resultBody;
        },
      },
    };
  };
}

/**
 * This should only be passed import nodes, it will sort object patterns on the
 * left side of a require.
 */
function sortDestructures(node) {
  if (!match(node, {
    type: 'VariableDeclaration',
    declarations: [{
      type: 'VariableDeclarator',
      id: {
        type: 'ObjectPattern',
      },
    }],
  })) {
    return node;
  }

  node.declarations[0].id.properties.sort((p1, p2) => {
    // Rest properties always go at the end.
    if (p1.type === 'RestProperty') {
      return 1;
    }
    if (p2.type === 'RestProperty') {
      return -1;
    }

    // Sort simple properties by their identifier.
    if ([p1, p2].every(p => match(p, {
      type: 'ObjectProperty',
      key: {
        type: 'Identifier',
      },
    }))) {
      if (p1.key.name < p2.key.name) {
        return -1;
      } else if (p1.key.name > p2.key.name) {
        return 1;
      } else {
        return 0;
      }
    }

    // Not sure how to compare them otherwise. This should probable never
    // happen.
    return 0;
  });
}

/**
 * This should only be passed import nodes, it will sort specifiers in an
 * import.
 */
function sortSpecifiers(node) {
  return node;
}

function isCapitalized(str) {
  return str.charAt(0).toUpperCase() === str.charAt(0);
}
