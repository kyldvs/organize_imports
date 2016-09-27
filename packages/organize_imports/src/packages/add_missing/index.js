/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import isFlowDeclarationIdentifier from '../common/isFlowDeclarationIdentifier';
import isRequire from '../common/isRequire';
import globals from 'globals';

const RELEVANT_GLOBALS = new Set(Object.keys({
  ...globals.builtin,
  ...globals.es5,
  ...globals.es6,
  ...globals.browser,
  ...globals.node,
  ...globals.commonjs,
  ...globals.jest,
}));

/**
 * Adds missing imports.
 *
 *   type Options = ?{
 *     importKind?: 'import' | 'require' | 'auto',
 *   };
 *
 */
export default function add_missing(_options) {
  const options = _options || {};
  return function babel_plugin({types: t}) {
    return {
      visitor: {
        Program: {
          exit(path) {
            const maybeUndeclared = new Set(Object.keys(path.scope.globals));

            // Cache of requires to add, based on kind.
            const CACHE = {
              value: new Set(),
              type: new Set(),
            };

            // Determine the kind of import we should add by default.
            let importKind = options.importKind || 'auto';
            const extraVisitors = importKind === 'auto'
              ? {
                ImportDeclaration(path) {
                  if (path.node.importKind === 'value') {
                    importKind = 'import';
                  }
                },
              }
              : {};

            // Find all the identifiers we need to import.
            path.traverse({
              ...extraVisitors,
              Identifier(path) {
                const name = path.node.name;

                if (RELEVANT_GLOBALS.has(name)) {
                  return;
                }

                if (!maybeUndeclared.has(name)) {
                  return;
                }

                let kind = 'value';
                if (t.isGenericTypeAnnotation(path.parentPath.node)) {
                  kind = 'type';
                  if (path.scope.hasBinding(name)) {
                    return;
                  }
                  if (isFlowDeclarationIdentifier(path)) {
                    return;
                  }
                } else if (isFlowPath(path)) {
                  return;
                }

                CACHE[kind].add(name);
              },
            });

            // If it's still auto after the traversal we should use `require`.
            if (importKind === 'auto') {
              importKind = 'require';
            }

            // Add all the requires that we found.
            const added = new Set();
            const importNodes = [];
            CACHE.value.forEach(name => {
              if (!added.has(name)) {
                added.add(name);
                importNodes.push(createImportNode(t, name, importKind));
              }
            });
            CACHE.type.forEach(name => {
              if (!added.has(name)) {
                added.add(name);
                importNodes.push(createImportNode(t, name, 'type'));
              }
            });
            path.node.body = addImportsToBody(t, importNodes, path.node.body);
          },
        },
      },
    };
  };
}

function createImportNode(t, name, kind) {
  if (kind === 'type') {
    const result = t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(name))],
      t.stringLiteral(name),
    );
    result.importKind = 'type';
    return result;
  } else if (kind === 'require') {
    return t.variableDeclaration(
      'const',
      [t.variableDeclarator(
        t.identifier(name),
        t.callExpression(
          t.identifier('require'),
          [t.stringLiteral(name)]
        )
      )]
    );
  } else if (kind === 'import') {
    return t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(name))],
      t.stringLiteral(name)
    );
  } else {
    throw new Error('Kind not specified when creating import node.');
  }
}

function addImportsToBody(t, importNodes, body) {
  let index = 0;
  let triggered = false;
  for (; index < body.length; index++) {
    const bodyNode = body[index];
    if (isRequire(bodyNode)) {
      triggered = true;
    } else if (triggered) {
      break;
    }
  }
  if (index === body.length) {
    index = 0;
  }
  const start = body.slice(0, index);
  const end = body.slice(index);
  return [].concat(start, importNodes, end);
}

function isFlowPath(path) {
  if (!path) {
    return false;
  }
  if (path.isFlow()) {
    return true;
  }
  return isFlowPath(path.parentPath);
}
