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
import {save} from './serialization';
import {createDynamicToolbox} from './toolbox';
import {Maze} from './maze';
import {forBlock as pythonForBlock} from './generators/python';
import {LevelData} from './interfaces';
import {MapEditorApp} from './map-editor';
import manifestData from './level/manifest.json';
import './index.css';

interface LevelManifestEntry {
  slug: string;
  title: string;
  file: string;
  source?: string;
}

const levelManifest = manifestData as LevelManifestEntry[];

Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);
Object.assign(pythonGenerator.forBlock, pythonForBlock);

const getAppElement = (): HTMLElement => {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error(`div with id 'app' not found`);
  }
  return app;
};

const normalizeRoute = (pathname: string): string => {
  return pathname.replace(/^\/+|\/+$/g, '');
};

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const loadLevel = async (fileName: string): Promise<LevelData> => {
  const response = await fetch(encodeURI(`/level/${fileName}`));
  if (!response.ok) {
    throw new Error(`Failed to load level configuration (${response.status})`);
  }
  return response.json();
};

const renderOverview = (app: HTMLElement): void => {
  document.title = 'Level Overview';
  app.className = 'overview-page';
  app.innerHTML = `
    <main class="overview-shell">
      <header class="overview-header">
        <div>
          <h1>Level Overview</h1>
          <p>Wähle ein Level oder öffne den Level Editor.</p>
        </div>
        <a class="editor-link" href="/editor">Level Editor</a>
      </header>
      <section class="level-list" aria-label="Level">
        ${levelManifest.map((level) => `
          <a class="level-card" href="/${escapeHtml(level.slug)}">
            <span class="level-title">${escapeHtml(level.title)}</span>
            <span class="level-path">/${escapeHtml(level.slug)}</span>
          </a>
        `).join('')}
      </section>
    </main>
  `;
};

const renderEditor = (app: HTMLElement): void => {
  document.title = 'Level Editor';
  app.className = 'editor-page';
  app.innerHTML = `
    <main class="editor-shell">
      <header class="editor-header">
        <div>
          <h1>Level Editor</h1>
          <p>Exportierte JSON-Dateien in <code>src/level/</code> ablegen und im Manifest eintragen.</p>
        </div>
        <a class="overview-link" href="/overview">Overview</a>
      </header>
      <div id="map-editor-container"></div>
    </main>
  `;

  const container = document.getElementById('map-editor-container');
  if (!container) {
    throw new Error(`div with id 'map-editor-container' not found`);
  }
  new MapEditorApp(container);
};

const createLevelMarkup = (): string => {
  return `
    <div id="pageContainer">
      <div id="outputPane">
        <div id="endOutput">
          <div class="message success-message hidden"></div>
          <div class="message warning-message hidden"></div>
          <div class="message fail-message hidden"></div>
        </div>
        <button id="runCodeBtn">Programm ausführen</button>
        <pre id="generatedCode"><code></code></pre>
        <div id="output"></div>
      </div>
      <div id="blocklyDiv"></div>
    </div>
  `;
};

const cloneLevel = (levelConfig: LevelData): LevelData => {
  return JSON.parse(JSON.stringify(levelConfig)) as LevelData;
};

const renderStartBlock = (ws: Blockly.WorkspaceSvg): void => {
  const existingStartBlock = ws.getTopBlocks().find(block => block.type === 'start');
  if (!existingStartBlock) {
    const startBlock = ws.newBlock('start');
    startBlock.initSvg();
    startBlock.render();
    startBlock.moveBy(50, 50);
  }
};

const renderFixedBlocks = (ws: Blockly.WorkspaceSvg, levelConfig: LevelData): void => {
  levelConfig.fixedBlocks.forEach((block, index) => {
    const newBlock = ws.newBlock(block);
    newBlock.initSvg();
    newBlock.render();
    newBlock.setDeletable(false);
    newBlock.moveBy(150, 50 * (index + 1));
  });
};

