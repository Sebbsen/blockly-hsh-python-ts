import {Order} from 'blockly/javascript';
import * as Blockly from 'blockly/core';

export const forBlock = Object.create(null);

forBlock['move_up'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return "move_up()\n";
};

forBlock['move_right'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return "move_right()\n";
};

forBlock['move_left'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return "move_left()\n";
};

forBlock['move_down'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return "move_down()\n";
};
