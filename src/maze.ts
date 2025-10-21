export class Maze {
    startPosition: {x: number, y: number};
    targetPosition: {x: number, y: number};

    constructor(
        startPosition: {x: number, y: number}, 
        targetPosition: {x: number, y: number}
    ) {
        this.startPosition = startPosition;
        this.targetPosition = targetPosition;
    }

    moveUp() {
        console.log("Move Up")
    }

    init() {
        console.log("init Maze", this.startPosition, this.startPosition)
    }
}