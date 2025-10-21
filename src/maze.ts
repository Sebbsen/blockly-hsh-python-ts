export class Maze {
    canvasContainer: HTMLElement;
    startPosition: {x: number, y: number};
    targetPosition: {x: number, y: number};
    mazeSize: number;

    constructor(
        canvasContainer: HTMLElement,
        startPosition: {x: number, y: number}, 
        targetPosition: {x: number, y: number}
    ) {
        this.startPosition = startPosition;
        this.targetPosition = targetPosition;
        this.mazeSize = 8;
        this.canvasContainer = canvasContainer;
    }

    moveUp() {
        console.log("Move Up")
    }

    init() {
        console.log(`🎯 Maze (${this.mazeSize}x${this.mazeSize}) - Start: (${this.startPosition.x},${this.startPosition.y}) → Ziel: (${this.targetPosition.x},${this.targetPosition.y})`);
    }

    draw() {
        console.log('DRAW MAZE to', this.canvasContainer)
        // Canvas erstellen
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Canvas zu container hinzufügen
        this.canvasContainer.innerHTML = ''
        this.canvasContainer.appendChild(canvas)

        // Zellen größe
        const cellSize = canvas.width / this.mazeSize;

        // Hintergrund
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Grid-Linien
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;

        // Vertikale Linien
        for (let i = 0; i <= this.mazeSize; i++) {
            const x = i * cellSize;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontale Linien
        for (let i = 0; i <= this.mazeSize; i++) {
            const y = i * cellSize;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

}