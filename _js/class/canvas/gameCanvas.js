export default class GameCanvas {

    constructor() {

        this.border = null; //border width
        this.width = null;  //total width including borders
        this.height = null; //total height including borders
    }

    createCanvas(zIndex, id) {

        let parent = document.getElementById(id);
        const width = this.width || parent.offsetWidth;
        const height = this.height || parent.offsetHeight;
        //setup canvas
        let canvas = document.createElement("canvas");
        canvas.style.zIndex = zIndex;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        //load canvas and return drawing context
        parent.appendChild(canvas);

        return canvas.getContext("2d");
    }

    /** @abstract */
    draw() {}
}