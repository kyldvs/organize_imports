/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

const {CompositeDisposable} = require('atom');

let subscriptions = null;

exports.activate = function activate(state) {
  if (subscriptions) {
    return;
  }

  const localSubscriptions = new CompositeDisposable();
  localSubscriptions.add(atom.commands.add(
    'atom-text-editor',
    'organize-imports:run',
    // Atom prevents in-command modification to text editor content.
    () => process.nextTick(() => run())
  ));

  subscriptions = localSubscriptions;
}

exports.deactivate = function deactivate() {
  if (subscriptions) {
    subscriptions.dispose();
    subscriptions = null;
  }
}

function run() {
  let editor = atom.workspace.getActiveTextEditor();

  // Make sure an editor is active.
  if (!editor) {
    console.info('organize-imports: No active text editor');
    return;
  }

  // Require the module we need.
  const organizeImports = require('organize-imports');

  // Save things
  const buffer = editor.getBuffer();
  const oldSource = buffer.getText();
  const newSource = organizeImports(oldSource);

  // Update the source and position after all transforms are done. Do nothing
  // if the source did not change at all.
  if (oldSource === newSource) {
    return;
  }

  const range = buffer.getRange();
  editor.setTextInBufferRange(range, newSource);

  // TODO: Update cursor:
  // const position = editor.getCursorBufferPosition();
  // const {row, column} = updateCursor(oldSource, position, source);
  // editor.setCursorBufferPosition([row, column]);

  // TODO: Save the file if that option is specified.
  editor.save();
}
