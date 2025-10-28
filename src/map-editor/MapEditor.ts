import { MapEditorConfig, MapEditorState, ObjectType, ObjectTemplate, LevelData, LevelObject, LevelPosition } from './types';

export class MapEditor {
  private canvasContainer: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private config: MapEditorConfig;
  private state: MapEditorState;
  private objectTemplates: ObjectTemplate[];
  private isRemoveMode: boolean = false;
  private onChangeCallback?: () => void;

  constructor(canvasContainer: HTMLElement, initialLevel?: LevelData) {
    this.canvasContainer = canvasContainer;
    this.config = {
      gridSize: 8,
      canvasSize: 400,
      cellSize: 400 / 8
    };
    
    this.state = {
      selectedObjectType: null,
      isPlacing: false,
      currentLevel: initialLevel || this.createEmptyLevel()
    };

    this.objectTemplates = [
      { type: 'car', emoji: '🚗', label: 'Auto', color: '#3B82F6' },
      { type: 'destination', emoji: '🏠', label: 'Ziel', color: '#10B981' },
      { type: 'waypoint', emoji: '⭐', label: 'Wegpunkt', color: '#F59E0B' },
      { type: 'obstacle', emoji: '❌', label: 'Hindernis', color: '#EF4444' }
    ];

    this.initializeCanvas();
    this.setupEventListeners();
    this.draw();
  }

  // Callback für Änderungen setzen
  public setOnChangeCallback(callback: () => void): void {
    this.onChangeCallback = callback;
  }

  private notifyChange(): void {
    if (this.onChangeCallback) {
      this.onChangeCallback();
    }
  }

  private initializeCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.config.canvasSize;
    this.canvas.height = this.config.canvasSize;
    this.canvas.style.border = '2px solid #374151';
    this.canvas.style.cursor = 'crosshair';
    this.ctx = this.canvas.getContext('2d')!;
    
    this.canvasContainer.innerHTML = '';
    this.canvasContainer.appendChild(this.canvas);
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    this.canvas.addEventListener('contextmenu', (e) => this.handleRightClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
  }

  private handleCanvasClick(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / this.config.cellSize);
    const y = Math.floor((e.clientY - rect.top) / this.config.cellSize);

