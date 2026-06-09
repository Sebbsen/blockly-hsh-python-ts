import { MapEditor } from './MapEditor';
import { ObjectType, ObjectTemplate } from './types';
import { allBlocks } from '../blocks/blockRegistry';
import { MAX_LEVEL_HINTS, normalizeLevelHelp } from '../levelContent';
import './map-editor.css';

export class MapEditorUI {
  private mapEditor: MapEditor;
  private container: HTMLElement;
  private toolbar!: HTMLElement;
  private canvasContainer!: HTMLElement;
  private statusBar!: HTMLElement;
  private jsonTextarea!: HTMLTextAreaElement;
  private jsonErrorElement!: HTMLElement;
  private fixedBlocksList!: HTMLElement;
  private currentFixedBlocksDisplay!: HTMLElement;
  private hintEditorList!: HTMLElement;
  private addHintButton!: HTMLButtonElement;
  private solutionTextarea!: HTMLTextAreaElement;
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
    
    // HTML Template laden
    this.loadHTMLTemplate();
    
    // Event Listeners einrichten
    this.setupEventListeners();
  }

  private addStyles(): void {
    // CSS wird bereits über den Import geladen
  }

  private loadHTMLTemplate(): void {
    // HTML Template als String definieren
    const htmlTemplate = `
      <div class="main-layout">
        <!-- Linkes Panel (Map Editor) -->
        <div class="left-panel">
          <!-- Toolbar -->
          <div class="map-editor-toolbar">
            <div class="toolbar-section">
              <span style="font-weight: 500; color: #374151;">Objekt auswählen:</span>
              <!-- Objekt-Buttons werden dynamisch generiert -->
            </div>
            <div class="toolbar-section">
              <button class="action-button secondary" id="remove-mode-btn">Entfernen-Modus</button>
              <button class="action-button danger" id="clear-btn">Level leeren</button>
              <button class="action-button" id="export-btn">Exportieren</button>
            </div>
            <div class="toolbar-section">
              <label class="checkbox-container">
                <input type="checkbox" id="enforce-waypoint-order-checkbox">
                <span class="checkmark"></span>
                <span class="checkbox-label">Wegpunkt-Reihenfolge erzwingen</span>
              </label>
            </div>
          </div>

          <!-- Blocks-Sektion -->
          <div class="blocks-section">
            <div class="blocks-title">Verfügbare Blocks:</div>
            <div class="blocks-list" id="blocks-list">
              <!-- Block-Buttons werden dynamisch generiert -->
            </div>
            <div class="current-blocks" id="current-blocks-display">
              Aktuelle Blocks: Keine
            </div>
          </div>

          <!-- Fixed Blocks-Sektion -->
          <div class="blocks-section">
            <div class="blocks-title">Fixierte Blocks:</div>
            <div class="blocks-list" id="fixed-blocks-list">
              <!-- Fixed-Block-Buttons werden dynamisch generiert -->
            </div>
            <div class="current-blocks" id="current-fixed-blocks-display">
              Fixierte Blocks: Keine
            </div>
          </div>

          <!-- Tipps & Lösung -->
          <div class="blocks-section hints-editor-section">
            <div class="blocks-title">Tipps & Lösung:</div>
            <p class="hint-editor-help">Du kannst Markdown schreiben. Gib dem Nutzer kurze Tipps; sie werden nach 5 Minuten oder nach 5 Fehlversuchen angezeigt.</p>
            <div class="hint-editor-list" id="hint-editor-list"></div>
            <button class="action-button secondary hint-add-button" id="add-hint-btn" type="button">+ Tipp</button>
            <label class="hint-editor-label" for="solution-textarea">Lösung</label>
            <textarea class="hint-textarea solution-textarea" id="solution-textarea" rows="6"></textarea>
          </div>

          <!-- Canvas Container -->
          <div class="canvas-container" id="canvas-container">
            <!-- Canvas wird vom MapEditor erstellt -->
          </div>

          <!-- Status Bar -->
          <div class="status-bar">
            <div class="status-info">
              <span id="selected-object-info">Kein Objekt ausgewählt</span>
              <span>8x8 Grid</span>
            </div>
            <span>Klicke auf ein Objekt und dann auf das Grid, um es zu platzieren.</span>
          </div>
        </div>

        <!-- Rechtes Panel (JSON View) -->
        <div class="right-panel">
          <!-- Header -->
          <div class="json-view-header">
            <span>Live JSON View</span>
            <span id="json-status" style="font-size: 12px; color: #10B981;">Live</span>
          </div>

          <!-- Actions -->
          <div class="json-actions">
            <button class="json-button" id="format-btn">Formatieren</button>
            <button class="json-button primary" id="save-btn">Speichern</button>
          </div>

          <!-- Content -->
          <div class="json-view-content">
            <textarea class="json-textarea" id="json-textarea" placeholder="JSON wird automatisch aktualisiert..."></textarea>
            <div class="json-error" id="json-error" style="display: none;"></div>
          </div>
        </div>
      </div>
    `;
    
    // HTML Template in den Container laden
    this.container.innerHTML = htmlTemplate;
    
    // Referenzen zu den UI-Elementen setzen
    this.toolbar = this.container.querySelector('.map-editor-toolbar')!;
    this.canvasContainer = this.container.querySelector('#canvas-container')!;
    this.statusBar = this.container.querySelector('.status-bar')!;
    this.jsonTextarea = this.container.querySelector('#json-textarea')!;
    this.jsonErrorElement = this.container.querySelector('#json-error')!;
    this.fixedBlocksList = this.container.querySelector('#fixed-blocks-list')!;
    this.currentFixedBlocksDisplay = this.container.querySelector('#current-fixed-blocks-display')!;
    this.hintEditorList = this.container.querySelector('#hint-editor-list')!;
    this.addHintButton = this.container.querySelector('#add-hint-btn')!;
    this.solutionTextarea = this.container.querySelector('#solution-textarea')!;
    
    // Dynamische Inhalte generieren
    this.createObjectButtons();
    this.createBlockButtons();
    this.createFixedBlockButtons();
    this.setupActionButtons();
    this.renderHintEditor();
    
    // Canvas hinzufügen
    const canvasElement = this.mapEditor['canvas'];
    this.canvasContainer.appendChild(canvasElement);
    
    // Initial JSON laden
    this.updateJSONFromEditor();
  }

  private createObjectButtons(): void {
    const objectSection = this.toolbar.querySelector('.toolbar-section:first-child')!;
    const templates = this.mapEditor.getObjectTemplates();
    
    templates.forEach(template => {
      const button = this.createObjectButton(template);
      objectSection.appendChild(button);
    });
  }

  private createBlockButtons(): void {
    const blocksList = this.container.querySelector('#blocks-list')!;
    const availableBlocks: string[] = [];

    allBlocks.forEach((block) => {
      availableBlocks.push(block.type);
    });
    
    availableBlocks.forEach(blockName => {
      const button = document.createElement('button');
      button.className = 'block-button';
      button.textContent = blockName;
      button.dataset.block = blockName;
      button.dataset.listType = 'regular';
      
      button.addEventListener('click', () => {
        this.toggleBlock(blockName);
      });
      
      blocksList.appendChild(button);
    });
  }

  private createFixedBlockButtons(): void {
    const availableBlocks: string[] = [];

    allBlocks.forEach((block) => {
      availableBlocks.push(block.type);
    });

    availableBlocks.forEach(blockName => {
      const button = document.createElement('button');
      button.className = 'block-button';
      button.textContent = blockName;
      button.dataset.block = blockName;
      button.dataset.listType = 'fixed';

      button.addEventListener('click', () => {
        this.toggleFixedBlock(blockName);
      });

      this.fixedBlocksList.appendChild(button);
    });
  }

  private setupActionButtons(): void {
    const removeModeBtn = this.container.querySelector('#remove-mode-btn') as HTMLButtonElement;
    const clearBtn = this.container.querySelector('#clear-btn') as HTMLButtonElement;
    const exportBtn = this.container.querySelector('#export-btn') as HTMLButtonElement;
    const formatBtn = this.container.querySelector('#format-btn') as HTMLButtonElement;
    const saveBtn = this.container.querySelector('#save-btn') as HTMLButtonElement;
    const enforceWaypointOrderCheckbox = this.container.querySelector('#enforce-waypoint-order-checkbox') as HTMLInputElement;
    
    removeModeBtn.addEventListener('click', () => this.toggleRemoveMode());
    clearBtn.addEventListener('click', () => this.clearLevel());
    exportBtn.addEventListener('click', () => this.exportLevel());
    formatBtn.addEventListener('click', () => this.formatJSON());
    saveBtn.addEventListener('click', () => this.validateAndApplyJSON());
    enforceWaypointOrderCheckbox.addEventListener('change', () => this.toggleEnforceWaypointOrder());
    this.addHintButton.addEventListener('click', () => this.addHint());
    this.solutionTextarea.addEventListener('input', () => this.updateSolution(this.solutionTextarea.value));
    this.solutionTextarea.addEventListener('blur', () => {
      if (this.solutionTextarea.value.trim() !== '') return;

      const levelData = this.getNormalizedLevelData();
      this.solutionTextarea.value = levelData.solution ?? '';
      this.syncJSONAfterHintEdit();
    });
  }

  private setupJSONEventListeners(): void {
    // Event Listeners für Textarea
    this.jsonTextarea.addEventListener('input', () => this.onJSONInput());
    this.jsonTextarea.addEventListener('blur', () => this.validateAndApplyJSON());
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




  private setupEventListeners(): void {
    // JSON Event Listeners einrichten
    this.setupJSONEventListeners();
    
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
      this.updateFixedBlocksDisplay();
      this.updateFixedBlockButtons();
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

  private toggleFixedBlock(blockName: string): void {
    if (this.mapEditor.hasFixedBlock(blockName)) {
      this.mapEditor.removeFixedBlock(blockName);
    } else {
      this.mapEditor.addFixedBlock(blockName);
    }

    this.updateFixedBlocksDisplay();
    this.updateFixedBlockButtons();
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
    const buttons = this.container.querySelectorAll('.block-button[data-list-type="regular"]');
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

  private updateFixedBlocksDisplay(): void {
    if (this.currentFixedBlocksDisplay) {
      const fixedBlocks = this.mapEditor.getFixedBlocks();
      if (fixedBlocks.length === 0) {
        this.currentFixedBlocksDisplay.textContent = 'Fixierte Blocks: Keine';
      } else {
        this.currentFixedBlocksDisplay.textContent = `Fixierte Blocks: ${fixedBlocks.join(', ')}`;
      }
    }
  }

  private updateFixedBlockButtons(): void {
    const buttons = this.container.querySelectorAll('.block-button[data-list-type="fixed"]');
    buttons.forEach(button => {
      const blockName = button.getAttribute('data-block');
      if (blockName) {
        if (this.mapEditor.hasFixedBlock(blockName)) {
          button.classList.add('added');
        } else {
          button.classList.remove('added');
        }
      }
    });
  }

  private getNormalizedLevelData() {
    return normalizeLevelHelp(this.mapEditor.getCurrentLevel());
  }

  private syncJSONAfterHintEdit(): void {
    const levelData = this.getNormalizedLevelData();
    this.jsonTextarea.value = JSON.stringify(levelData, null, 2);
    this.hideJSONError();
    this.updateJSONStatus('Live', '#10B981');
  }

  private renderHintEditor(): void {
    const levelData = this.getNormalizedLevelData();
    const hints = levelData.hints ?? [];

    this.hintEditorList.innerHTML = '';
    hints.forEach((hint, index) => {
      const item = document.createElement('div');
      item.className = 'hint-editor-item';

      const header = document.createElement('div');
      header.className = 'hint-editor-item-header';

      const label = document.createElement('label');
      label.className = 'hint-editor-label';
      label.textContent = `Tipp ${index + 1}`;

      const removeButton = document.createElement('button');
      removeButton.className = 'json-button hint-remove-button';
      removeButton.type = 'button';
      removeButton.textContent = 'Entfernen';
      removeButton.addEventListener('click', () => this.removeHint(index));

      const textarea = document.createElement('textarea');
      textarea.className = 'hint-textarea';
      textarea.rows = 4;
      textarea.value = hint;
      textarea.addEventListener('input', () => this.updateHint(index, textarea.value));

      header.appendChild(label);
      header.appendChild(removeButton);
      item.appendChild(header);
      item.appendChild(textarea);
      this.hintEditorList.appendChild(item);
    });

    this.addHintButton.disabled = hints.length >= MAX_LEVEL_HINTS;
    this.addHintButton.textContent = hints.length >= MAX_LEVEL_HINTS ? 'Max. 3 Tipps' : '+ Tipp';
    this.solutionTextarea.value = levelData.solution ?? '';
  }

  private addHint(): void {
    const levelData = this.getNormalizedLevelData();
    const hints = levelData.hints ?? [];
    if (hints.length >= MAX_LEVEL_HINTS) return;

    hints.push('');
    levelData.hints = hints;
    this.renderHintEditor();
    this.syncJSONAfterHintEdit();
  }

  private removeHint(index: number): void {
    const levelData = this.getNormalizedLevelData();
    levelData.hints = (levelData.hints ?? []).filter((_, hintIndex) => hintIndex !== index);
    this.renderHintEditor();
    this.syncJSONAfterHintEdit();
  }

  private updateHint(index: number, value: string): void {
    const levelData = this.getNormalizedLevelData();
    const hints = levelData.hints ?? [];
    hints[index] = value;
    levelData.hints = hints.slice(0, MAX_LEVEL_HINTS);
    this.syncJSONAfterHintEdit();
  }

  private updateSolution(value: string): void {
    const levelData = this.getNormalizedLevelData();
    levelData.solution = value;
    this.syncJSONAfterHintEdit();
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

  private toggleEnforceWaypointOrder(): void {
    const checkbox = this.container.querySelector('#enforce-waypoint-order-checkbox') as HTMLInputElement;
    const levelData = this.mapEditor.getCurrentLevel();
    
    levelData.enforceWaypointOrder = checkbox.checked;
    
    this.mapEditor.loadLevel(levelData);
  }

  // JSON View Management Methods
  private updateJSONFromEditor(): void {
    if (this.isUpdatingFromEditor) return;
    
    this.isUpdatingFromEditor = true;
    const levelData = this.mapEditor.getCurrentLevel();
    normalizeLevelHelp(levelData);
    this.jsonTextarea.value = JSON.stringify(levelData, null, 2);
    
    // Checkbox-Status synchronisieren
    const checkbox = this.container.querySelector('#enforce-waypoint-order-checkbox') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = levelData.enforceWaypointOrder;
    }
    this.updateBlocksDisplay();
    this.updateBlockButtons();
    this.updateFixedBlocksDisplay();
    this.updateFixedBlockButtons();
    this.renderHintEditor();
    
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
      normalizeLevelHelp(parsed);
      
      // Validierung der Level-Struktur
      if (!this.validateLevelStructure(parsed)) {
        this.showJSONError('Ungültige Level-Struktur');
        return;
      }
      
      // Level im Editor aktualisieren
      this.mapEditor.loadLevel(parsed);
      this.updateBlocksDisplay();
      this.updateBlockButtons();
      this.renderHintEditor();
      
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
      Array.isArray(data.fixedBlocks) &&
      typeof data.moodleSuccessCode === 'string' &&
      typeof data.enforceWaypointOrder === 'boolean' &&
      Array.isArray(data.hints) &&
      data.hints.length <= MAX_LEVEL_HINTS &&
      data.hints.every((hint: unknown) => typeof hint === 'string') &&
      typeof data.solution === 'string' &&
      data.solution.trim().length > 0 &&
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
