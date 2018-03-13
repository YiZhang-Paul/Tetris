//basic build blocks for in-game bricks
export default class Block {

    constructor(originator, width, color) {

        this.originator = originator;
        this.width = width;
        this.defaultTile = document.getElementById(color);
        this.blinkTile = document.getElementById("blink");
        this.tile = this.defaultTile;
        this.step = 0;
        this.ctx = originator.ctx;
    }

    blink() {

        this.step = this.step ? 0 : 1;
        this.tile = this.step ? this.defaultTile : this.blinkTile;
    }

    draw(row, column) {

        const x = this.width * column + this.originator.offsetX;
        const y = this.width * row + this.originator.offsetY;
        this.ctx.drawImage(this.tile, x, y, this.width, this.width);
    }
}