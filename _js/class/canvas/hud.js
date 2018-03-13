import GameCanvas from "_js/class/canvas/gameCanvas";

//side bars displaying game related information
export default class Hud extends GameCanvas {

    constructor() {

        super();
        //canvases
        this.holdCtx = this.createCanvas(1, "hold");  //display current brick
        this.nextCtx = this.createCanvas(1, "next");  //display next brick
        this.scoreCtx = this.createCanvas(1, "score");
        this.levelCtx = this.createCanvas(1, "level");
        this.goalCtx = this.createCanvas(1, "goal");
    }

    drawBackground(id, color = "black", globalAlpha = 0.6) {

        let parent = document.getElementById(id);
        const width = parent.offsetWidth;
        const height = parent.offsetHeight;
        let ctx = this[id + "Ctx"];
        //fill parent container with given color
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.save();
        ctx.globalAlpha = globalAlpha;
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    drawBrickIcon(id, brick) {

        let parent = document.getElementById(id);
        let ctx = this[id + "Ctx"];
        //determine grid width for bricks
        const width = Math.min(

            Math.round(parent.offsetWidth / brick.grids[0].length),
            Math.round(parent.offsetHeight / brick.grids.length)
        );

        for(let i = 0; i < brick.grids.length; i++) {

            for(let j = 0; j < brick.grids[i].length; j++) {

                if(brick.grids[i][j] === 1) {

                    const x = j * width;
                    const y = i * width;
                    ctx.drawImage(brick.tile, x, y, width, width);
                }
            }
        }
    }

    //draw single number on given canvas
    drawNumber(id, number, fontSize = 25, lineHeight = 0.7) {

        let parent = document.getElementById(id);
        let ctx = this[id + "Ctx"];

        ctx.font = fontSize + "px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        ctx.fillText(

            number,
            parent.offsetWidth * 0.5,
            parent.offsetHeight * lineHeight
        );
    }

    //display current brick and next brick
    drawBrickDisplay(manager) {

        this.drawBackground("hold");
        this.drawBrickIcon("hold", manager.currentBrick);
        this.drawBackground("next");
        this.drawBrickIcon("next", manager.nextBrick);
    }

    //draw number display board
    drawNumberDisplay(id, number, fontSize) {

        this.drawBackground(id);
        this.drawNumber(id, number, fontSize);
    }

    //notify current level and goal
    drawLevelDetail(manager) {

        this.drawNumberDisplay("level", manager.level, 45);
        this.drawNumberDisplay("goal", manager.goal, 35);
    }

    draw(manager) {

        this.drawBrickDisplay(manager);
        this.drawLevelDetail(manager);
        this.drawNumberDisplay("score", manager.score);
    }
}