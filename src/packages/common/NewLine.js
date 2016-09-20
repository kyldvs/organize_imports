/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

const NewLine = {
  node() {
    return {
      type: 'ExpressionStatement',
      expression: {
        type: 'Identifier',
        name: '$$NEWLINE$$',
      },
    };
  },

  string() {
    return ' $$NEWLINE$$; ';
  },
};

export default NewLine;
