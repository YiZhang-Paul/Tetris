import Control from "_js/object/control";
import Utility from "_js/object/utility";
import Block from "_js/class/brick/block";

//manage all bricks in game
export default class BrickManager {

    constructor(originator) {

        this.originator = originator;
        this.grid = originator.grid;
        this.sound = originator.sound;
        this.orientations = ["up", "right", "down", "left"];
        this.previousBrick = null;
        this.currentBrick = null;
        this.nextBrick = null;
        this.interval = null;
        this.ctx = originator.viewport.gridCtx;
    }

    //determine spawning grid for current active brick
    get spawnGrid() {

        if(this.currentBrick === null) {

            return null;
        }
        //try spawning the brick as close to center as possible
        const middleColumn = Utility.findMiddle(this.grid.column);
        const middleBlock = Utility.findMiddle(this.currentBrick.blocks[0].length);

        return [-this.currentBrick.bottomRow - 1, middleColumn - middleBlock];
    }

    //determine falling speed for current active brick according to game level
    get fallSpeed() {

        const level = this.originator.level ? this.originator.level : 1;

        return Math.max(500 - (level - 1) * 35, 45);
    }

    reset() {

        this.previousBrick = null;
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
    blinkRow(indexes) {

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
        const offset = this.originator.viewport.border;

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

        if(this.currentBrick !== null) {

            const offset = this.originator.viewport.border;
            this.currentBrick.draw(this.grid.width, offset, offset);
        }

        this.drawFallenBrick();
    }
}