import { Block } from "./block.js";

export class Goomba extends Block {
    constructor(position, game) {
        super(position, game);
        this.type = 'goomba';
        this.direction = 'Left';
        this.image = document.getElementById('mario-goomba-left');
        this.speed = 0.005;
        this.status = true;
        this.stomped = false;
    }

    update() {

        // if (this.game.Grass[0].isOnGrass() && this.y + this.height > this.game.height - this.game.grassHeight) {
        //     this.y += 5;
        //     this.handleInput.keys = [];
        //     return;
        // }

        const availableBlocks = this.game.Walls;
        availableBlocks.forEach((wall) => {
            if (!wall.detectCollision(this)) {
                this.x += this.direction === 'Left' ? this.speed : -this.speed;
            }
            else {
                if (this.direction === 'Left') {
                    this.direction = 'Right'
                }
                else if (this.direction === 'Right') {
                    this.direction = 'Left'
                }

            }

        })

        if (this.game.player.gameFrame % 16 === 0 && !this.stomped) {
            if (this.image === document.getElementById('mario-goomba-left')) this.image = document.getElementById('mario-goomba-right');
            else this.image = document.getElementById('mario-goomba-left');
        }


    }

}