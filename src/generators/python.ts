import {Order} from 'blockly/javascript';
import * as Blockly from 'blockly/core';

export const forBlock = Object.create(null);

forBlock['start'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {

  return '';
};

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

forBlock['repeat_loop'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const times = block.getFieldValue('TIMES') || '1';
  const statements = generator.statementToCode(block, 'DO');
  
  return `for i in range(${times}):\n${statements}`;
};

forBlock['if_else'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'False';
  const thenStatements = generator.statementToCode(block, 'THEN');
  const elseStatements = generator.statementToCode(block, 'ELSE');
  
  if (elseStatements) {
    return `if ${condition}:\n${thenStatements}else:\n${elseStatements}`;
  } else {
    return `if ${condition}:\n${thenStatements}`;
  }
};
