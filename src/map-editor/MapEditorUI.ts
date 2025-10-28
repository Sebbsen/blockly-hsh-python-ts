import { MapEditor } from './MapEditor';
import { ObjectType, ObjectTemplate } from './types';

export class MapEditorUI {
  private mapEditor: MapEditor;
  private container: HTMLElement;
  private toolbar!: HTMLElement;
  private canvasContainer!: HTMLElement;
  private statusBar!: HTMLElement;

  constructor(container: HTMLElement, mapEditor: MapEditor) {
    this.container = container;
    this.mapEditor = mapEditor;
    this.createUI();
  }

  private createUI(): void {
    this.container.innerHTML = '';
    this.container.className = 'map-editor-container';
    
    // CSS Styles hinzufügen
    this.addStyles();
    
    // Toolbar erstellen
    this.createToolbar();
    
    // Canvas Container erstellen
    this.createCanvasContainer();
    
    // Status Bar erstellen
    this.createStatusBar();
    
    // Event Listeners einrichten
    this.setupEventListeners();
  }

  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .map-editor-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
        background: #F3F4F6;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .map-editor-toolbar {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 12px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .toolbar-section {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      
      .toolbar-section:not(:last-child) {
        border-right: 1px solid #E5E7EB;
        padding-right: 12px;
      }
      
