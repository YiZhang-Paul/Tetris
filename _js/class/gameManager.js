import StateMachine from "_js/class/stateMachine";
import Utility from "_js/object/utility";
import Control from "_js/object/control";
import Grid from "_js/class/grid";
import Sound from "_js/class/sound";
import Viewport from "_js/class/canvas/viewport";
import Hud from "_js/class/canvas/hud";
import BrickManager from "_js/class/brick/BrickManager";

//manage in-game assets and all game related data
export default class GameManager {

    constructor() {

        this.grid = new Grid(20, 10);
        this.sound = new Sound();
        this.viewport = new Viewport(this.grid);
        this.hud = new Hud(this);
        this.bricks = new BrickManager(this);
        this.score = null;
        this.level = null;
        this.goal = null;
        this.state = null;
        this.initialize();
    }

    initialize() {

        this.score = 0;
        this.level = 1;
        this.goal = this.getGoal(this.level);
        this.state = new StateMachine(this, "ready");
        this.viewport.draw();
    }

    reset() {

        this.initialize();
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

    getGoal(level) {

        return level * ((level - 1) * 150 + 600);
    }

    checkGoal() {

        if(this.score >= this.goal) {
            //advance to next level if goal is met
            this.toNextLevel();
        }
    }

    toNextLevel() {

        this.sound.play(document.getElementById("level_up"));
        this.bricks.reset();
        this.goal = this.getGoal(++this.level);
        this.hud.drawLevelDetail();
        this.state.swap("ongoing");
    }
    /**
     * game states
     */
    //ready state
    ready(timeStep, actions) {

        this.viewport.drawMessage("Press SPACE");
        //check game start
        if(Control.releasedKey === Control.SPACE) {

            this.viewport.clearMessage(true);
            this.state.swap("ongoing");
        }
    }

    //ongoing state
    ongoing(timeStep, actions) {

        this.sound.play(document.getElementById("bgMusic"), 0, 0.4, true);
        this.bricks.update(timeStep, actions);
    }

    update(timeStep) {

        this.state.update(timeStep, this.readUserAction());
    }

    draw() {

        this.bricks.draw();
    }
}