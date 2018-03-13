import Control from "_js/object/control";
import Utility from "_js/object/utility";

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

    //retrieve effective user input keys
    getKeys() {

        if(Control.releasedKey === Control.SPACE) {
            //stop immediately when hard landing key is found
            return [Control.SPACE];
        }
        //check other input keys
        return Control.inputKeys.filter(set => set.length).map(Utility.lastElement);
    }

    //convert input key to corresponding action
    readKey(key) {

        switch(key) {

            case Control.SPACE :

                return "landing";

            case Control.W : case Control.UP :

                return "clockwise";

            case Control.S : case Control.DOWN :

                return "down";

            case Control.A : case Control.LEFT :

                return "left";

            case Control.D : case Control.RIGHT :

                return "right";
        }

        return null;
    }

    //retrieve valid user actions
    readUserAction() {

        return this.getKeys().map(this.readKey);
    }

    update(timeStep) {

        console.log(this.readUserAction());

        if(this.currentBrick !== null) {

            this.currentBrick.update(timeStep, this.readUserAction());
        }
    }

    draw() {

        if(this.currentBrick !== null) {

            this.currentBrick.draw();
        }
    }
}