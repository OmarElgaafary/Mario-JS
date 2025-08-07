import { HandleInput } from "./handle-input.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.spriteSheetWidth = 220;
        this.spriteSheetHeight = 104;
        this.width = this.spriteSheetWidth / 3;
        this.height = this.spriteSheetHeight;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.grassHeight + 9;
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.gravityWeight = 0.2;
        this.marioWalking = document.getElementById('mario-walk');
        this.marioWalkingLeft = document.getElementById('mario-walk-left');
        this.marioJumpRight = document.getElementById('mario-jump-right');
        this.marioJumpLeft = document.getElementById('mario-jump-left');
        this.marioDeath1 = document.getElementById('mario-death-1');
        this.marioDeath2 = document.getElementById('mario-death-2');
        this.marioClimb1 = document.getElementById('mario-climb-1');
        this.marioClimb2 = document.getElementById('mario-climb-2');
        this.handleInput = new HandleInput(this);
        this.frameX = 0;
        this.gameFrame = 0;
        this.isMoving = false;
        this.onBlock = false;
        this.status = true;
        this.winStatus = false;
    }

    updatePlayer() {

        // pits 
        if (this.game.Grass[0].isOnGrass(this) === false && this.y + this.height > this.game.height - this.game.grassHeight) {
            this.y += 5;
            this.handleInput.keys = [];
            return;
        }

        if (this.vy !== 0) this.onBlock = false;

        if (this.handleInput.keys.includes('ArrowRight') && Math.floor(this.x) < Math.floor(this.game.width / 3)) {
            this.vx = this.speed;
            this.x += this.vx;
        }
        else if (this.handleInput.keys.includes('ArrowLeft')) {
            this.vx = -this.speed;
            this.x += this.vx;
        }
        else
            this.vx = 0;

        if (this.x + this.width > this.game.width) this.x = this.game.width - this.width
        else if (this.x < 0) this.x = 0;

        if (this.handleInput.keys.includes('Space') && (this.onGround() || (this.onBlock && !this.onGround())))
            this.vy = -10;
        this.y += this.vy;
        if (!this.onGround())
            this.vy += this.gravityWeight;
        else this.vy = 0;

    }

    onGround() {
        return this.y >= this.game.height - this.height - this.game.grassHeight;
    }

    drawPlayer(context) {
        if (!this.onGround() && !this.onBlock) {
            let jumpingImage = this.handleInput.lastkey === 'ArrowRight' ? this.marioJumpRight : this.marioJumpLeft;
            context.drawImage(jumpingImage, 0, 0, this.width, this.spriteSheetHeight, this.x, this.y, this.width, this.spriteSheetHeight)
        }
        else if (this.handleInput.direction.x > 0) {
            if (this.handleInput.keys.includes('ArrowRight')) {
                context.drawImage(this.marioWalking, this.width * this.frameX, 0, this.width, this.spriteSheetHeight, this.x, this.y, this.width, this.spriteSheetHeight)
                this.isMoving = true;

            } else {
                context.drawImage(this.marioWalking, 0, 0, this.width, this.spriteSheetHeight, this.x, this.y, this.width, this.spriteSheetHeight)
                this.isMoving = false;

            }

        }
        else if (this.handleInput.direction.x < 0) {
            if (this.handleInput.keys.includes('ArrowLeft')) {
                context.drawImage(this.marioWalkingLeft, this.width * this.frameX, 0, this.width, this.spriteSheetHeight, this.x, this.y, this.width, this.spriteSheetHeight)
                this.isMoving = false;

            } else {
                context.drawImage(this.marioWalkingLeft, 0, 0, this.width, this.spriteSheetHeight, this.x, this.y, this.width, this.spriteSheetHeight)
                this.isMoving = false;

            }
        }

        if (this.frameX > 2)
            this.frameX = 0;
        else if (this.gameFrame % 16 === 0)
            this.frameX++;

        this.gameFrame++;

    }

    marioDeathAnimation(context) {
        this.gameFrame++;
        this.handleInput.keys = [];
        this.vx = 0;
        this.vy = 0;
        this.isMoving = false;
        this.spriteSheetHeight = this.spriteSheetWidth = 50;
        if (!this.tempImage) this.tempImage = this.marioDeath1;
        if (this.gameFrame % 16 == 0) {
            if (this.tempImage === this.marioDeath1) this.tempImage = this.marioDeath2
            else this.tempImage = this.marioDeath1
        }
        context.drawImage(this.tempImage, this.x, this.y, this.width, this.height)
    }
}