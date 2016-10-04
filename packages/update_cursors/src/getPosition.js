/*
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @flow
 */

'use strict';

/**
 * Figures out the row and column coordinates of a raw position within a source
 * string. This will undo the transform `getRawPosition` makes to position.
 */
export default function getPosition(
  source: string,
  rawPosition: number,
): {row: number, column: number} {
  let row = 0;
  let column = 0;
  for (let i = 0; i < rawPosition && i < source.length; i++) {
    const char = source.charAt(i);
    if (char === '\n') {
      row++;
      column = 0;
    } else {
      column++;
    }
  }
  return {row, column};
}
