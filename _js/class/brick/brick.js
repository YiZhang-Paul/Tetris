import Utility from "_js/object/utility";
import Control from "_js/object/control";
import Block from "_js/class/brick/block";

export default class Brick {

    constructor(originator, spawn, color, viewport, sound, fallSpeed = 1, orientation = "up") {

        this.originator = originator;
        this.up = null;
        this.right = null;
        this.down = null;
        this.left = null;
        this.blocks = [];
        this.orientation = orientation;
        this.orientations = ["up", "right", "down", "left"];
        //brick positions
        this.spawnGrid = spawn;
        this.currentGrid = spawn;
        //movement and rotations
        this.fallSpeed = fallSpeed; //passive falling speed
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
        this.sound = sound;
        this.tile = document.getElementById(color);
        this.ctx = viewport.ctx;
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

    //check if given row collides with anything on its bottom
    collideToBottom(row = this.currentGrid[0]) {

    }

    collideToBottom(row = this.curGrid[0]) {
		for(let i = 0; i < this.grids.length; i++) {
			for(let j = 0; j < this.grids[i].length; j++) {
				//check logic grids
				if(row + i >= 0 && this.grids[i][j] == 1) {
					let rowBelow = game.grid.logicGrid[row + i + 1];
					if(rowBelow === undefined || rowBelow[this.curGrid[1] + j]) {
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

        if(this.collideToBottom()) {

            this.sound.play(document.getElementById("impact"));
            this.originator.checkGameState();

            return;
        }
        //move one row down
        this.currentGrid[0]++;
        this.setMoveDownCooldown();
    }

    move(direction) {

        if(direction === "down" && !this.onMoveDownCooldown) {

            this.moveDown();
        }

        if(direction !== "down" && !this.onSideMoveCooldown) {

            this.moveToSide();
        }
    }

    move(direction) {
		switch(direction) {
			//side move
			case "left" :
			case "right" :
				if(!this.onSideMoveCD()) {
					if(this.sideCollide(direction)) {
						return;
					}
					//play sound effect
					game.sound.playSound(document.getElementById("move"));
					this.curGrid[1] = direction == "left" ?
						this.curGrid[1] - 1 : this.curGrid[1] + 1;
					this.setSideMoveCD();
				}
				break;
		}
	}
}