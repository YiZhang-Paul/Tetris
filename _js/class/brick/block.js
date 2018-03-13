//basic build blocks for in-game bricks
export default class Block {

    constructor(width, color, ctx) {

        this.width = width;
        this.defaultTile = document.getElementById(color);
        this.blinkTile = document.getElementById("blink");
        this.tile = this.defaultTile;
        this.step = 0;
        this.ctx = ctx;
    }

    blink() {

        this.step = this.step ? 0 : 1;
        this.tile = this.step ? this.defaultTile : this.blinkTile;
    }

    draw(row, column, offsetX, offsetY) {

        const x = this.width * column + offsetX;
        const y = this.width * row + offsetY;
        this.ctx.drawImage(this.tile, x, y, this.width, this.width);
    }
}