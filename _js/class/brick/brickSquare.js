import Brick from "_js/class/brick/brick";

export default class BrickSquare extends Brick {

    constructor(originator, color, orientation = "up") {

        super(originator, color, orientation);
        //patterns
        this.up = [

            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        this.down = this.up;
        this.left = this.up;
        this.right = this.up;
        //icons
        this.upIcon = [

            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ];

        this.downIcon = this.upIcon;
        this.leftIcon = this.upIcon;
        this.rightIcon = this.upIcon;
        this.blocks = this[orientation];
    }
}