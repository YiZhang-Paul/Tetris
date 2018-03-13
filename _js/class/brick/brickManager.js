//manage all bricks in game
export default class BrickManager {

    constructor() {

        this.orientations = ["up", "right", "down", "left"];
        this.previousBrick = null;
        this.currentBrick = null;
        this.nextBrick = null;
    }

    reset() {

        this.previousBrick = null;
    }

    draw() {

        if(this.currentBrick !== null) {

            this.currentBrick.draw();
        }
    }
}