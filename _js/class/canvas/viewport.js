import Monitor from "_js/object/monitor";
import GameCanvas from "_js/class/canvas/gameCanvas";

//main display area for game contents
export default class Viewport extends GameCanvas {

    constructor(originator) {

        super();
        this.originator = originator;
        this.interval = null;
        this.gridWidth = null;
        this.gridHeight = null;
        this.setDimension();
        this.resizeContainer();
        //create canvas
        this.backCtx = this.createCanvas(1, "view");
        this.gridCtx = this.createCanvas(2, "view");
        this.messageCtx = this.createCanvas(3, "view");
        this.setFont(this.messageCtx, "20px Arial", "center", "white");
        //draw canvas
        this.backColor = "darkgrey";
        this.lineColor = "grey";
        this.background = document.getElementById("viewBG");
        this.draw();
    }

    setDimension() {
        //determine grid area dimension
        let grid = this.originator.grid;
        this.gridWidth = grid.width * grid.column;
        this.gridHeight = grid.width * grid.row;
        //determine border width
        const viewWidth = Monitor.viewWidth;
        const viewHeight = Monitor.viewHeight;
        this.border = viewWidth > viewHeight ?
            (viewHeight - this.gridHeight) * 0.33 :
            (viewWidth - this.gridWidth) * 0.5;
        //determine total dimension
        this.width = this.gridWidth + 2 * this.border;
        this.height = this.gridHeight + 3 * this.border;
    }

    resizeContainer() {

        let container = document.getElementById("main");
        container.style.width = Math.floor(this.width / 0.4) + "px";
        container.style.height = Math.floor(this.height / 0.98) + "px";
    }

    //set font style of given canvas
    setFont(canvas, font, textAlign, color) {

        canvas.font = font;
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

        this.message.clearRect(0, 0, this.width, this.height);
        //clear message permanently
        if(permanent) {

            clearInterval(this.interval);
            this.interval = null;
        }
    }

    drawMessage() {

        if(!this.interval) {

            let step = 0;

            this.interval = setInterval(() => {

                step = step ? 0 : 1;
                //blink effect
                if(step) {

                    const width = this.gridWidth * 0.565;
                    const height = this.gridHeight * 0.5;
                    this.messageCtx.fillText("Press SPACE", width, height);
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
            this.gridWidth,
            this.gridHeight
        );

        this.backCtx.restore();
    }

    drawGrid() {

        let grid = this.originator.grid;

        for(let i = 0; i < grid.logicLayer.length; i++) {

            for(let j = 0; j < grid.logicLayer[i].length; j++) {

                this.backCtx.beginPath();

                this.backCtx.rect(

                    j * grid.width + this.border,
                    i * grid.width + this.border,
                    grid.width,
                    grid.width
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