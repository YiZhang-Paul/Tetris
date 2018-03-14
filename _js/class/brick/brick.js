import Utility from "_js/object/utility";
import Control from "_js/object/control";
import Block from "_js/class/brick/block";

export default class Brick {

    constructor(originator, color, orientation) {

        this.originator = originator;
        this.up = null;
        this.right = null;
        this.down = null;
        this.left = null;
        this.blocks = [];
        this.orientation = orientation;
        //brick positions
        this.spawn = null
        this.location = null;
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
    canRotate(direction) {

        let blocks = this[direction];
        let logicLayer = this.originator.grid.logicLayer;

        for(let i = 0; i < blocks.length; i++) {

            for(let j = 0; j < blocks[i].length; j++) {

                if(blocks[i][j] !== 1) {

                    continue;
                }

                let row = logicLayer[this.location[0] + i];

                if(row === undefined || row[this.location[1] + j] !== 0) {

                    return false;
                }

            }
        }

        return true;
    }

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
    //find next orientation after rotation
    nextOrientation(direction) {

        let orientations = this.originator.orientations;
        //current orientation index
        const oldIndex = orientations.indexOf(this.orientation);
        const modifier = direction === "clockwise" ? 1 : -1;
        //new orientation index
        const newIndex = (oldIndex + modifier) % orientations.length;

        return orientations[newIndex];
    }

    rotate(direction) {
        //find new orientation
        const orientation = this.nextOrientation(direction);

        if(this.canRotate(orientation)) {

            this.originator.sound.play(document.getElementById("rotate"));
            this.orientation = orientation;
            this.blocks = this[orientation];
            this.setRotateCooldown();
        }
    }

    getLandingDistance() {

        const start = this.location[0];
        let end = start;

        while(!this.collideOnBottom(end)) {

            end++;
        }

        return end - start;
    }

    //instantly land on bottom of the grid
    hardLanding() {

        this.originator.sound.play(document.getElementById("hard_impact"));
        this.landingDistance = this.getLandingDistance();
        //update brick location after landing
        this.location[0] += this.landingDistance;
        this.originator.saveLocation(this);
        this.originator.checkGameState(this);
    }

    moveDown() {

        if(this.collideOnBottom()) {

            this.originator.sound.play(document.getElementById("impact"));
            this.originator.saveLocation(this);
            this.originator.checkGameState(this);

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

        if(new Set(["clockwise", "counterclockwise"]).has(action) && !this.onRotateCooldown) {

            this.rotate(action);
        }

        if(action === "down" && !this.onMoveDownCooldown) {

            this.moveDown();
        }

        if(new Set(["left", "right"]).has(action) && !this.onSideMoveCooldown) {

            this.moveToSide(action);
        }
    }

    //fall down passively (not controlled by users)
    fallDown() {

        if(this.onFallCooldown) {

            return;
        }

        if(this.collideOnBottom()) {

            this.originator.sound.play(document.getElementById("impact"));
            this.originator.saveLocation(this);
            this.originator.checkGameState(this);

            return;
        }
        //move one row down
        this.location[0]++;
        this.setFallCooldown();
    }

    update(timeStep, actions) {
        //perform hard landing
        if(actions[0] === "landing") {

            this.hardLanding();

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
                    this.originator.ctx.drawImage(this.tile, x, y, gridWidth, gridWidth);
                }
            }
        }
    }
}