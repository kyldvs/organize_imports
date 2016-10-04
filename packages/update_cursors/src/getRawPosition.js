/*
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @flow
 */

'use strict';

/**
 * Converts a position given as {row, column} to a single number which is the
 * index the cursor appears in the source string.
 *
 * index is given such that source.slice(0, index) is the precise  string that
 * occurs before the cursor, and source.slice(index) is the string that occurs
 * after the cursor.
 */
export default function getRawPosition(
  source: string,
  position: {row: number, column: number},
): number {
  return source.split('\n').reduce(
    (curr, line, i) => {
      if (i < position.row) {
        return curr + line.length + 1;
      } else if (i === position.row) {
        return curr + position.column;
      } else {
        return curr;
      }
    },
    0,
  );
}
