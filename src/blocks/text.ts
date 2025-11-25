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

const start= {
  type: 'start',
  message0: 'Start',
  nextStatement: null,
  colour: 100,
  tooltip: 'Startet die Ausführung des Programms',
  helpUrl: '',
  hat: 'cap',
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

const repeatLoop = {
  type: 'repeat_loop',
  message0: 'Wiederhole %1 mal',
  args0: [
    {
      type: 'field_number',
      name: 'TIMES',
      value: 1,
      min: 1,
    },
  ],
  message1: '%1',
  args1: [
    {
      type: 'input_statement',
      name: 'DO',
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 270,
  tooltip: 'Wiederhole einen Block mehrmals',
  helpUrl: '',
};

const repeatUntilGoal = {
  type: 'repeat_until_goal',
  message0: 'Wiederhole bis Ziel erreicht',
  message1: '%1',
  args1: [
    {
      type: 'input_statement',
      name: 'DO',
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 270,
  tooltip: 'Wiederhole Blöcke bis das Ziel erreicht wurde',
  helpUrl: '',
};

const ifElse = {
  type: 'if_else',
  message0: 'wenn %1',
  args0: [
    {
      type: 'input_value',
      name: 'CONDITION',
      check: 'Boolean',
    },
  ],
  message1: 'dann %1',
  args1: [
    {
      type: 'input_statement',
      name: 'THEN',
    },
  ],
  message2: 'sonst %1',
  args2: [
    {
      type: 'input_statement',
      name: 'ELSE',
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 210,
  tooltip: 'Führe Code aus, wenn eine Bedingung erfüllt ist, sonst führe anderen Code aus',
  helpUrl: '',
};

const isObstacleInWay = {
  type: 'is_obstacle_in_way',
  message0: 'Hindernis im Weg',
  output: 'Boolean',
  colour: 180,
  tooltip: 'Prüft, ob das Auto auf einem Hindernis steht',
  helpUrl: '',
};

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  addText,
  start,
  moveUp,
  moveRight,
  moveLeft,
  moveDown,
  repeatLoop,
  repeatUntilGoal,
  ifElse,
  isObstacleInWay
]);
