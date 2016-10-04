/*
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @flow
 */

'use strict';

import getPosition from '../getPosition';
import invariant from 'assert';
import updateCursors from '../index';

describe('updateCursor', () => {
  it('should work for a simple test case', () => {
    run(
      'simple|test',
      'extra-simple|test',
    );
  });

  it('should handle splitting function parameters', () => {
    run(
      'foo(a,| b)',
      `foo(
        a,|
        b
      )`,
    );
  });

  it('should handle splitting function parameters with a comma added', () => {
    run(
      'foo(a, b, c|)',
      `foo(
        a,
        b,
        c|,
      )`,
    );
  });

  it('should handle condensing function parameters', () => {
    run(
      `foo(
        a,
        b|
      )`,
      'foo(a, b|)',
    );
  });

  it('should handle condensing function parameters with comma removed', () => {
    run(
      `foo(
        a,
        b,|
      )`,
      'foo(a, b|)',
    );
  });

  it('should return original position if it has no clue what to do', () => {
    run(
      'abc|def',
      'hij|klm',
    );
  });

  it('should handle removing extra parenthesis', () => {
    run(
      '((1 + 2) + 3)|',
      '1 + 2 + 3|',
    );
  });

  it('should handle array accesses', () => {
    run(
      'foo[1]|',
      'blah-foo[1]|',
    );
  });

  it('should handle blocks', () => {
    run(
      `if (a && b|) {
        console.log('true');
      }`,
      `if (
        a &&
        b|
      ) {
        console.log('true');
      }`,
    );
  });

  it('should not move when long identifiers stay still (1)', () => {
    run(
      `
      var ReallyReallyLongIdentifier = require('ReallyReallyLongIdentifier');
      somethingThatUses(ReallyReallyLongIdentifier|
      `,
      `
      var ReallyReallyLongIdentifier = require('ReallyReallyLongIdentifier');
      somethingThatUses(ReallyReallyLongIdentifier|
      `,
    );
  });

  it('should not move when long identifiers stay still (2)', () => {
    run(
      `
      somethingThatUses(ReallyReallyLongIdentifier|
      var ReallyReallyLongIdentifier = require('ReallyReallyLongIdentifier');
      `,
      `
      somethingThatUses(ReallyReallyLongIdentifier|
      var ReallyReallyLongIdentifier = require('ReallyReallyLongIdentifier');
      `,
    );
  });

  it('should move when long identifiers change places (1)', () => {
    run(
      `
      var ReallyReallyLongIdentifier = require('ReallyReallyLongIdentifier');
      somethingThatUses(ReallyReallyLongIdentifier|
      `,
      `
      somethingThatUses(ReallyReallyLongIdentifier|
      var ReallyReallyLongIdentifier = require('ReallyReallyLongIdentifier');
      `,
    );
  });

  it('should move when long identifiers change places (2)', () => {
    run(
      `
      somethingThatUses(ReallyReallyLongIdentifier|
      var ReallyReallyLongIdentifier = require('ReallyReallyLongIdentifier');
      `,
      `
      var ReallyReallyLongIdentifier = require('ReallyReallyLongIdentifier');
      somethingThatUses(ReallyReallyLongIdentifier|
      `,
    );
  });
});

/**
 * Helper function that will look for a "|" character and treat it as the
 * cursor. This will make tests way more readable.
 */
function run(input, output) {
  invariant(
    input.indexOf('|') >= 0 &&
    input.indexOf('|') === input.lastIndexOf('|') &&
    output.indexOf('|') >= 0 &&
    output.indexOf('|') === output.lastIndexOf('|'),
    'Invalid test cases. Both input and output must have exactly one | in ' +
    'each test case.',
  );

  const startSource = input.replace('|', '');
  const startPosition = getPosition(startSource, input.indexOf('|'));
  const endSource = output.replace('|', '');
  const endPosition = getPosition(endSource, output.indexOf('|'));

  const actual = updateCursors([startPosition], startSource, endSource);
  const expected = endPosition;

  expect(actual[0]).toEqual(expected);
}
