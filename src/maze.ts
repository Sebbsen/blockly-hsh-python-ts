export class Maze {
    canvasContainer: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    carPosition: {x: number, y: number};
    targetPosition: {x: number, y: number};
    mazeSize: number;
    canvasSize: number;
    carEmoji: string;

    constructor(
        canvasContainer: HTMLElement,
        startPosition: {x: number, y: number}, 
        targetPosition: {x: number, y: number}
    ) {
        this.carPosition = startPosition;
        this.targetPosition = targetPosition;
        this.mazeSize = 8;
        this.canvasContainer = canvasContainer;
        this.canvasSize = 400
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!
        this.carEmoji = '🚗' 
    }

    moveUp() {
        console.log("Move Up");
        this.carPosition.y = this.carPosition.y - 1;
        this.draw();
    }

    init() {
        console.log(`🎯 Maze (${this.mazeSize}x${this.mazeSize}) - Start: (${this.carPosition.x},${this.carPosition.y}) → Ziel: (${this.targetPosition.x},${this.targetPosition.y})`);
    }

    draw() {
        this.drawGrid();
        this.drawCar(this.carPosition);
    }

    drawGrid() {
        // Canvas erstellen
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.canvasSize;
        this.canvas.height = this.canvasSize;
        this.ctx = this.canvas.getContext('2d')!;

        // Canvas zu container hinzufügen
        this.canvasContainer.innerHTML = ''
        this.canvasContainer.appendChild(this.canvas)

        // Zellen größe
        const cellSize = this.canvas.width / this.mazeSize;

        // Hintergrund
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid-Linien
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;

        // Vertikale Linien
        for (let i = 0; i <= this.mazeSize; i++) {
            const x = i * cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontale Linien
        for (let i = 0; i <= this.mazeSize; i++) {
            const y = i * cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawCar(cell: {x: number, y:number}) {
        this.drawEmojiToCell(this.carEmoji, cell);
    }

    drawEmojiToCell(emoji: string, cell: {x:number, y:number}) {
        this.ctx.fillStyle = '#1f2937';
        this.ctx.font = '42px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const center = this.getCenterOfCell(cell);
        this.ctx.fillText(emoji, center.centerX, center.centerY);
    }

    getCenterOfCell(cell: {x:number, y:number}) {
        const cellSize = this.canvasSize / this.mazeSize;
        const centerX = cell.x * cellSize + (cellSize/2);
        const centerY = cell.y * cellSize + (cellSize/2);
        return {centerX, centerY}
    }

}