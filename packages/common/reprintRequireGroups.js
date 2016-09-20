/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import * as babel from 'babel-core';
import generate from 'babel-generator';
import getBabelConfig from './getBabelConfig';
import NewLine from './NewLine';

export default function reprintRequireGroups(groups) {
  const lines = [];
  groups.forEach(group => {
    if (group.length > 0) {
      group.forEach(node => {
        lines.push(
          generate(node, {
            retainLines: false,
            quotes: 'single',
            compact: true,
            concise: false,
          }).code.trim()
        );
        lines.push(NewLine.string());
      });
      lines.push(NewLine.string());
    }
  });
  const file = babel.transform(lines.join(''), getBabelConfig()).ast;
  return file.program.body;
};
