/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

export default function match(node, struct) {
  // If a function is provided in struct we will use it to test the node.
  if (typeof struct === 'function') {
    return !!struct(node);
  }

  // NaN test.
  if (node !== node && struct !== struct) {
    return true;
  }

  // Test for equality in other values.
  if (node === struct) {
    return true;
  }

  // If they are both arrays make sure every element matches.
  if (Array.isArray(node) && Array.isArray(struct)) {
    if (node.length !== struct.length) {
      return false;
    }
    for (let i = 0; i < node.length; i++) {
      if (!match(node[i], struct[i])) {
        return false;
      }
    }
    return true;
  }

  // If they are both objects we recursively test keys and values.
  if (
    Object.prototype.toString.call(node) === '[object Object]' &&
    Object.prototype.toString.call(struct) === '[object Object]'
  ) {
    // Notice that we only check the keys of struct.
    for (const key of Object.keys(struct)) {
      if (!match(node[key], struct[key])) {
        return false;
      }
    }
    return true;
  }

  // None of the other tests passed, so this is not a match.
  return false;
}
