/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import fs from 'fs';
import path from 'path';

export default function forEachFile(dir, fn) {
  getFiles(dir, dir).forEach(x => fn(x));
}

function getFiles(firstFilePath, originalFilePath) {
  let arr = [];
  const filePaths = fs.readdirSync(originalFilePath);
  filePaths.forEach(fileName => {
    const filePath = path.join(originalFilePath, fileName);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      arr = [].concat(arr, getFiles(firstFilePath, filePath));
    } else if (stats.isFile()) {
      arr.push({
        name: fileName,
        relativeName: path.relative(firstFilePath, filePath),
        contents: fs.readFileSync(filePath, 'utf8'),
      });
    }
  });
  return arr;
}
