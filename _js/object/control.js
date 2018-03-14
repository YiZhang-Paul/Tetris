import Utility from "_js/object/utility";

//game controls
export default {
    //input key trackers
    rotationKeys : [],
    movementKeys : [],
    pressedKeys  : new Set(),
    heldKeys     : new Map(),
    releasedKey  : null,

    /**
     * control keys
     */
    //rotate clockwise
	"W"       : 87,
	"UP"      : 38,
	//move down
	"S"       : 83,
	"DOWN"    : 40,
	//move left
	"A"       : 65,
	"LEFT"    : 37,
	//move right
	"D"       : 68,
	"RIGHT"   : 39,
	//drop bricks
    "SPACE"   : 32,
    //pause
    "P"       : 80,
    //console
    "CONSOLE" : 123,

    get inputKeys() {

        return [this.rotationKeys, this.movementKeys];
    },

    isPressed(key) {

        return this.pressedKeys.has(key);
    },

    //key is considered being held after reaching threshold
    isHeld(key, threshold = 400) {

        if(!this.heldKeys.has(key)) {

            return false;
        }
        //retrieve timestamp of initial key press
        const timestamp = this.heldKeys.get(key);

        return new Date().getTime() - timestamp >= threshold;
    },

    addKeyPress(tracker, key) {
        //ignore key already pressed
        if(Array.isArray(tracker) && !this.isPressed(key)) {

            tracker.push(key);
        }
        //always keep reference to all keys pressed
        this.pressedKeys.add(key);
    },

    removeKeyPress(tracker, key) {
        //check if key is already pressed
        if(Array.isArray(tracker) && this.isPressed(key)) {

            Utility.remove(tracker, key);
        }

        this.pressedKeys.delete(key);
    },

    addKeyHeld(key) {
        //record time of initial key press
        if(!this.heldKeys.has(key)) {

            this.heldKeys.set(key, new Date().getTime());
        }
    },

    removeKeyHeld(key) {

        if(this.heldKeys.has(key)) {

            this.heldKeys.delete(key);
        }
    }
};