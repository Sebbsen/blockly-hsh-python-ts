// Map Editor Integration für das bestehende Blockly-Projekt
// Diese Datei zeigt, wie der Map Editor in das bestehende Projekt integriert werden kann

import { MapEditorApp } from './index';
import { LevelData } from '../interfaces';

export class MapEditorIntegration {
  private mapEditorApp: MapEditorApp | null = null;
  private container: HTMLElement | null = null;

  constructor() {
    this.setupMapEditorButton();
  }

  private setupMapEditorButton(): void {
    // Button zum Öffnen des Map Editors hinzufügen
    const button = document.createElement('button');
    button.textContent = '🗺️ Map Editor öffnen';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      padding: 12px 20px;
      background: #3B82F6;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: background 0.2s;
    `;
    
    button.addEventListener('click', () => this.openMapEditor());
    button.addEventListener('mouseenter', () => {
      button.style.background = '#2563EB';
    });
    button.addEventListener('mouseleave', () => {
      button.style.background = '#3B82F6';
    });
    
    document.body.appendChild(button);
  }

  private openMapEditor(): void {
    if (this.mapEditorApp) {
      this.closeMapEditor();
      return;
    }

    // Modal/Overlay erstellen
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 2000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    `;

    // Map Editor Container erstellen
    this.container = document.createElement('div');
    this.container.style.cssText = `
      background: white;
      border-radius: 12px;
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
    `;

    // Schließen-Button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
      position: absolute;
      top: 15px;
      right: 15px;
      z-index: 2001;
      background: #EF4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeButton.addEventListener('click', () => this.closeMapEditor());

    overlay.appendChild(this.container);
    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);

    // Map Editor App erstellen
    this.mapEditorApp = new MapEditorApp(this.container);

    // Event Listener für Overlay-Klick (außerhalb des Containers)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeMapEditor();
      }
    });

    // ESC-Taste zum Schließen
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeMapEditor();
      }
    };
    document.addEventListener('keydown', handleEsc);
    
    // Cleanup-Funktion speichern
    (overlay as any).cleanup = () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }

  private closeMapEditor(): void {
    if (!this.mapEditorApp) return;

    const overlay = document.querySelector('div[style*="position: fixed"][style*="z-index: 2000"]') as HTMLElement;
    if (overlay) {
      // Cleanup-Funktion aufrufen
      if ((overlay as any).cleanup) {
        (overlay as any).cleanup();
      }
      document.body.removeChild(overlay);
    }

    this.mapEditorApp = null;
    this.container = null;
  }

  // Methode zum Laden eines Level aus dem bestehenden System
  public loadLevelFromMaze(mazeLevel: LevelData): void {
    if (this.mapEditorApp) {
      this.mapEditorApp.loadLevel(mazeLevel);
    }
  }

  // Methode zum Abrufen des aktuellen Level
  public getCurrentLevel(): LevelData | null {
    return this.mapEditorApp?.getCurrentLevel() || null;
  }

  // Methode zum Exportieren des Level
  public exportCurrentLevel(): string | null {
    return this.mapEditorApp?.exportLevel() || null;
  }
}

// Automatische Initialisierung wenn das DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
  new MapEditorIntegration();
});
