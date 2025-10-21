/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

// Create a custom block called 'add_text' that adds
// text to the output div on the sample app.
// This is just an example and you should replace this with your
// own custom blocks.
const addText = {
  type: 'add_text',
  message0: 'Add text %1',
  args0: [
    {
      type: 'input_value',
      name: 'TEXT',
      check: 'String',
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 160,
  tooltip: '',
  helpUrl: '',
};

const moveUp= {
  type: 'move_up',
  message0: 'move up',
  previousStatement: null,
  nextStatement: null,
  colour: 200,
  tooltip: 'Bewege das Auto ein Feld nach oben',
  helpUrl: '',
};

const moveRight = {
  type: 'move_right',
  message0: 'move right',
  previousStatement: null,
  nextStatement: null,
  colour: 200,
  tooltip: 'Bewege das Auto ein Feld nach rechts',
  helpUrl: '',
};

const moveLeft = {
  type: 'move_left',
  message0: 'move left',
  previousStatement: null,
  nextStatement: null,
  colour: 200,
  tooltip: 'Bewege das Auto ein Feld nach links',
  helpUrl: '',
};

const moveDown = {
  type: 'move_down',
  message0: 'move down',
  previousStatement: null,
  nextStatement: null,
  colour: 200,
  tooltip: 'Bewege das Auto ein Feld nach unten',
  helpUrl: '',
};

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  addText,
  moveUp,
  moveRight,
  moveLeft,
  moveDown
]);
