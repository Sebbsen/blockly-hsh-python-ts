import {LevelData, LevelObject} from './interfaces';

export class Maze {
    canvasContainer: HTMLElement;
    mazeSize: number;
    canvasSize: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    moveShedulerCount: number;
    car: LevelObject;
    destination: LevelObject;
    obstacles: LevelObject[];
    waypoints: LevelObject[];
    inventory: LevelObject[];

    constructor(
        canvasContainer: HTMLElement,
        levelData: LevelData
    ) {
        this.mazeSize = 8;
        this.canvasSize = 400
        this.canvasContainer = canvasContainer;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!
        this.moveShedulerCount = 0;
        this.car = levelData.objects.car;
        this.destination = levelData.objects.destination; 
        this.obstacles = levelData.objects.obstacles
        this.waypoints = levelData.objects.waypoints
        this.inventory = [];
    }

    moveUp() {
        console.log("Move Up");
        this.car.pos.y = this.car.pos.y - 1;
        this.draw();
        this.checkGameState();
    }

    moveRight() {
        console.log("Move Right");
        this.car.pos.x = this.car.pos.x + 1;
        this.draw();
        this.checkGameState();
    }

    moveLeft() {
        console.log("Move Left");
        this.car.pos.x = this.car.pos.x - 1;
        this.draw();
        this.checkGameState();
    }

    moveDown() {
        console.log("Move Down");
        this.car.pos.y = this.car.pos.y + 1;
        this.draw();
        this.checkGameState();
    }

    animationScheduler(move: string) {
        this.moveShedulerCount ++;
        const delay = 500 * this.moveShedulerCount
        
        setTimeout(() => {
            switch (move) {
                case 'moveUp':
                    this.moveUp();
                    break;
                case 'moveRight':
                    this.moveRight();
                    break;
                case 'moveLeft':
                    this.moveLeft();
                    break;
                case 'moveDown':
                    this.moveDown();
                    break;
                default:
                    break;
            }
        }, delay);
    }

    draw() {
        this.drawGrid();
        this.drawDestination();
        this.drawObstacles();
        this.drawWaypoints();
        this.drawCar(this.car.pos);
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
        this.drawEmojiToCell(this.car.emoji, cell);
    }

    drawDestination() {
        this.drawEmojiToCell(this.destination.emoji, this.destination.pos);
    }

    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            this.drawEmojiToCell(obstacle.emoji, obstacle.pos);
        });
    }

    drawWaypoints() {
        this.waypoints.forEach(waypoint => {
            this.drawEmojiToCell(waypoint.emoji, waypoint.pos);
        });
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

    checkGameState() {
        // car is at destination
        if(this.destination.pos.x === this.car.pos.x && this.destination.pos.y === this.car.pos.y) {
            this.handleCarOnDestination();
        }

        this.waypoints.forEach((waypoint, index) => {
            if(waypoint.pos.x === this.car.pos.x && waypoint.pos.y === this.car.pos.y) {
                this.handleCarOnWaypoint(waypoint, index);
            }
        });
    }

    handleCarOnWaypoint(waypoint: LevelObject, index: number) {
        this.inventory.push(waypoint);
        this.waypoints.splice(index, 1);
        this.draw();
    }

    showSuccess() {
        const successMessage = document.querySelector('.success-message');
        const failMessage = document.querySelector('.fail-message');
        
        if (successMessage && failMessage) {
            failMessage.classList.add('hidden');
            successMessage.classList.remove('hidden');
        }
    }

    showFail() {
        const successMessage = document.querySelector('.success-message');
        const failMessage = document.querySelector('.fail-message');
        
        if (successMessage && failMessage) {
            successMessage.classList.add('hidden');
            failMessage.classList.remove('hidden');
        }
    }

    handleCarOnDestination() {
        if(this.waypoints.length == 0) {
            this.showSuccess();
        } else {
            this.showFail();
        }
    }

}