    if (x >= 0 && x < this.config.gridSize && y >= 0 && y < this.config.gridSize) {
      if (this.isRemoveMode) {
        this.removeObjectAt({ x, y });
      } else if (this.state.selectedObjectType) {
        this.placeObject(this.state.selectedObjectType, { x, y });
      }
    }
  }

  private handleRightClick(e: MouseEvent): void {
    e.preventDefault(); // Verhindert das Kontextmenü
    
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / this.config.cellSize);
    const y = Math.floor((e.clientY - rect.top) / this.config.cellSize);

    if (x >= 0 && x < this.config.gridSize && y >= 0 && y < this.config.gridSize) {
      this.removeObjectAt({ x, y });
    }
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / this.config.cellSize);
    const y = Math.floor((e.clientY - rect.top) / this.config.cellSize);

    if (x >= 0 && x < this.config.gridSize && y >= 0 && y < this.config.gridSize) {
      if (this.isRemoveMode) {
        this.canvas.style.cursor = 'not-allowed';
      } else if (this.state.selectedObjectType) {
        this.canvas.style.cursor = 'crosshair';
        this.drawPreview(x, y);
      } else {
        this.canvas.style.cursor = 'default';
        this.draw();
      }
    } else {
      this.canvas.style.cursor = 'default';
      this.draw();
    }
  }

  private handleMouseLeave(): void {
    this.canvas.style.cursor = 'default';
    this.draw();
  }

  private placeObject(type: ObjectType, position: LevelPosition): void {
    const template = this.objectTemplates.find(t => t.type === type);
    if (!template) return;

    const newObject: LevelObject = {
      emoji: template.emoji,
      pos: position
    };

    switch (type) {
      case 'car':
        this.state.currentLevel.objects.car = newObject;
        break;
      case 'destination':
        this.state.currentLevel.objects.destination = newObject;
        break;
      case 'waypoint':
        // Prüfen ob bereits ein Waypoint an dieser Position existiert
        const existingWaypointIndex = this.state.currentLevel.objects.waypoints.findIndex(
          w => w.pos.x === position.x && w.pos.y === position.y
        );
        if (existingWaypointIndex === -1) {
          this.state.currentLevel.objects.waypoints.push(newObject);
        }
        break;
      case 'obstacle':
        // Prüfen ob bereits ein Hindernis an dieser Position existiert
        const existingObstacleIndex = this.state.currentLevel.objects.obstacles.findIndex(
          o => o.pos.x === position.x && o.pos.y === position.y
        );
        if (existingObstacleIndex === -1) {
          this.state.currentLevel.objects.obstacles.push(newObject);
        }
        break;
    }

    this.draw();
    this.notifyChange();
  }

  private drawPreview(x: number, y: number): void {
    this.draw();
    
    if (this.state.selectedObjectType) {
      const template = this.objectTemplates.find(t => t.type === this.state.selectedObjectType);
      if (template) {
        this.drawEmojiToCell(template.emoji, { x, y }, 0.5); // 50% Transparenz
      }
    }
  }

  private draw(): void {
    this.drawGrid();
    this.drawObjects();
  }

  private drawGrid(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Hintergrund
    this.ctx.fillStyle = '#F9FAFB';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Grid-Linien
    this.ctx.strokeStyle = '#D1D5DB';
    this.ctx.lineWidth = 1;

    // Vertikale Linien
    for (let i = 0; i <= this.config.gridSize; i++) {
      const x = i * this.config.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    
    // Horizontale Linien
    for (let i = 0; i <= this.config.gridSize; i++) {
      const y = i * this.config.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  private drawObjects(): void {
    // Auto zeichnen
    this.drawEmojiToCell(this.state.currentLevel.objects.car.emoji, this.state.currentLevel.objects.car.pos);
    
    // Ziel zeichnen
    this.drawEmojiToCell(this.state.currentLevel.objects.destination.emoji, this.state.currentLevel.objects.destination.pos);
    
    // Wegpunkte zeichnen
    this.state.currentLevel.objects.waypoints.forEach(waypoint => {
      this.drawEmojiToCell(waypoint.emoji, waypoint.pos);
    });
    
    // Hindernisse zeichnen
    this.state.currentLevel.objects.obstacles.forEach(obstacle => {
      this.drawEmojiToCell(obstacle.emoji, obstacle.pos);
    });
  }

  private drawEmojiToCell(emoji: string, cell: LevelPosition, alpha: number = 1): void {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.font = '32px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const center = this.getCenterOfCell(cell);
    this.ctx.fillText(emoji, center.centerX, center.centerY);
    this.ctx.restore();
  }

  private getCenterOfCell(cell: LevelPosition): { centerX: number; centerY: number } {
    const centerX = cell.x * this.config.cellSize + (this.config.cellSize / 2);
    const centerY = cell.y * this.config.cellSize + (this.config.cellSize / 2);
    return { centerX, centerY };
  }

  private createEmptyLevel(): LevelData {
    return {
      blocks: [],
      moodleSuccessCode: 'NEW_LEVEL',
      objects: {
        car: { emoji: '🚗', pos: { x: 0, y: 0 } },
        destination: { emoji: '🏠', pos: { x: 7, y: 7 } },
        waypoints: [],
        obstacles: []
      }
    };
  }

  // Öffentliche Methoden
  public selectObjectType(type: ObjectType | null): void {
    this.state.selectedObjectType = type;
    this.draw();
  }

  public getCurrentLevel(): LevelData {
    return this.state.currentLevel;
  }

  public loadLevel(level: LevelData): void {
    this.state.currentLevel = level;
    this.draw();
    this.notifyChange();
  }

  public clearLevel(): void {
    this.state.currentLevel = this.createEmptyLevel();
    this.draw();
    this.notifyChange();
  }

  public removeObjectAt(position: LevelPosition): void {
    // Entferne Waypoints an dieser Position
    this.state.currentLevel.objects.waypoints = this.state.currentLevel.objects.waypoints.filter(
      w => !(w.pos.x === position.x && w.pos.y === position.y)
    );
    
    // Entferne Hindernisse an dieser Position
    this.state.currentLevel.objects.obstacles = this.state.currentLevel.objects.obstacles.filter(
      o => !(o.pos.x === position.x && o.pos.y === position.y)
    );
    
    this.draw();
    this.notifyChange();
  }

  public getObjectTemplates(): ObjectTemplate[] {
    return this.objectTemplates;
  }

  public exportLevel(): string {
    return JSON.stringify(this.state.currentLevel, null, 2);
  }

  // Blocks-Management Methoden
  public addBlock(blockName: string): void {
    if (!this.state.currentLevel.blocks.includes(blockName)) {
      this.state.currentLevel.blocks.push(blockName);
      this.notifyChange();
    }
  }

  public removeBlock(blockName: string): void {
    this.state.currentLevel.blocks = this.state.currentLevel.blocks.filter(
      block => block !== blockName
    );
    this.notifyChange();
  }

  public getBlocks(): string[] {
    return [...this.state.currentLevel.blocks];
  }

  public setBlocks(blocks: string[]): void {
    this.state.currentLevel.blocks = [...blocks];
    this.notifyChange();
  }

  public clearBlocks(): void {
    this.state.currentLevel.blocks = [];
    this.notifyChange();
  }

  public hasBlock(blockName: string): boolean {
    return this.state.currentLevel.blocks.includes(blockName);
  }

  // Entfernen-Modus Methoden
  public setRemoveMode(enabled: boolean): void {
    this.isRemoveMode = enabled;
    if (enabled) {
      this.state.selectedObjectType = null;
    }
    this.draw();
  }

  public isInRemoveMode(): boolean {
    return this.isRemoveMode;
  }
}
