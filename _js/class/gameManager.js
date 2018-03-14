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
        this.timeout = null;
        this.state = null;
        this.initialize();
    }

    get gameFailed() {

        return this.grid.logicLayer[0].some(block => block !== 0);
    }

    initialize() {

        this.score = 0;
        this.level = 1;
        this.goal = this.getGoal(this.level);
        this.viewport.draw();
        this.hud.draw();
        this.state = new StateMachine(this, "ready");
    }

    reset() {

        this.grid.reset();
        this.bricks.reset();
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

    calculateScore(rowsCleared) {

        if(rowsCleared === 0) {

            return 0;
        }
        //base score table
        const table = Object.freeze({

            1 : 40, 2 : 100, 3 : 300, 4 : 1200
        });
        //base score and bonus score based on hard landing distance
        const base = table[rowsCleared] ? table[rowsCleared] : table[4];
        const bonus = this.bricks.hardLandDistance * 10;

        return base * this.level + bonus;
    }

    updateScore(rowsCleared) {

        this.score += this.calculateScore(rowsCleared);
        this.hud.drawScore();
        const soundId = this.bricks.isTetris(rowsCleared) ? "tetris" : "row_clear";
        this.sound.play(document.getElementById(soundId));
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
        this.goal = this.getGoal(++this.level);
        this.hud.drawLevelDetail();
        this.state.swap("ongoing");
    }

    checkGameState(rowsCleared) {

        if(this.gameFailed || rowsCleared > 0) {

            this.state.swap(this.gameFailed ? "buffering" : "clearing");

            return;
        }

        this.bricks.toNextBrick();
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

    //clearing state
    clearing() {

        if(!this.timeout) {
            //find rows to clear
            let rows = this.bricks.findFullRowIndexes();
            this.bricks.blinkRows(rows);
            //clear filled rows when blink is finished
            this.timeout = setTimeout(() => {

                this.bricks.clearRows(rows);
                this.bricks.stopBlink();
                this.bricks.toNextBrick();
                //update score and check goal
                this.updateScore(rows.length);
                this.checkGoal();
                this.state.swap("ongoing");

                clearTimeout(this.timeout);
                this.timeout = null;

            }, 700);
        }
    }

    //buffering state
    buffering() {

        if(!this.timeout) {

            this.sound.resetAll();
            this.sound.play(document.getElementById("game_end"));

            this.timeout = setTimeout(() => {

                this.reset();

                clearTimeout(this.timeout);
                this.timeout = null;

            }, 3500);
        }
    }

    update(timeStep) {

        this.state.update(timeStep, this.readUserAction());
    }

    draw() {

        this.bricks.draw();
    }
}