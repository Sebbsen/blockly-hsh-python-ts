import {LevelData, LevelObject} from './interfaces';
import {message} from './message';

export class Maze {
    canvasContainer: HTMLElement;
    mazeSize: number;
    canvasSize: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    moveShedulerCount: number;
    cachedCarPos: {x: number, y:number}
    startCarPos: {x: number, y:number}
    car: LevelObject;
    destination: LevelObject;
    obstacles: LevelObject[];
    waypoints: LevelObject[];
    inventory: LevelObject[];
    moodleSuccessCode: string;
    enforceWaypointOrder: boolean;
    private animationTimeouts: number[];
    lastMoveOnObstacleBool: boolean;

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
        this.startCarPos = {...this.car.pos}
        this.cachedCarPos = {...this.car.pos}
        this.destination = levelData.objects.destination; 
        this.obstacles = levelData.objects.obstacles
        this.waypoints = levelData.objects.waypoints
        this.inventory = [];
        this.moodleSuccessCode = levelData.moodleSuccessCode;
        this.enforceWaypointOrder = levelData.enforceWaypointOrder;
        this.animationTimeouts = [];
        this.lastMoveOnObstacleBool = false;
        message('hide', '');
    }

    moveUp() {
        console.log("Move Up");
        this.cachedCarPos = {...this.car.pos}
        this.car.pos.y = this.car.pos.y - 1;
        //this.draw();
        if(this.checkGameState()) {
            this.animationScheduler({...this.car.pos})
        }
    }

    moveRight() {
        console.log("Move Right");
        this.cachedCarPos = {...this.car.pos}
        this.car.pos.x = this.car.pos.x + 1;
        //this.draw();
        if(this.checkGameState()) {
            this.animationScheduler({...this.car.pos})
        }
    }

    moveLeft() {
        console.log("Move Left");
        this.cachedCarPos = {...this.car.pos}
        this.car.pos.x = this.car.pos.x - 1;
        //this.draw();
        if(this.checkGameState()) {
            this.animationScheduler({...this.car.pos})
        }
    }

    moveDown() {
        console.log("Move Down");
        this.cachedCarPos = {...this.car.pos}
        this.car.pos.y = this.car.pos.y + 1;
        //this.draw();
        if(this.checkGameState()) {
            this.animationScheduler({...this.car.pos})
        }
    }

    lastMoveOnObstacle(): boolean {
        return this.lastMoveOnObstacleBool;
    }
    // TODO: Problem ist, dass diese Abfrage in realtime mache aber die animationen delaye. Ich müsste also etweder die Animation von dem ganzen logic code trennen oder die Abfrgae (auch if else) in das delay einbauen
    // ich weiß zu dem Zeitpunkt der if Abfrage aktuell nicht, ob das Auto gegen eine wand fährt. Die If abfrage wird nach 1ms gestellt. Das auto bewegt sich aber mit der animation und bruacht 500ms für jeden step 

    stopExecution() {
        this.animationTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
        this.animationTimeouts = [];
        this.moveShedulerCount = 0;
    }

    async animationScheduler(move: string) {
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
        await this.sleep(500);
        console.log("SOLLTE SLEEP");
        
    }

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    draw() {
        this.drawGrid();
        this.drawDestination();
        this.drawObstacles();
        this.drawWaypoints();
        this.drawCar(carPos);
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

    checkGameState(): boolean {
        // reset obstacle bool
        this.lastMoveOnObstacleBool = false;

        // check if car is at destination
        if(this.destination.pos.x === this.car.pos.x && this.destination.pos.y === this.car.pos.y) {
            this.handleCarOnDestination();
            return true;
        }

        // check if car is at waypoint
        this.waypoints.forEach((waypoint, index) => {
            if(waypoint.pos.x === this.car.pos.x && waypoint.pos.y === this.car.pos.y) {
                this.handleCarOnWaypoint(waypoint, index);
                return true;
            }
        });

        // check if car hits obstacles
        this.obstacles.forEach((obstacle) => {
            if(obstacle.pos.x === this.car.pos.x && obstacle.pos.y === this.car.pos.y) {
                this.handleCarHitObstacle();
                return false;
            }
        });

        // check if going outside grid
        if(this.car.pos.x < 0 || this.car.pos.x > 7 || this.car.pos.y < 0 || this.car.pos.y > 7) {
            this.handleCarOutsideGrid();
            return false;
        }
        return true;
    }

    handleCarOutsideGrid(){
        this.car.pos = {...this.cachedCarPos};
        //this.draw();
        message('yellow', 'Achtung, du fährt gegen das Ende des Grids');
    }

    handleCarHitObstacle(){
        this.lastMoveOnObstacleBool = true;
        this.car.pos = {...this.cachedCarPos};
        //this.draw();
        message('yellow', 'Achtung, du bist gegen ein Hindernis gefahren');
    }

    handleCarOnWaypoint(waypoint: LevelObject, index: number) {
        if(this.enforceWaypointOrder && index != 0){
            message('yellow', 'Achte auf die Reihenfolge der Dinge, die du einsammeln musst');
            //this.draw();
            return;
        } 
        this.inventory.push(waypoint);
        this.waypoints.splice(index, 1);
        //this.draw();
    }

    handleCarOnDestination() {
        if(this.waypoints.length == 0) {
            message('green', `✅ Mission erfolgreich 🥳 <br> Füge diesem Code in Moodle ein um fortzufahren: <span id="moodleSuccessCode">${this.moodleSuccessCode}</span>`);
        } else {
            message('red', 'Achte auf die Reihenfolge der Dinge, die du einsammeln musst');
        }
    }

}