//helper methods
export default {

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
    }
}