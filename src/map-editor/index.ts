import { MapEditor } from './MapEditor';
import { MapEditorUI } from './MapEditorUI';
import { LevelData } from './types';

export class MapEditorApp {
  private mapEditor: MapEditor;
  private mapEditorUI: MapEditorUI;
  private container: HTMLElement;

  constructor(container: HTMLElement, initialLevel?: LevelData) {
    this.container = container;
    
    // MapEditor erstellen
    this.mapEditor = new MapEditor(container, initialLevel);
    
    // UI erstellen
    this.mapEditorUI = new MapEditorUI(container, this.mapEditor);
  }

  public getMapEditor(): MapEditor {
    return this.mapEditor;
  }

  public getMapEditorUI(): MapEditorUI {
    return this.mapEditorUI;
  }

  public loadLevel(level: LevelData): void {
    this.mapEditor.loadLevel(level);
  }

  public getCurrentLevel(): LevelData {
    return this.mapEditor.getCurrentLevel();
  }

  public exportLevel(): string {
    return this.mapEditor.exportLevel();
  }
}
