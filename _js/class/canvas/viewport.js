import Monitor from "_js/object/monitor";
import GameCanvas from "_js/class/canvas/gameCanvas";

//main display area for game contents
export default class Viewport extends GameCanvas {

    constructor(grid) {

        super();
        this.grid = grid;
        this.gridAreaWidth = null;
        this.gridAreaHeight = null;
        this.interval = null;
        this.setDimension();
        this.resizeContainer();
        //create canvas
        this.backCtx = this.createCanvas(1, "view");
        this.gridCtx = this.createCanvas(2, "view");
        this.messageCtx = this.createCanvas(3, "view");
        this.setFont(this.messageCtx, this.fontSize, "center", "white");
        //draw canvas
        this.backColor = "darkgrey";
        this.lineColor = "grey";
        this.background = document.getElementById("viewBG");
    }

    get fontSize() {

        return this.gridAreaWidth / 8;
    }

    setDimension() {
        //determine grid area dimension
        this.gridAreaWidth = this.grid.width * this.grid.column;
        this.gridAreaHeight = this.grid.width * this.grid.row;
        //determine border width
        const viewWidth = Monitor.viewWidth;
        const viewHeight = Monitor.viewHeight;
        this.border = viewWidth > viewHeight ?
            (viewHeight - this.gridAreaHeight) * 0.33 :
            (viewWidth - this.gridAreaWidth) * 0.5;
        //determine total dimension
        this.width = this.gridAreaWidth + 2 * this.border;
        this.height = this.gridAreaHeight + 3 * this.border;
    }

    resizeContainer() {

        let container = document.getElementById("main");
        container.style.width = Math.floor(this.width / 0.4) + "px";
        container.style.height = Math.floor(this.height / 0.98) + "px";
    }

    //set font style of given canvas
    setFont(canvas, fontSize, textAlign, color) {

        canvas.font = fontSize + "px Arial";
        canvas.textAlign = textAlign;
        canvas.fillStyle = color;
    }

    clearBackground() {

        this.backCtx.clearRect(0, 0, this.width, this.height);
    }

    clearGrid() {

        this.gridCtx.clearRect(0, 0, this.width, this.height);
    }

    clearMessage(permanent) {

        this.messageCtx.clearRect(0, 0, this.width, this.height);
        //clear message permanently
        if(permanent) {

            clearInterval(this.interval);
            this.interval = null;
        }
    }

    drawMessage(message) {

        if(!this.interval) {

            let step = 0;

            this.interval = setInterval(() => {

                step = step ? 0 : 1;
                //blink effect
                if(step) {

                    const width = this.gridAreaWidth * 0.565;
                    const height = this.gridAreaHeight * 0.5;
                    this.messageCtx.fillText(message, width, height);
                }
                else {

                    this.clearMessage();
                }

            }, 350);
        }
    }

    drawBackground() {

        this.backCtx.beginPath();
        this.backCtx.rect(0, 0, this.width, this.height);
        this.backCtx.globalAlpha = 0.65;
        this.backCtx.fillStyle = this.backColor;
        this.backCtx.fill();
        this.backCtx.save();
        this.backCtx.globalAlpha = 0.9;

        this.backCtx.drawImage(

            this.background,
            this.border,
            this.border,
            this.gridAreaWidth,
            this.gridAreaHeight
        );

        this.backCtx.restore();
    }

    drawGrid() {

        for(let i = 0; i < this.grid.logicLayer.length; i++) {

            for(let j = 0; j < this.grid.logicLayer[i].length; j++) {

                this.backCtx.beginPath();

                this.backCtx.rect(

                    j * this.grid.width + this.border,
                    i * this.grid.width + this.border,
                    this.grid.width,
                    this.grid.width
                );

                this.backCtx.strokeStyle = this.lineColor;
                this.backCtx.stroke();
            }
        }
    }

    draw() {

        this.clearBackground();
        this.clearGrid();
        this.drawBackground();
        this.drawGrid();
    }
}