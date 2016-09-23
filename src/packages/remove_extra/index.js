/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import getRequireKind from '../common/getRequireKind';
import isRequire from '../common/isRequire';

/**
 * Removes extra imports.
 *
 *   type Options = ?{
 *   };
 *
 */
export default function remove_extra(_options) {
  const options = _options || {};
  return function babel_plugin({types: t}) {
    return {
      visitor: {
        Program: {
          exit(path) {
            // These are all of the nodes we consider "requires" in the program.
            const REQUIRES = {
              type: new Set(),
              value: new Set(),
            };

            path.node.body.forEach(node => {
              if (isRequire(node)) {
                const requireKind = getRequireKind(node);
                REQUIRES[requireKind].add(node);
              }
            });

            // Traverse the program, to figure out all bindings that are used.
            const BINDINGS = {
              type: new Set(),
              value: new Set(),
            };

            path.traverse({
              Identifier(path) {

                // We ignore any bindings that are in the requires themselves.
                let curr = path;
                while (curr) {
                  if (
                    REQUIRES.type.has(curr.node) ||
                    REQUIRES.value.has(curr.node)
                  ) {
                    return;
                  }
                  curr = curr.parentPath;
                }

                // Check where the binding of the name came from and save it.
                const name = path.node.name;
                if (path.scope.hasBinding(name)) {
                  const kind = t.isGenericTypeAnnotation(path.parentPath.node)
                    ? 'type'
                    : 'value';
                  BINDINGS[kind].add(path.scope.getBindingIdentifier(name));
                }
              },
            });

            // Remove all of the valid requires where all ids are unused.
            const requiresToRemove = new Set();

            REQUIRES.type.forEach(requireNode => {
              const ids = getIDsFromRequireNode(requireNode);
              if (ids.every(id => !BINDINGS.type.has(id))) {
                requiresToRemove.add(requireNode);
              }
            });

            REQUIRES.value.forEach(requireNode => {
              const ids = getIDsFromRequireNode(requireNode);
              if (ids.every(id => !BINDINGS.value.has(id))) {
                requiresToRemove.add(requireNode);
              }
            });

            if (requiresToRemove.size > 0) {
              path.node.body = path.node.body.filter(
                node => !requiresToRemove.has(node)
              );
            }
          },
        },
      },
    };
  };
}

function getIDsFromRequireNode(node) {
  if (node.type === 'VariableDeclaration') {
    return [node.declarations[0].id];
  }
  if (node.type === 'ImportDeclaration') {
    return node.specifiers.map(s => s.local);
  }
  throw new Error('Asking for require IDs of an unknown require type.');
}
