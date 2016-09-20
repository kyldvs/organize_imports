/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import RequireGroups from '../common/RequireGroups';

import getRequireIDs from '../common/getRequireIDs';
import isRequire from '../common/isRequire';
import match from '../common/match';
import reprintRequireGroups from '../common/reprintRequireGroups';

export default function format(options) {
  return function babel_plugin({types: t}) {
    return {
      visitor: {
        Program(path) {

          let pre = [];
          let requires = [];
          let post = [];

          // Partition all the body nodes, into pre-require-block,
          // require-block, and post-require-block.
          path.node.body.forEach(node => {
            if (isRequire(node)) {
              requires.push(node);
            } else {
              if (requires.length > 0) {
                post.push(node);
              } else {
                pre.push(node);
              }
            }
          });

          if (post.length === 0) {
            post = pre;
            pre = [];
          }

          // Transform require nodes as appropriate.
          requires.forEach(node => {
            // TODO: Sort specifiers and destructures.
          });

          // Sort all the requires, this will prevent us needing to re-order
          // the groups later.
          requires.sort((n1, n2) => {
            const ids1 = getRequireIDs(n1);
            const ids2 = getRequireIDs(n2);

            // This should never happen.
            if (ids1.length === 0 || ids2.length === 0) {
              return 0;
            }

            for (let i = 0; i < ids1.length && i < ids2.length; i++) {
              if (ids1[i] < ids2[i]) {
                return -1;
              } else if (ids1[i] > ids2[i]) {
                return 1;
              }
            }

            // Since they are all equal to this point we can compare based on
            // the number of ids.
            if (ids1.length < ids2.length) {
              return -1;
            } else if (ids1.length > ids2.length) {
              return 1;
            } else {
              return 0;
            }
          });

          // Create an empty array for each group.
          const groups = RequireGroups.map(() => []);
          const unknowns = [];

          // For each require add it to the correct group.
          requires.forEach(node => {
            for (let i = 0; i < RequireGroups.length; i++) {
              if (RequireGroups[i].some(pattern => match(node, pattern))) {
                groups[i].push(node);
                return;
              }
            }

            // If we make it to here that's bad, but let's not drop the node.
            unknowns.push(node);
          });

          const newRequires = reprintRequireGroups(groups);

          // Sort each group.
          path.node.body = [... pre, ...newRequires, ...post];
        },
      },
    };
  };
}
