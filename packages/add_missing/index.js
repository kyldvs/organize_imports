/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

export default function add_missing(options) {
  return function babel_plugin({types: t}) {
    return {
      visitor: {
        Identifier(path) {
          if (!path.scope.hasBinding(path.node.name)) {
            let root = path;
            while (root.node.type !== 'Program') {
              root = root.parentPath;
            }
            if (root && root.type === 'Program') {
              const theRequire = t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier(path.node.name))],
                t.stringLiteral(path.node.name)
              );
              // Find place to add require.
              let index = 0;
              for (; index < root.node.body.length; index++) {
                const bodyNode = root.node.body[index];
                if (
                  !t.isImportDeclaration(bodyNode)
                ) {
                  break;
                }
              }
              const start = root.node.body.slice(0, index);
              const end = root.node.body.slice(index);
              root.node.body = [].concat(start, theRequire, end);
            }
          }
        },
      },
    };
  };
}