const renderLevel = async (app: HTMLElement, levelEntry: LevelManifestEntry): Promise<void> => {
  document.title = levelEntry.title;
  app.className = 'level-page';
  app.innerHTML = createLevelMarkup();

  const blocklyDiv = document.getElementById('blocklyDiv');
  const codeDiv = document.getElementById('generatedCode')?.firstChild;
  const outputDiv = document.getElementById('output');
  const runCodeBtn = document.getElementById('runCodeBtn');

  if (!blocklyDiv) {
    throw new Error(`div with id 'blocklyDiv' not found`);
  }
  if (!outputDiv) {
    throw new Error(`div with id 'output' not found`);
  }

  const levelConfig = await loadLevel(levelEntry.file);

  const drawMaze = (): void => {
    if (window.maze) {
      window.maze.stopExecution();
    }

    window.maze = new Maze(outputDiv, cloneLevel(levelConfig));
    window.maze.draw();
  };

  const toolbox = createDynamicToolbox(levelConfig);
  const ws = Blockly.inject(blocklyDiv, {toolbox});

  drawMaze();
  renderStartBlock(ws);
  renderFixedBlocks(ws, levelConfig);

  const runCode = (): void => {
    const startBlock = ws.getTopBlocks().find(block => block.type === 'start');

    if (!startBlock) {
      if (codeDiv) {
        codeDiv.textContent = 'No start block found';
        (codeDiv as HTMLElement).style.color = 'red';
        (codeDiv as HTMLElement).style.fontWeight = 'bold';
      }
      return;
    }

    javascriptGenerator.init(ws);
    pythonGenerator.init(ws);

    const pyCode = pythonGenerator.blockToCode(startBlock);
    const jsCode = javascriptGenerator.blockToCode(startBlock);
    const pyCodeString = Array.isArray(pyCode) ? pyCode[0] : pyCode;
    const jsCodeString = Array.isArray(jsCode) ? jsCode[0] : jsCode;

    if (codeDiv) codeDiv.textContent = pyCodeString;

    drawMaze();

    const wrappedCode = `
      (async () => {
        try {
          ${jsCodeString}
          maze.finishExecution();
        } catch (error) {
          if (error.message === 'Execution aborted') {
            console.log('Execution was stopped');
          } else {
            throw error;
          }
        }
      })();
    `;
    eval(wrappedCode);
  };

  runCodeBtn?.addEventListener('click', () => {
    runCode();
  });

  ws.addChangeListener((e: Blockly.Events.Abstract) => {
    if (e.isUiEvent) return;
    save(ws);
  });
};

const renderNotFound = (app: HTMLElement, route: string): void => {
  document.title = 'Nicht gefunden';
  app.className = 'overview-page';
  app.innerHTML = `
    <main class="overview-shell">
      <header class="overview-header">
        <div>
          <h1>Seite nicht gefunden</h1>
          <p>Die Route <code>/${escapeHtml(route)}</code> ist keinem Level zugeordnet.</p>
        </div>
        <a class="editor-link" href="/overview">Overview</a>
      </header>
    </main>
  `;
};

const initializeApp = async (): Promise<void> => {
  const app = getAppElement();
  const route = normalizeRoute(window.location.pathname);

  if (route === '' || route === 'overview') {
    renderOverview(app);
    return;
  }

  if (route === 'editor') {
    renderEditor(app);
    return;
  }

  const levelEntry = levelManifest.find(level => level.slug === route);
  if (levelEntry) {
    await renderLevel(app, levelEntry);
    return;
  }

  renderNotFound(app, route);
};

initializeApp().catch((error) => {
  console.error(error);
  const app = getAppElement();
  app.className = 'overview-page';
  app.innerHTML = `
    <main class="overview-shell">
      <header class="overview-header">
        <div>
          <h1>Fehler beim Laden</h1>
          <p>${escapeHtml(error instanceof Error ? error.message : 'Unbekannter Fehler')}</p>
        </div>
        <a class="editor-link" href="/overview">Overview</a>
      </header>
    </main>
  `;
});
