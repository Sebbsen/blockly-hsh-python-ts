/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

declare global {
  interface Window {
    maze: Maze;
  }
}

import * as Blockly from 'blockly';
import {blocks} from './blocks/text';
import {forBlock} from './generators/javascript';
import {javascriptGenerator} from 'blockly/javascript';
import {pythonGenerator} from 'blockly/python';
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import './index.css';

import { Maze } from './maze';
import {forBlock as pythonForBlock} from './generators/python';


// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);
Object.assign(pythonGenerator.forBlock, pythonForBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode')?.firstChild;
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');

if (!blocklyDiv) {
  throw new Error(`div with id 'blocklyDiv' not found`);
}
const ws = Blockly.inject(blocklyDiv, {toolbox});

const drawMaze = () => {
  // init Maze
  const canvasContainer = document.getElementById('output');
  if (!canvasContainer) {
    throw new Error('Element with id "output" not found');
  }
  const startPosition = {x:2, y:3}
  const targetPosition = {x:7, y:0}
  
  window.maze = new Maze(canvasContainer, startPosition, targetPosition);
  window.maze.draw(); // init draw
}

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  const pyCode = pythonGenerator.workspaceToCode(ws as Blockly.Workspace);
  const jsCode = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
  
  if (codeDiv) codeDiv.textContent = pyCode;

  if (outputDiv) drawMaze(); // Maze wird in canvas gezeichnet

  eval(jsCode);
};

const runCodeBtn = document.getElementById('runCodeBtn')
runCodeBtn?.addEventListener('click', ()=> {
  runCode();
});

if (ws) {
  drawMaze();
  // Load the initial state from storage and run the code.
  load(ws);

  // Every time the workspace changes state, save the changes to storage.
  ws.addChangeListener((e: Blockly.Events.Abstract) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (e.isUiEvent) return;
    save(ws);
  });

  // Whenever the workspace changes meaningfully, run the code again.
  ws.addChangeListener((e: Blockly.Events.Abstract) => {
    // Don't run the code when the workspace finishes loading; we're
    // already running it once when the application starts.
    // Don't run the code during drags; we might have invalid state.
    if (
      e.isUiEvent ||
      e.type == Blockly.Events.FINISHED_LOADING ||
      ws.isDragging()
    ) {
      return;
    }
  });
}


