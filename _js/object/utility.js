//helper methods
export default {

    //retrieve current time in milliseconds
    get now() {

        return new Date().getTime();
    },

    //round number to given decimal place
    roundTo(number, decimal = 0) {

        const multiplier = Math.pow(10, decimal);

        return Math.round(number * multiplier) / multiplier;
    },

    getRange(start, total) {

        let range = new Array(total).fill(0);

        return range.map((value, index) => start + index);
    },

    //retrieve random value between two given numbers(inclusive)
    getRandom(min, max) {

        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    //return a shuffled copy of given array
    shuffle(array) {

        let copy = array.slice();
        let shuffled = [];

        for(let i = 0; i < array.length; i++) {

            const index = this.getRandom(0, copy.length - 1);
            shuffled.push(copy.splice(index, 1)[0]);
        }

        return shuffled;
    },

    remove(array, element) {

        const index = array.indexOf(element);

        if(index !== -1) {

            array.splice(index, 1);
        }
    },

    lastElement(array) {

        return array.length === 0 ? null : array.slice(-1)[0];
    },

    //find number in the middle of a given range
    findMiddle(value) {

        return value % 2 ? (value + 1) * 0.5 : value * 0.5;
    }
}