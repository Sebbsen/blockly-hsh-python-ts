/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Order} from 'blockly/javascript';
import * as Blockly from 'blockly/core';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

forBlock['add_text'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
  const addText = generator.provideFunction_(
    'addText',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text) {

  // Add text to the output area.
  const outputDiv = document.getElementById('output');
  const textEl = document.createElement('p');
  textEl.innerText = text;
  outputDiv.appendChild(textEl);
}`,
  );
  // Generate the function call for this block.
  const code = `${addText}(${text});\n`;
  return code;
};

forBlock['start'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const nextBlock = block.getNextBlock();
  if (nextBlock) {
    return generator.blockToCode(nextBlock);
  }
  return '';
};

forBlock['move_up'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return "maze.animationScheduler('moveUp');\n";
};

forBlock['move_right'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return "maze.animationScheduler('moveRight');\n";
};

forBlock['move_left'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return "maze.animationScheduler('moveLeft');\n";
};

forBlock['move_down'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return "maze.animationScheduler('moveDown');\n";
};

