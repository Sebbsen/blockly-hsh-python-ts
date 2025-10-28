import { MapEditor } from './MapEditor';
import { ObjectType, ObjectTemplate } from './types';
import { allBlocks } from '../blocks/blockRegistry';

export class MapEditorUI {
  private mapEditor: MapEditor;
  private container: HTMLElement;
  private toolbar!: HTMLElement;
  private canvasContainer!: HTMLElement;
  private statusBar!: HTMLElement;
  private jsonTextarea!: HTMLTextAreaElement;
  private jsonErrorElement!: HTMLElement;
  private isUpdatingFromEditor: boolean = false;

  constructor(container: HTMLElement, mapEditor: MapEditor) {
    this.container = container;
    this.mapEditor = mapEditor;
    this.createUI();
    
    // Callback für automatische JSON-Updates setzen
    this.mapEditor.setOnChangeCallback(() => {
      this.updateJSONFromEditor();
    });
  }

  private createUI(): void {
    this.container.innerHTML = '';
    this.container.className = 'map-editor-container';
    
    // CSS Styles hinzufügen
    this.addStyles();
    
    // Haupt-Layout erstellen (zwei Spalten)
    this.createMainLayout();
    
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
        height: 100vh;
        box-sizing: border-box;
      }
      
      .main-layout {
        display: flex;
        gap: 16px;
        flex: 1;
        min-height: 0;
      }
      
      .left-panel {
        display: flex;
        flex-direction: column;
        gap: 16px;
        flex: 1;
        min-width: 0;
      }
      