      .object-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
        border: 2px solid transparent;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
        min-width: 60px;
      }
      
      .object-button:hover {
        background: #F9FAFB;
        border-color: #D1D5DB;
      }
      
      .object-button.active {
        border-color: #3B82F6;
        background: #EFF6FF;
      }
      
      .object-emoji {
        font-size: 24px;
        line-height: 1;
      }
      
      .object-label {
        font-size: 12px;
        font-weight: 500;
        color: #374151;
      }
      
      .action-button {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        background: #3B82F6;
        color: white;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .action-button:hover {
        background: #2563EB;
      }
      
      .action-button.secondary {
        background: #6B7280;
      }
      
      .action-button.secondary:hover {
        background: #4B5563;
      }
      
      .action-button.danger {
        background: #EF4444;
      }
      
      .action-button.danger:hover {
        background: #DC2626;
      }
      
      .canvas-container {
        display: flex;
        justify-content: center;
        padding: 16px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .status-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        background: white;
        border-radius: 6px;
        font-size: 14px;
        color: #6B7280;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .status-info {
        display: flex;
        gap: 16px;
      }
      
      .file-input {
        display: none;
      }
      
      .file-label {
        padding: 8px 16px;
        border: 2px dashed #D1D5DB;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 14px;
        color: #6B7280;
      }
      
      .file-label:hover {
        border-color: #3B82F6;
        color: #3B82F6;
      }
    `;
    document.head.appendChild(style);
  }

  private createToolbar(): void {
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'map-editor-toolbar';
    
    // Objekt-Auswahl
    const objectSection = document.createElement('div');
    objectSection.className = 'toolbar-section';
    
    const objectLabel = document.createElement('span');
    objectLabel.textContent = 'Objekt auswählen:';
    objectLabel.style.fontWeight = '500';
    objectLabel.style.color = '#374151';
    objectSection.appendChild(objectLabel);
    
    const templates = this.mapEditor.getObjectTemplates();
    templates.forEach(template => {
      const button = this.createObjectButton(template);
      objectSection.appendChild(button);
    });
    
    // Aktions-Buttons
    const actionSection = document.createElement('div');
    actionSection.className = 'toolbar-section';
    
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Level leeren';
    clearButton.className = 'action-button danger';
    clearButton.addEventListener('click', () => this.clearLevel());
    
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Exportieren';
    exportButton.className = 'action-button';
    exportButton.addEventListener('click', () => this.exportLevel());
    
    const importButton = document.createElement('label');
    importButton.textContent = 'Importieren';
    importButton.className = 'action-button secondary';
    importButton.style.cursor = 'pointer';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.className = 'file-input';
    fileInput.addEventListener('change', (e) => this.handleFileImport(e));
    
    actionSection.appendChild(clearButton);
    actionSection.appendChild(exportButton);
    actionSection.appendChild(importButton);
    actionSection.appendChild(fileInput);
    
    this.toolbar.appendChild(objectSection);
    this.toolbar.appendChild(actionSection);
    this.container.appendChild(this.toolbar);
  }

  private createObjectButton(template: ObjectTemplate): HTMLElement {
    const button = document.createElement('div');
    button.className = 'object-button';
    button.dataset.type = template.type;
    
    const emoji = document.createElement('div');
    emoji.className = 'object-emoji';
    emoji.textContent = template.emoji;
    
    const label = document.createElement('div');
    label.className = 'object-label';
    label.textContent = template.label;
    
    button.appendChild(emoji);
    button.appendChild(label);
    
    button.addEventListener('click', () => {
      this.selectObjectType(template.type);
    });
    
    return button;
  }

  private createCanvasContainer(): void {
    this.canvasContainer = document.createElement('div');
    this.canvasContainer.className = 'canvas-container';
    this.container.appendChild(this.canvasContainer);
    
    // Canvas wird vom MapEditor erstellt
    const canvasElement = this.mapEditor['canvas'];
    this.canvasContainer.appendChild(canvasElement);
  }

  private createStatusBar(): void {
    this.statusBar = document.createElement('div');
    this.statusBar.className = 'status-bar';
    
    const statusInfo = document.createElement('div');
    statusInfo.className = 'status-info';
    
    const selectedInfo = document.createElement('span');
    selectedInfo.id = 'selected-object-info';
    selectedInfo.textContent = 'Kein Objekt ausgewählt';
    
    const gridInfo = document.createElement('span');
    gridInfo.textContent = '8x8 Grid';
    
    statusInfo.appendChild(selectedInfo);
    statusInfo.appendChild(gridInfo);
    
    const instructions = document.createElement('span');
    instructions.textContent = 'Klicke auf ein Objekt und dann auf das Grid, um es zu platzieren';
    
    this.statusBar.appendChild(statusInfo);
    this.statusBar.appendChild(instructions);
    this.container.appendChild(this.statusBar);
  }

  private setupEventListeners(): void {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.selectObjectType(null);
      }
    });
  }

  private selectObjectType(type: ObjectType | null): void {
    // Alle Buttons deaktivieren
    const buttons = this.toolbar.querySelectorAll('.object-button');
    buttons.forEach(button => button.classList.remove('active'));
    
    // Gewählten Button aktivieren
    if (type) {
      const button = this.toolbar.querySelector(`[data-type="${type}"]`);
      if (button) button.classList.add('active');
    }
    
    // MapEditor aktualisieren
    this.mapEditor.selectObjectType(type);
    
    // Status aktualisieren
    this.updateStatus(type);
  }

  private updateStatus(selectedType: ObjectType | null): void {
    const statusElement = document.getElementById('selected-object-info');
    if (statusElement) {
      if (selectedType) {
        const template = this.mapEditor.getObjectTemplates().find(t => t.type === selectedType);
        statusElement.textContent = `Ausgewählt: ${template?.label || selectedType}`;
      } else {
        statusElement.textContent = 'Kein Objekt ausgewählt';
      }
    }
  }

  private clearLevel(): void {
    if (confirm('Möchtest du das Level wirklich leeren? Alle Objekte werden entfernt.')) {
      this.mapEditor.clearLevel();
    }
  }

  private exportLevel(): void {
    const levelData = this.mapEditor.exportLevel();
    const blob = new Blob([levelData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'level.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private handleFileImport(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const levelData = JSON.parse(e.target?.result as string);
          this.mapEditor.loadLevel(levelData);
        } catch (error) {
          alert('Fehler beim Laden der Datei. Bitte überprüfe das Format.');
        }
      };
      reader.readAsText(file);
    }
  }
}
