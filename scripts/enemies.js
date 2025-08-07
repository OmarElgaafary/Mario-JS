import { Block, marioDeath } from "./block.js";

let Goombas = [];

export class Goomba extends Block {
    constructor(position, game) {
        super(position, game);
        this.type = 'goomba';
        this.direction = 'Right';
        this.image = document.getElementById('mario-goomba-left');
        this.speed = 0.005;
        this.status = true;
        this.stomped = false;
    }

    drawGoomba(context) {
        if (this.stomped) {
            this.drawDeathPoints(context);
        }
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        if (this.game.Grass[0].isOnGrass(this) === false) {
            this.y += 5;
            return;
        }

        const availableBlocks = this.game.Walls;
        availableBlocks.forEach((wall) => {
            if (!wall.detectCollision(this)) {
                this.x += this.direction === 'Left' ? -this.speed : this.speed;
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

    drawDeathPoints(context) {
        context.font = "18px 'Press Start 2P'";
        context.fillStyle = 'white';
        context.fillText('100', this.x, this.y - this.game.BLOCK_SIZE / 2);
        setTimeout(() => {
            context.clearRect(this.x, this.y - this.game.BLOCK_SIZE / 2, this.game.BLOCK_SIZE, this.game.BLOCK_SIZE);
        }, 3000)
    }

    isPlayerColliding() {
        const player = this.game.player;
        if (this.game.player.onGround()) {
            if (this.direction === 'Left' && player.handleInput.direction.x === 1 && Math.floor(player.x + player.width) === Math.floor(this.x)) {
                marioDeath(this, player);
            }
            else if (this.direction === 'Right' && Math.floor(this.x + this.width) === Math.floor(player.x)) {
                marioDeath(this, player);
            }
        }
    }

}

export function getGoombas(game) {
    Goombas.push(new Goomba({ x: game.player.width * 8, y: game.height - game.grassHeight - game.BLOCK_SIZE }, game));
    Goombas.push(new Goomba({ x: game.player.width * 16, y: game.height - game.grassHeight - game.BLOCK_SIZE }, game));
    Goombas.push(new Goomba({ x: game.player.width * 28, y: game.height - game.grassHeight - game.BLOCK_SIZE }, game));
    Goombas.push(new Goomba({ x: game.player.width * 36, y: game.height - game.grassHeight - game.BLOCK_SIZE }, game));
    Goombas.push(new Goomba({ x: game.player.width * 44, y: game.height - game.grassHeight - game.BLOCK_SIZE }, game));
    Goombas.push(new Goomba({ x: game.player.width * 66, y: game.height - game.grassHeight - game.BLOCK_SIZE }, game));
    Goombas.push(new Goomba({ x: game.player.width * 100, y: game.height - game.grassHeight - game.BLOCK_SIZE }, game));
    Goombas.push(new Goomba({ x: game.player.width * 105, y: game.height - game.grassHeight - game.BLOCK_SIZE }, game));




    return Goombas;
}