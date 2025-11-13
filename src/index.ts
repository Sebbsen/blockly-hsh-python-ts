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
import {defaultToolbox, createDynamicToolbox} from './toolbox';
import './index.css';

import { Maze } from './maze';
import {forBlock as pythonForBlock} from './generators/python';
import {LevelData} from './interfaces';

let levelConfig: LevelData | null = null;
let ws: Blockly.WorkspaceSvg;

const loadLevel = async (): Promise<LevelData> => {
  const response = await fetch('level/level.json');
  if (!response.ok) {
    throw new Error(`Failed to load level configuration (${response.status})`);
  }
  return response.json();
};

// Load level data
const initializeLevel = async () => {
  try {
    levelConfig = await loadLevel();
  } catch (error) {
    console.error('Failed to load level:', error);
    // You might want to show an error message to the user here
  }
};

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);
Object.assign(pythonGenerator.forBlock, pythonForBlock);

// Set up UI elements
const codeDiv = document.getElementById('generatedCode')?.firstChild;
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');

if (!blocklyDiv) {
  throw new Error(`div with id 'blocklyDiv' not found`);
}

const drawMaze = () => {
  // init Maze
  const canvasContainer = document.getElementById('output');
  if (!canvasContainer) {
    throw new Error('Element with id "output" not found');
  }

  if (!levelConfig) {
    console.error('Level configuration not loaded');
    return;
  }
  
  // Maze wird zurückgesetzt und neu gezeichent
  const freshLevelConfig = JSON.parse(JSON.stringify(levelConfig)); // Hack um tiefe Kopie vom Level zu erhalten
  window.maze = new Maze(canvasContainer, freshLevelConfig);
  window.maze.draw(); // init draw
}

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  // Finde den Start Block im Workspace
  const startBlock = ws.getTopBlocks().find(block => block.type === 'start');
  
  if (!startBlock) {
    if (codeDiv) {
      codeDiv.textContent = 'No start block found';
      (codeDiv as HTMLElement).style.color = 'red';
      (codeDiv as HTMLElement).style.fontWeight = 'bold';
    }
    return;
  }

  // Generiere Code nur vom Start Block und seinen angeschlossenen Blöcken
  // Generatoren müssen initialisiert werden bevor blockToCode aufgerufen wird
  javascriptGenerator.init(ws);
  pythonGenerator.init(ws);
  
  const pyCode = pythonGenerator.blockToCode(startBlock);
  const jsCode = javascriptGenerator.blockToCode(startBlock)

  // Handle the case where blockToCode returns an array
  const pyCodeString = Array.isArray(pyCode) ? pyCode[0] : pyCode;
  const jsCodeString = Array.isArray(jsCode) ? jsCode[0] : jsCode;
  
  if (codeDiv) codeDiv.textContent = pyCodeString;

  if (outputDiv) drawMaze(); // Maze wird in canvas gezeichnet

  eval(jsCodeString);
};

const runCodeBtn = document.getElementById('runCodeBtn')
runCodeBtn?.addEventListener('click', ()=> {
  runCode();
});

const renderStartBlock = (ws: Blockly.WorkspaceSvg) => {
  // Prüfe ob bereits ein Start Block vorhanden ist
  const existingStartBlock = ws.getTopBlocks().find(block => block.type === 'start');
  if (!existingStartBlock) {
    // Erstellt einen Start Block
    const startBlock = ws.newBlock('start');
    startBlock.initSvg();
    startBlock.render();
    startBlock.moveBy(50, 50);
    
  }
}

const renderFiexedBlocks = (ws: Blockly.WorkspaceSvg) => {
  if (!levelConfig) return;

  let blockArray = levelConfig.fixedBlocks;

  blockArray.forEach((block, index) => {
    // Erstellt einen Block
    const newBlock = ws.newBlock(block);
    newBlock.initSvg();
    newBlock.render();
    newBlock.setDeletable(false);
    newBlock.moveBy(150, 50 * (index+1));
  })
}

// Initialize the application
const initializeApp = async () => {
  // Load level data first
  await initializeLevel();
  
  // Erstelle dynamische Toolbox basierend auf Level-Konfiguration
  const toolbox = createDynamicToolbox(levelConfig);
  
  // Initialisiere Workspace mit dynamischer Toolbox
  ws = Blockly.inject(blocklyDiv, {toolbox}); // ws = workspace
  
  if (ws) {
    drawMaze();
    renderStartBlock(ws);
    renderFiexedBlocks(ws);
    
    // Load the initial state from storage and run the code.
    //load(ws);

    // Every time the workspace changes state, save the changes to storage.
    ws.addChangeListener((e: Blockly.Events.Abstract) => {
      // UI events are things like scrolling, zooming, etc.
      // No need to save after one of these.
      if (e.isUiEvent) return;
      save(ws);
    });
  }
};

// Start the application
initializeApp();
