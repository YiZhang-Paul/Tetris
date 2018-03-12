import Monitor from "_js/object/monitor";

//game grid area
export default class Grid {

    constructor(row, column) {

        this.row = row;
        this.column = column;
        this.width = this.getWidth();
        this.logicLayer = this.createLayer();
    }

    reset() {

        this.logicLayer = this.createLayer();
    }

    //calculate width of single grid according to monitor dimension
    getWidth() {

        return Math.min(

            Math.floor(Monitor.viewWidth / (this.column + 0.5)),
            Math.floor(Monitor.viewHeight / (this.row + 0.5))
        );
    }

    createLayer() {

        let layer = [];

        for(let i = 0; i < this.row; i++) {

            layer.push(new Array(this.column).fill(0));
        }

        return layer;
    }
}