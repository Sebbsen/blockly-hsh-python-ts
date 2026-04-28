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

declare const LEVEL_BUILD_TARGET: 'production' | 'development';
declare const LEVEL_MANIFEST: LevelManifestEntry[];

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
import './index.css';

interface LevelManifestEntry {
  slug: string;
  title: string;
  file: string;
  group: 'live' | 'test';
}

const levelManifest: LevelManifestEntry[] = LEVEL_MANIFEST;

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
  const route = pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');
  return route === 'index' ? '' : route;
};

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const getPageHref = (route: string): string => {
  return `${route}.html`;
};

const loadLevel = async (levelEntry: LevelManifestEntry): Promise<LevelData> => {
  const response = await fetch(encodeURI(levelEntry.file));
  if (!response.ok) {
    throw new Error(`Failed to load level configuration (${response.status})`);
  }
  return response.json();
};

const renderOverview = (app: HTMLElement): void => {
  const liveLevels = levelManifest.filter(level => level.group === 'live');
  const testLevels = levelManifest.filter(level => level.group === 'test');
  const renderLevelList = (levels: LevelManifestEntry[]): string => levels.map((level) => `
    <a class="level-card level-card-${escapeHtml(level.group)}" href="${escapeHtml(getPageHref(level.slug))}">
      <span class="level-card-header">
        <span class="level-title">${escapeHtml(level.title)}</span>
        <span class="level-badge">${level.group === 'live' ? 'Live' : 'Test'}</span>
      </span>
      <span class="level-path">${escapeHtml(getPageHref(level.slug))}</span>
    </a>
  `).join('');

  document.title = 'Level Overview';
  app.className = 'overview-page';
  app.innerHTML = `
    <main class="overview-shell">
      <header class="overview-header">
        <div>
          <h1>Level Overview</h1>
          <p>Wähle ein Level oder öffne den Level Editor. Live-Level werden im Production-Build veröffentlicht.</p>
        </div>
        ${LEVEL_BUILD_TARGET === 'development' ? '<a class="editor-link" href="editor.html">Level Editor</a>' : ''}
      </header>
      <section class="overview-level-section" aria-label="Live-Level">
        <div class="level-section-header">
          <h2>Live-Level</h2>
          <span>${liveLevels.length} Level</span>
        </div>
        <div class="level-list">
          ${renderLevelList(liveLevels)}
        </div>
      </section>
      ${testLevels.length > 0 ? `
        <section class="overview-level-section" aria-label="Test-Level">
          <div class="level-section-header">
            <h2>Test-Level</h2>
            <span>${testLevels.length} Level</span>
          </div>
          <div class="level-list">
            ${renderLevelList(testLevels)}
          </div>
        </section>
      ` : ''}
    </main>
  `;
};

const renderEditor = async (app: HTMLElement): Promise<void> => {
  if (LEVEL_BUILD_TARGET === 'production') {
    renderNotFound(app, 'editor');
    return;
  }

  document.title = 'Level Editor';
  app.className = 'editor-page';
  app.innerHTML = `
    <main class="editor-shell">
      <header class="editor-header">
        <div>
          <h1>Level Editor</h1>
          <p>Live-Level in <code>src/level/live/</code>, Test-Level in <code>src/level/test/</code> ablegen. Die Overview wird beim Starten automatisch erzeugt.</p>
        </div>
        <a class="overview-link" href="overview.html">Overview</a>
      </header>
      <div id="map-editor-container"></div>
    </main>
  `;

  const container = document.getElementById('map-editor-container');
  if (!container) {
    throw new Error(`div with id 'map-editor-container' not found`);
  }
  const {MapEditorApp} = await import('./map-editor');
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

  const levelConfig = await loadLevel(levelEntry);

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
        <a class="editor-link" href="overview.html">Overview</a>
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
    await renderEditor(app);
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
        <a class="editor-link" href="overview.html">Overview</a>
      </header>
    </main>
  `;
});
