import Utility from "_js/object/utility";
import Control from "_js/object/control";
import Block from "_js/class/brick/block";

export default class Brick {

    constructor(originator, color, orientation = "up") {

        this.originator = originator;
        this.up = null;
        this.right = null;
        this.down = null;
        this.left = null;
        this.blocks = [];
        this.orientation = orientation;
        //brick positions
        this.spawn = originator.spawnGrid;
        this.location = this.spawn.slice();
        //movement and rotations
        this.fallSpeed = originator.fallSpeed; //passive falling speed
        this.fallTimestamp = 0;
        this.defaultMoveDownSpeed = 50;
        this.moveDownSpeed = this.defaultMoveDownSpeed; //active move down speed
        this.moveDownTimestamp = 0;
        this.sideMoveSpeed = 50;
        this.sideMoveTimestamp = 0;
        this.rotateSpeed = 175;
        this.rotateTimestamp = 0;
        this.landingDistance = 0;
        //brick appearance
        this.color = color;
        this.tile = document.getElementById(color);
    }

    get bottomRow() {

        for(let i = this.blocks.length - 1; i >= 0; i--) {
            //check if the row contains at least one block
            if(new Set(this.blocks[i]).has(1)) {

                return i;
            }
        }

        return 0;
    }

    /**
     * cooldown lookups
     */
    get onFallCooldown() {

        return Utility.now - this.fallTimestamp < this.fallSpeed;
    }

    get onMoveDownCooldown() {

        return Utility.now - this.moveDownTimestamp < this.moveDownSpeed;
    }

    get onSideMoveCooldown() {

        return Utility.now - this.sideMoveTimestamp < this.sideMoveSpeed;
    }

    get onRotateCooldown() {

        return Utility.now - this.rotateTimestamp < this.rotateSpeed;
    }

    /**
     * cooldown managements
     */
    setFallCooldown() {

        this.fallTimestamp = Utility.now;
    }

    setMoveDownCooldown() {

        this.moveDownTimestamp = Utility.now;
    }

    setSideMoveCooldown() {

        this.sideMoveTimestamp = Utility.now;
    }

    setRotateCooldown() {

        this.rotateTimestamp = Utility.now;
    }

    /**
     * collision detections
     */
    collideOnBottom(row = this.location[0]) {

        let logicLayer = this.originator.grid.logicLayer;

        for(let i = 0; i < this.blocks.length; i++) {

            for(let j = 0; j < this.blocks[i].length; j++) {

                if(row + i >= 0 && this.blocks[i][j] === 1) {
                    //check row below
                    let nextRow = logicLayer[row + i + 1];

                    if(nextRow === undefined || nextRow[this.location[1] + j] !== 0) {

                        return true;
                    }
                }
            }
        }

        return false;
    }

    collideOnSide(direction) {

        let logicLayer = this.originator.grid.logicLayer;

        for(let i = 0; i < this.blocks.length; i++) {

            for(let j = 0; j < this.blocks[i].length; j++) {

                if(this.blocks[i][j] === 1) {

                    const row = this.location[0] + i;
                    //next column on given direction
                    const column = this.location[1] + j + (direction === "left" ? -1 : 1);
                    //check grid boundary
                    const outOfBound = column < 0 || column > logicLayer[0].length - 1;
                    //check other blocks
                    const hitBlocks = logicLayer[row] && logicLayer[row][column] instanceof Block;

                    if(outOfBound || hitBlocks) {

                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * brick movements
     */
    moveDown() {

        if(this.collideOnBottom()) {

            this.originator.sound.play(document.getElementById("impact"));
            this.originator.saveLocation(this);
            this.originator.checkGameState();

            return;
        }
        //move one row down
        this.location[0]++;
        this.setMoveDownCooldown();
    }

    moveToSide(direction) {

        if(this.collideOnSide(direction)) {

            return;
        }

        this.originator.sound.play(document.getElementById("move"));
        this.location[1] += direction === "left" ? -1 : 1;
        this.setSideMoveCooldown();
    }

    move(action) {

        if(action === "down" && !this.onMoveDownCooldown) {

            this.moveDown();
        }

        if(action !== "down" && !this.onSideMoveCooldown) {

            this.moveToSide(action);
        }
    }

    //fall down passively (not controlled by users)
    fallDown() {

        if(this.onFallCooldown()) {

            return;
        }

        if(this.collideOnBottom()) {

            this.originator.sound.play(document.getElementById("impact"));
            this.originator.saveLocation(this);
            this.originator.checkGameState();

            return;
        }
        //move one row down
        this.location[0]++;
        this.setFallCooldown();
    }

    update(timeStep, actions) {
        //perform hard landing
        if(actions[0] === "landing") {

            //TODO: hard landing

            return;
        }
        //respond to other user controls
        actions.forEach(action => {

            this.move(action);
        });

        this.fallDown();
    }

    draw(gridWidth, offsetX, offsetY) {

        for(let i = 0; i < this.blocks.length; i++) {

            for(let j = 0; j < this.blocks[i].length; j++) {

                if(this.location[0] + i >= 0 && this.blocks[i][j] === 1) {

                    const x = (this.location[1] + j) * gridWidth + offsetX;
                    const y = (this.location[0] + i) * gridWidth + offsetY;
                    this.ctx.drawImage(this.tile, x, y, gridWidth, gridWidth);
                }
            }
        }
    }
}