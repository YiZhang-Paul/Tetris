import Utility from "_js/object/utility";
import Control from "_js/object/control";
import Grid from "_js/class/grid";
import Sound from "_js/class/sound";
import Viewport from "_js/class/canvas/viewport";

//game loop
export default {

    grid     : null,
    sound    : null,
    viewport : null,
    manager  : null,
    hud      : null,
    timeStep : 0,
    state    : null,

    loadAsset() {

        this.grid = new Grid(20, 10);
        this.sound = new Sound();
        this.viewport = new Viewport(this);
    },

    //register key down event listeners
    registerKeyDown() {

        document.addEventListener("keydown", event => {

            const key = event.keyCode;
            //for debug purposes only
            if(key !== Control.CONSOLE) {

                event.preventDefault();
            }

            switch(key) {
                //rotation keys
                case Control.W : case Control.UP :

                    Control.addKeyPress(Control.rotationKeys, key);
                    Control.addKeyHeld(key);

                    break;
                //movement keys
                case Control.S : case Control.DOWN :
                case Control.A : case Control.LEFT :
                case Control.D : case Control.RIGHT :

                    Control.addKeyPress(Control.movementKeys, key);
                    Control.addKeyHeld(key);

                    break;
            }
        });
    },

    //register key up event listeners
    registerKeyUp() {

        document.addEventListener("keyup", event => {
            //record key released
            Control.releasedKey = event.keyCode;
            //for debug purposes only
            if(Control.releasedKey !== Control.CONSOLE) {

                event.preventDefault();
            }

            let tracker = null;

            switch(Control.releasedKey) {

                case Control.W : case Control.UP :

                    tracker = Control.rotationKeys;

                    break;

                case Control.S : case Control.DOWN :
                case Control.A : case Control.LEFT :
                case Control.D : case Control.RIGHT :

                    tracker = Control.movementKeys;

                    break;
            }

            if(tracker !== null) {

                Control.removeKeyPress(tracker, Control.releasedKey);
                Control.removeKeyHeld(Control.releasedKey);
            }
        });
    },

    initialize() {

        this.loadAsset();
        //register key controls
        this.registerKeyDown();
        this.registerKeyUp();
        //initialize success
        this.state = "initialized";
    },

    run() {
        //fps optimization
        const maxFps = 30;
        let delta = 0;
        let lastFrameRender = 0;
        let counter = 0;
        this.timeStep = Utility.roundTo(1000 / maxFps, 2);

        let gameLoop = timestamp => {

            if(timestamp < lastFrameRender + this.timeStep) {
                //cap game fps
                requestAnimationFrame(gameLoop);

                return;
            }

            delta += timestamp - lastFrameRender;
            lastFrameRender = timestamp;
            counter = 0;

            while(delta > this.timeStep) {

                this.update();
                //update delta time
                delta -= this.timeStep;

                if(++counter >= 240) {

                    delta = 0;
                }
            }

            if(this.state === "running") {

                this.draw();
            }

            requestAnimationFrame(gameLoop);
        };
        //run game
        requestAnimationFrame(gameLoop);
        this.state = "running";
    },

    reset() {

        this.grid.reset();
    },

    stop() {

        this.state = null;
    },

    update() {

        Control.releasedKey = null;
    },

    draw() {

        this.viewport.draw();
    }
};