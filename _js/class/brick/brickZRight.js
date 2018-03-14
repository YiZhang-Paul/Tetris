import Brick from "_js/class/brick/brick";

export default class BrickZRight extends Brick {

    constructor(originator, color, orientation = "up") {

        super(originator, color, orientation);
        //patterns
        this.up = [

            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ];

        this.left = [

            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0]
        ];

        this.down = this.up;
        this.right = this.left;
        //icons
        this.upIcon = [

            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 1, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0]
        ];

        this.leftIcon = [

            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0],
            [0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0]
        ];

        this.downIcon = this.upIcon;
        this.rightIcon = this.leftIcon;
        this.blocks = this[orientation];
    }
}