      .right-panel {
        display: flex;
        flex-direction: column;
        width: 400px;
        min-width: 400px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
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
      
      .blocks-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .blocks-title {
        font-weight: 500;
        color: #374151;
        margin-bottom: 8px;
      }
      
      .blocks-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .block-button {
        padding: 6px 12px;
        border: 1px solid #D1D5DB;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 14px;
        color: #374151;
      }
      
      .block-button:hover {
        background: #F9FAFB;
        border-color: #3B82F6;
        color: #3B82F6;
      }
      
      .block-button.added {
        background: #EFF6FF;
        border-color: #3B82F6;
        color: #3B82F6;
      }
      
      .current-blocks {
        margin-top: 8px;
        padding: 8px;
        background: #F9FAFB;
        border-radius: 4px;
        font-size: 12px;
        color: #6B7280;
      }
      
      .json-view-header {
        padding: 12px 16px;
        background: #F9FAFB;
        border-bottom: 1px solid #E5E7EB;
        font-weight: 500;
        color: #374151;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .json-view-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }
      
      .json-textarea {
        flex: 1;
        border: none;
        padding: 16px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 13px;
        line-height: 1.5;
        resize: none;
        outline: none;
        background: #FAFAFA;
        color: #374151;
        min-height: 300px;
      }
      
      .json-textarea:focus {
        background: white;
        box-shadow: inset 0 0 0 2px #3B82F6;
      }
      
      .json-error {
        background: #FEF2F2;
        color: #DC2626;
        padding: 8px 16px;
        font-size: 12px;
        border-top: 1px solid #FECACA;
      }
      
      .json-actions {
        padding: 12px 16px;
        background: #F9FAFB;
        border-top: 1px solid #E5E7EB;
        display: flex;
        gap: 8px;
      }
      
      .json-button {
        padding: 6px 12px;
        border: 1px solid #D1D5DB;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        font-size: 12px;
        color: #374151;
        transition: all 0.2s;
      }
      
      .json-button:hover {
        background: #F9FAFB;
        border-color: #3B82F6;
        color: #3B82F6;
      }
      
      .json-button.primary {
        background: #3B82F6;
        color: white;
        border-color: #3B82F6;
      }
      
      .json-button.primary:hover {
        background: #2563EB;
      }
    `;
    document.head.appendChild(style);
  }

  private createMainLayout(): void {
    // Haupt-Layout Container
    const mainLayout = document.createElement('div');
    mainLayout.className = 'main-layout';
    
    // Linke Panel (Map Editor)
    const leftPanel = document.createElement('div');
    leftPanel.className = 'left-panel';
    
    // Toolbar erstellen
    this.createToolbar();
    
    // Blocks-Sektion erstellen
    this.createBlocksSection();
    
    // Canvas Container erstellen
    this.createCanvasContainer();
    
    // Status Bar erstellen
    this.createStatusBar();
    
    // Alle Komponenten zum linken Panel hinzufügen
    leftPanel.appendChild(this.toolbar);
    leftPanel.appendChild(this.container.querySelector('.blocks-section')!);
    leftPanel.appendChild(this.canvasContainer);
    leftPanel.appendChild(this.statusBar);
    
    // Rechtes Panel (JSON View)
    const rightPanel = this.createJSONView();
    
    // Layout zusammenbauen
    mainLayout.appendChild(leftPanel);
    mainLayout.appendChild(rightPanel);
    this.container.appendChild(mainLayout);
  }

  private createJSONView(): HTMLElement {
    const rightPanel = document.createElement('div');
    rightPanel.className = 'right-panel';
    
    // Header
    const header = document.createElement('div');
    header.className = 'json-view-header';
    
    const title = document.createElement('span');
    title.textContent = 'Live JSON View';
    
    const status = document.createElement('span');
    status.id = 'json-status';
    status.textContent = 'Live';
    status.style.fontSize = '12px';
    status.style.color = '#10B981';
    
    header.appendChild(title);
    header.appendChild(status);
    
    // Actions direkt unter Header
    const actions = document.createElement('div');
    actions.className = 'json-actions';
    
    const formatButton = document.createElement('button');
    formatButton.textContent = 'Formatieren';
    formatButton.className = 'json-button';
    formatButton.addEventListener('click', () => this.formatJSON());
    
    const validateButton = document.createElement('button');
    validateButton.textContent = 'Speichern';
    validateButton.className = 'json-button primary';
    validateButton.addEventListener('click', () => this.validateAndApplyJSON());
    
    
    actions.appendChild(formatButton);
    actions.appendChild(validateButton);
    
    // Content
    const content = document.createElement('div');
    content.className = 'json-view-content';
    
    // Textarea für JSON
    this.jsonTextarea = document.createElement('textarea');
    this.jsonTextarea.className = 'json-textarea';
    this.jsonTextarea.placeholder = 'JSON wird automatisch aktualisiert...';
    
    // Error Element
    this.jsonErrorElement = document.createElement('div');
    this.jsonErrorElement.className = 'json-error';
    this.jsonErrorElement.style.display = 'none';
    
    // Event Listeners für Textarea
    this.jsonTextarea.addEventListener('input', () => this.onJSONInput());
    this.jsonTextarea.addEventListener('blur', () => this.validateAndApplyJSON());
    
    // Zusammenbauen
    content.appendChild(this.jsonTextarea);
    content.appendChild(this.jsonErrorElement);
    
    rightPanel.appendChild(header);
    rightPanel.appendChild(actions);
    rightPanel.appendChild(content);
    
    // Initial JSON laden
    this.updateJSONFromEditor();
    
    return rightPanel;
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
    
    const removeModeButton = document.createElement('button');
    removeModeButton.textContent = 'Entfernen-Modus';
    removeModeButton.className = 'action-button secondary';
    removeModeButton.addEventListener('click', () => this.toggleRemoveMode());
    
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Level leeren';
    clearButton.className = 'action-button danger';
    clearButton.addEventListener('click', () => this.clearLevel());
    
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Exportieren';
    exportButton.className = 'action-button';
    exportButton.addEventListener('click', () => this.exportLevel());
    
    
    actionSection.appendChild(removeModeButton);
    actionSection.appendChild(clearButton);
    actionSection.appendChild(exportButton);
    
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

  private createBlocksSection(): void {
    const blocksSection = document.createElement('div');
    blocksSection.className = 'blocks-section';
    
    const title = document.createElement('div');
    title.className = 'blocks-title';
    title.textContent = 'Verfügbare Blocks:';
    
    const blocksList = document.createElement('div');
    blocksList.className = 'blocks-list';
    
    // Verfügbare Blocks definieren
    const availableBlocks: string[] = [];

    allBlocks.forEach((block) => {
      availableBlocks.push(block.type)
    })
    
    availableBlocks.forEach(blockName => {
      const button = document.createElement('button');
      button.className = 'block-button';
      button.textContent = blockName;
      button.dataset.block = blockName;
      
      button.addEventListener('click', () => {
        this.toggleBlock(blockName);
      });
      
      blocksList.appendChild(button);
    });
    
    const currentBlocks = document.createElement('div');
    currentBlocks.className = 'current-blocks';
    currentBlocks.id = 'current-blocks-display';
    currentBlocks.textContent = 'Aktuelle Blocks: Keine';
    
    blocksSection.appendChild(title);
    blocksSection.appendChild(blocksList);
    blocksSection.appendChild(currentBlocks);
    
    this.container.appendChild(blocksSection);
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
    instructions.textContent = 'Klicke auf ein Objekt und dann auf das Grid, um es zu platzieren.';
    
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
    // Entfernen-Modus deaktivieren, wenn ein Objekt ausgewählt wird
    if (type && this.mapEditor.isInRemoveMode()) {
      this.mapEditor.setRemoveMode(false);
      this.updateRemoveModeButton();
    }
    
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

  private updateStatus(selectedType?: ObjectType | null): void {
    const statusElement = document.getElementById('selected-object-info');
    if (statusElement) {
      if (this.mapEditor.isInRemoveMode()) {
        statusElement.textContent = 'Entfernen-Modus aktiv - Rechtsklick oder Linksklick zum Entfernen';
      } else if (selectedType) {
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
      this.updateBlocksDisplay();
      this.updateBlockButtons();
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


  private toggleBlock(blockName: string): void {
    if (this.mapEditor.hasBlock(blockName)) {
      this.mapEditor.removeBlock(blockName);
    } else {
      this.mapEditor.addBlock(blockName);
    }
    
    this.updateBlocksDisplay();
    this.updateBlockButtons();
  }

  private updateBlocksDisplay(): void {
    const display = document.getElementById('current-blocks-display');
    if (display) {
      const blocks = this.mapEditor.getBlocks();
      if (blocks.length === 0) {
        display.textContent = 'Aktuelle Blocks: Keine';
      } else {
        display.textContent = `Aktuelle Blocks: ${blocks.join(', ')}`;
      }
    }
  }

  private updateBlockButtons(): void {
    const buttons = this.container.querySelectorAll('.block-button');
    buttons.forEach(button => {
      const blockName = button.getAttribute('data-block');
      if (blockName) {
        if (this.mapEditor.hasBlock(blockName)) {
          button.classList.add('added');
        } else {
          button.classList.remove('added');
        }
      }
    });
  }

  private toggleRemoveMode(): void {
    const isCurrentlyInRemoveMode = this.mapEditor.isInRemoveMode();
    this.mapEditor.setRemoveMode(!isCurrentlyInRemoveMode);
    
    // UI-Buttons aktualisieren
    this.updateRemoveModeButton();
    this.updateObjectButtons();
    this.updateStatus();
  }

  private updateRemoveModeButton(): void {
    const buttons = this.toolbar.querySelectorAll('button');
    const removeButton = Array.from(buttons).find(btn => 
      btn.textContent?.includes('Entfernen-Modus')
    ) as HTMLButtonElement;
    
    if (removeButton) {
      if (this.mapEditor.isInRemoveMode()) {
        removeButton.textContent = 'Entfernen-Modus (Aktiv)';
        removeButton.classList.add('danger');
        removeButton.classList.remove('secondary');
      } else {
        removeButton.textContent = 'Entfernen-Modus';
        removeButton.classList.remove('danger');
        removeButton.classList.add('secondary');
      }
    }
  }

  private updateObjectButtons(): void {
    const buttons = this.toolbar.querySelectorAll('.object-button');
    buttons.forEach(button => button.classList.remove('active'));
  }

  // JSON View Management Methods
  private updateJSONFromEditor(): void {
    if (this.isUpdatingFromEditor) return;
    
    this.isUpdatingFromEditor = true;
    const levelData = this.mapEditor.getCurrentLevel();
    this.jsonTextarea.value = JSON.stringify(levelData, null, 2);
    this.hideJSONError();
    this.updateJSONStatus('Live', '#10B981');
    this.isUpdatingFromEditor = false;
  }

  private onJSONInput(): void {
    this.updateJSONStatus('Bearbeitet', '#F59E0B');
  }

  private formatJSON(): void {
    try {
      const parsed = JSON.parse(this.jsonTextarea.value);
      this.jsonTextarea.value = JSON.stringify(parsed, null, 2);
      this.hideJSONError();
      this.updateJSONStatus('Formatiert', '#10B981');
    } catch (error) {
      this.showJSONError('Ungültiges JSON Format');
    }
  }

  private validateAndApplyJSON(): void {
    try {
      const parsed = JSON.parse(this.jsonTextarea.value);
      
      // Validierung der Level-Struktur
      if (!this.validateLevelStructure(parsed)) {
        this.showJSONError('Ungültige Level-Struktur');
        return;
      }
      
      // Level im Editor aktualisieren
      this.mapEditor.loadLevel(parsed);
      this.updateBlocksDisplay();
      this.updateBlockButtons();
      
      this.hideJSONError();
      this.updateJSONStatus('Angewendet', '#10B981');
      
    } catch (error) {
      this.showJSONError(`JSON Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    }
  }

