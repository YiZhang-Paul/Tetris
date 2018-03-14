import Utility from "_js/object/utility";

/**
 * random bag generator system for Tetris game
 * each brick is guaranteed to appear at least once every seven turns
 */
export default class RandomBag {

    constructor(total) {

        this.total = total; //total types of bricks
        this.bag = [];
        this.fill();
        console.log(this);
    }

    reset() {

        this.bag = [];
        this.fill();
    }

    //fill bag with a full set of shuffled bricks
    fill() {

        let bricks = Utility.getRange(0, this.total);
        //randomize order of bricks
        this.bag.push(...Utility.shuffle(bricks));
    }

    pop() {

        if(this.bag.length === 0) {

            this.fill();
        }
        //pick out the first brick
        return this.bag.shift();
    }
}