/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LevelData} from './interfaces';
import {allBlocks} from './blocks/blockRegistry';

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/

// Standard Toolbox mit allen Blöcken (für Fallback)
export const defaultToolbox = {
  kind: 'flyoutToolbox',
  contents: allBlocks,
};

/**
 * Erstellt eine dynamische Toolbox basierend auf der Level-Konfiguration
 * @param levelConfig Die Level-Konfiguration mit verfügbaren Blöcken
 * @returns Eine Toolbox mit nur den erlaubten Blöcken
 */
export function createDynamicToolbox(levelConfig: LevelData | null) {
  if (!levelConfig || !levelConfig.blocks) {
    return defaultToolbox;
  }

  const allowedBlocks = levelConfig.blocks;
  const filteredContents = allBlocks.filter(
    block => allowedBlocks.includes(block.type)
  );

  return {
    kind: 'flyoutToolbox',
    contents: filteredContents,
  };
}
