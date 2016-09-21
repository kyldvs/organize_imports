/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

export default function isDeclarationIdentifier(path) {
  const node = path.node;

  // Need to go one parent up.
  if (path.parentPath) {
    const parent = path.parentPath.node;

    // foo(bar) {}, in a class body for example
    if (parent.type === 'ClassMethod') {
      return (
        parent.key === node ||
        parent.params.some(param => param === node)
      );
    }

    // class foo { bar = 1; }
    if (parent.type === 'ClassProperty') {
      return parent.key === node;
    }

    // function foo(bar) {}
    if (parent.type === 'FunctionDeclaration') {
      return (
        parent.id === node ||
        parent.params.some(param => param === node)
      );
    }

    // foo = 1, this should be sufficient, no need to check VariableDeclaration
    if (parent.type === 'VariableDeclarator') {
      return parent.id === node;
    }

    // class foo {}
    if (parent.type === 'ClassDeclaration') {
      return parent.id === node;
    }

    // (foo) => {}
    if (parent.type === 'ArrowFunctionExpression') {
      return parent.params.some(param => param === node);
    }

    // try {} catch (foo) {}
    if (parent.type === 'CatchClause') {
      return parent.param === node;
    }

    // function foo(a = b) {}
    if (parent.type === 'AssignmentPattern') {
      return parent.left === node;
    }
  }

  // Need to go up two parents.
  if (path.parentPath && path.parentPath.parentPath) {
    const parent = path.parentPath.parentPath.node;

    // foo(...bar) {}, with rest arguments
    if (parent.type === 'ClassMethod') {
      return parent.params.some(param => (
        param.type === 'RestElement' &&
        param.argument === node
      ));
    }

    // function foo(...bar) {}, with rest arguments
    if (parent.type === 'FunctionDeclaration') {
      return parent.params.some(param => (
        param.type === 'RestElement' &&
        param.argument === node
      ));
    }

    // (...foo) => {}
    if (parent.type === 'ArrowFunctionExpression') {
      return parent.params.some(param => (
        param.type === 'RestElement' &&
        param.argument === node
      ));
    }
  }

  return false;
};
