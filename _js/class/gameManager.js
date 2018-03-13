import StateMachine from "_js/class/stateMachine";
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
        this.bricks = new BrickManager();
        this.score = null;
        this.level = null;
        this.goal = null;
        this.state = null;
        this.initialize();
    }

    reset() {

        this.initialize();
    }

    initialize() {

        this.score = 0;
        this.level = 1;
        this.goal = this.getGoal(this.level);
        this.state = new StateMachine(this, "ready");
        this.viewport.draw();
    }

    getGoal(level) {

        return level * ((level - 1) * 150 + 600);
    }

    /**
     * game states
     */
    ready(timeStep, key) {

        this.viewport.drawMessage("Press SPACE");
        //check game start
        if(key === Control.SPACE) {

            this.viewport.clearMessage(true);
            this.state.swap("ongoing");
        }
    }

    update(timeStep, key) {

        this.state.update(timeStep, key);
    }

    draw() {

        this.bricks.draw();
    }
}