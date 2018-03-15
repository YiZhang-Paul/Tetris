import GameCanvas from "_js/class/canvas/gameCanvas";

//side bars displaying game related information
export default class Hud extends GameCanvas {

    constructor(originator) {

        super();
        this.originator = originator;
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

    drawTitle(id, title) {

        let parent = document.getElementById(id);
        let ctx = this[id + "Ctx"];

        ctx.font = parent.offsetWidth / 6 + "px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "orange";

        ctx.fillText(

            title,
            parent.offsetWidth * 0.5,
            parent.offsetWidth * 0.2
        );
    }

    drawBrickIcon(id, brick) {

        let parent = document.getElementById(id);
        let ctx = this[id + "Ctx"];
        let blocks = brick[brick.orientation + "Icon"];
        //determine grid width for bricks
        const width = Math.min(

            Math.round(parent.offsetWidth / blocks[0].length),
            Math.round(parent.offsetHeight / blocks.length)
        );

        for(let i = 0; i < blocks.length; i++) {

            for(let j = 0; j < blocks[i].length; j++) {

                if(blocks[i][j] === 1) {

                    const x = j * width;
                    const y = i * width;
                    ctx.drawImage(brick.tile, x, y, width, width);
                }
            }
        }
    }

    //draw single number on given canvas
    drawNumber(id, number, lineHeight = 0.75) {

        let parent = document.getElementById(id);
        let ctx = this[id + "Ctx"];

        ctx.font = parent.offsetWidth / 5 + "px Arial";
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
        this.drawTitle("hold", "HOLD");
        this.drawBrickIcon("hold", manager.currentBrick);
        this.drawBackground("next");
        this.drawTitle("next", "NEXT");
        this.drawBrickIcon("next", manager.nextBrick);
    }

    //draw number display board
    drawNumberDisplay(id, title, number) {

        this.drawBackground(id);
        this.drawTitle(id, title);
        this.drawNumber(id, number);
    }

    drawScore() {

        this.drawNumberDisplay("score", "SCORE", this.originator.score);
    }

    //notify current level and goal
    drawLevelDetail() {

        this.drawNumberDisplay("level", "LEVEL", this.originator.level);
        this.drawNumberDisplay("goal", "GOAL", this.originator.goal);
    }

    draw() {

        this.drawBrickDisplay(this.originator.bricks);
        this.drawScore();
        this.drawLevelDetail();
    }
}