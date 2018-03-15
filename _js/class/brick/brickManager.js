import Control from "_js/object/control";
import Utility from "_js/object/utility";
import Block from "_js/class/brick/block";
import RandomBag from "_js/class/brick/randomBag";
import BrickLLeft from "_js/class/brick/brickLLeft";
import BrickLRight from "_js/class/brick/brickLRight";
import BrickZLeft from "_js/class/brick/brickZLeft";
import BrickZRight from "_js/class/brick/brickZRight";
import BrickI from "_js/class/brick/brickI";
import BrickT from "_js/class/brick/brickT";
import BrickSquare from "_js/class/brick/BrickSquare";

//manage all bricks in game
export default class BrickManager {

    constructor(originator) {

        this.originator = originator;
        this.grid = originator.grid;
        this.sound = originator.sound;
        this.orientations = ["up", "right", "down", "left"];
        this.randomBag = new RandomBag(7);
        this.previousBrick = null;
        this.currentBrick = null;
        this.nextBrick = null;
        this.timeout = null;
        this.interval = null;
        this.hud = originator.hud;
        this.viewport = originator.viewport;
        this.ctx = this.viewport.gridCtx;
        this.initialize();
    }

    //determine falling speed for current active brick according to game level
    get fallSpeed() {

        const level = this.originator.level ? this.originator.level : 0;

        return Math.max(350 - level * 15, 20);
    }

    //retrieve most recent hard landing distance
    get hardLandDistance() {

        if(this.previousBrick === null) {

            return 0;
        }

        return this.previousBrick.landingDistance;
    }

    initialize() {

        this.currentBrick = this.createBrick();
        this.nextBrick = this.createBrick();
    }

    reset() {

        this.randomBag.reset();
        this.previousBrick = null;
        this.initialize();
    }

    pickColor() {
        //retrieve all available colors
        let colors = document.getElementsByClassName("color");
        const index = Utility.getRandom(0, colors.length - 1);

        return colors[index].id;
    }

    pickOrientation() {

        const index = Utility.getRandom(0, this.orientations.length - 1);

        return this.orientations[index];
    }

    //determine spawning grid for current active brick
    setSpawnGrid(brick) {
        //try spawning the brick as close to center as possible
        const middleColumn = Utility.findMiddle(this.grid.column);
        const middleBlock = Utility.findMiddle(brick.blocks[0].length);

        brick.spawn = [-this.grid.row, middleColumn - middleBlock];
        brick.location = brick.spawn.slice();
    }

    createBrick() {

        let brick = null;
        //randomize appearance
        const type = this.randomBag.pop();
        const color = this.pickColor();
        const orientation = this.pickOrientation();

        if(type === 0) brick = new BrickLLeft(this, color, orientation);
        else if(type === 1) brick = new BrickLRight(this, color, orientation);
        else if(type === 2) brick = new BrickZLeft(this, color, orientation);
        else if(type === 3) brick = new BrickZRight(this, color, orientation);
        else if(type === 4) brick = new BrickI(this, color, orientation);
        else if(type === 5) brick = new BrickT(this, color, orientation);
        else brick = new BrickSquare(this, color, orientation);

        this.setSpawnGrid(brick);

        return brick;
    }

    swapBrick() {

        this.currentBrick = this.nextBrick;
        this.nextBrick = this.createBrick();
        this.hud.drawBrickDisplay(this);
    }

    //disallow user from actively moving a brick for a period of time
    forbidMove(brick) {

        const duration = 250;
        brick.moveDownSpeed = duration;
        brick.setMoveDownCooldown();
        //reset speed after given period of time
        let timeout = setTimeout(() => {

            brick.moveDownSpeed = brick.defaultMoveDownSpeed;
            clearTimeout(timeout);

        }, duration);
    }

    toNextBrick() {

        if(!this.timeout) {

            this.timeout = setTimeout(() => {

                this.swapBrick();
                this.forbidMove(this.currentBrick);

                clearTimeout(this.timeout);
                this.timeout = null;

            }, 500);
        }
    }

    //record brick location on logic layer
    saveLocation(brick = this.currentBrick) {

        for(let i = 0; i < brick.blocks.length; i++) {

            for(let j = 0; j < brick.blocks[i].length; j++) {

                if(brick.location[0] + i >= 0 && brick.blocks[i][j] === 1) {

                    const row = brick.location[0] + i;
                    const column = brick.location[1] + j;
                    let block = new Block(this.grid.width, brick.color, this.ctx);
                    this.grid.logicLayer[row][column] = block;
                }
            }
        }
    }

    checkGameState(brick = this.currentBrick) {

        this.currentBrick = null;
        this.previousBrick = brick;
        let rowsCleared = this.findFullRowIndexes();
        this.originator.checkGameState(rowsCleared.length);
    }

    isTetris(rowsCleared) {

        return rowsCleared >= 4;
    }

    //check if given row is filled with blocks
    isFull(row) {

        return row.every(column => column instanceof Block);
    }

    //find indexes of all rows filled with blocks
    findFullRowIndexes() {

        let indexes = [];

        for(let i = this.grid.logicLayer.length - 1; i >= 0; i--) {

            if(this.isFull(this.grid.logicLayer[i])) {

                indexes.push(i);
            }
        }

        return indexes;
    }

    //blink all blocks on given rows
    blinkRows(indexes) {

        if(!this.interval) {

            this.interval = setInterval(() => {

                indexes.forEach(index => {

                    this.grid.logicLayer[index].forEach(block => {

                        block.blink();
                    });
                });

            }, 100);
        }
    }

    stopBlink() {

        if(this.interval) {

            clearInterval(this.interval);
            this.interval = null;
        }
    }

    clearRows(indexes) {

        let toDelete = new Set(indexes);
        let oldLayer = this.grid.logicLayer;
        let newLayer = [];
        //copy all rows that will not be deleted
        for(let i = 0; i < oldLayer.length; i++) {

            if(!toDelete.has(i)) {

                newLayer.push(oldLayer[i]);
            }
        }
        //refill deleted rows with empty rows
        for(let i = 0; i < indexes.length; i++) {

            newLayer.unshift(this.grid.createRow());
        }

        this.grid.logicLayer = newLayer;
    }

    update(timeStep, actions) {

        if(this.currentBrick !== null) {

            this.currentBrick.update(timeStep, actions);
        }
    }

    drawFallenBrick() {

        let logicLayer = this.grid.logicLayer;
        const offset = this.viewport.border;

        for(let i = 0; i < logicLayer.length; i++) {

            for(let j = 0; j < logicLayer[i].length; j++) {
                //draw every block on logic layer
                if(logicLayer[i][j] instanceof Block) {

                    logicLayer[i][j].draw(i, j, offset, offset);
                }
            }
        }
    }

    draw() {

        this.viewport.clearGrid();

        if(this.currentBrick !== null) {

            const offset = this.viewport.border;
            this.currentBrick.draw(this.grid.width, offset, offset);
        }

        this.drawFallenBrick();
    }
}