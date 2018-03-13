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