import Control from "_js/object/control";
import Utility from "_js/object/utility";

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