  private resetJSONFromEditor(): void {
    this.updateJSONFromEditor();
  }

  private validateLevelStructure(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.blocks) &&
      typeof data.moodleSuccessCode === 'string' &&
      data.objects &&
      typeof data.objects === 'object' &&
      data.objects.car &&
      data.objects.destination &&
      Array.isArray(data.objects.waypoints) &&
      Array.isArray(data.objects.obstacles) &&
      data.objects.car.pos &&
      data.objects.destination.pos &&
      typeof data.objects.car.pos.x === 'number' &&
      typeof data.objects.car.pos.y === 'number' &&
      typeof data.objects.destination.pos.x === 'number' &&
      typeof data.objects.destination.pos.y === 'number'
    );
  }

  private showJSONError(message: string): void {
    this.jsonErrorElement.textContent = message;
    this.jsonErrorElement.style.display = 'block';
    this.updateJSONStatus('Fehler', '#EF4444');
  }

  private hideJSONError(): void {
    this.jsonErrorElement.style.display = 'none';
  }

  private updateJSONStatus(text: string, color: string): void {
    const statusElement = document.getElementById('json-status');
    if (statusElement) {
      statusElement.textContent = text;
      statusElement.style.color = color;
    }
  }

  // Öffentliche Methode für externe Updates
  public refreshJSONView(): void {
    this.updateJSONFromEditor();
  }
}
