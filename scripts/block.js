

export class Block {
    constructor(position, game) {
        this.type = 'block';
        this.game = game;
        this.height = 50;
        this.width = 50;
        this.x = position.x;
        this.y = position.y;
        this.hitAnimationActive = false;
        this.image = document.getElementById('mario-blocks-wall');
        this.originalY = this.y;
        this.gameFrame = 0;
        this.currentImage = 0;
    }

    drawBlock(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    collision() {
        if (this.detectCollision()) {
            const player = this.game.player;

            let VX = 0;
            if (player.handleInput.keys.includes('ArrowRight')) VX = 5;
            else if (player.handleInput.keys.includes('ArrowLeft')) VX = -5;

            const prevX = player.x - VX;
            const prevY = player.y - player.vy;

            const wasAbove = prevY + player.height <= this.y;
            const wasBelow = prevY >= this.y + this.height;
            const wasLeft = prevX + player.width <= this.x;
            const wasRight = prevX >= this.x + this.width;

            if (wasAbove)
                console.log('wasAbove');
            else if (wasBelow)
                console.log('wasBelow');
            else if (wasLeft)
                console.log('wasLeft');
            else if (wasRight)
                console.log('wasRight');

            if (wasAbove && player.y + player.height > this.y) {
                player.y = this.y - player.height;
                player.vy = 0;
                player.onBlock = true;
            } else player.onBlock = false;
            if (wasBelow && player.y < this.y + this.height) {
                player.y = this.y + this.height;
                player.vy = 0;
                if (this.type === 'brickBlock' || this.type === 'luckyBlock')
                    this.blockMovement();
            }
            if (wasLeft && player.x + player.width >= this.x) {
                player.x = this.x - player.width;
                console.log('i did something')
            }
            if (wasRight && player.x <= this.x + this.width) player.x = this.x + this.width;
            console.log(prevX + player.width, player.x + player.width, this.x);
            // previous is less, current is more


        }

        return null;
    }

    detectCollision() {
        const player = this.game.player;
        if (player.y + player.height > this.y && this.y + this.height > player.y
            && player.x + player.width > this.x && this.x + this.width > player.x
        )
            return true
        else
            return false
    }

    blockMovement() {
        const jumpInterval = setInterval(() => {
            if (this.y < this.originalY - 10) {
                clearInterval(jumpInterval);
                const fallInterval = setInterval(() => {
                    if (this.y === this.originalY) {
                        clearInterval(fallInterval);
                        this.hitAnimationActive = false
                        return;
                    }
                    this.y++;
                    this.hitAnimationActive = true;

                })
            }
            this.y -= 5;
        }, 50);
    }
}

class TubeBlock extends Block {
    constructor(position, game, imagePosition) {
        super(position, game);
        this.type = 'tubeBlock';
        this.width = this.height = 100;
        this.image = imagePosition === 'Top' ? document.getElementById('mario-blocks-pipe-top') : document.getElementById('mario-blocks-pipe-middle');
    }
};

class BrickBlock extends Block {
    constructor(position, game) {
        super(position, game);
        this.type = 'brickBlock';
        this.image = document.getElementById('mario-blocks-brick');
    }
};

class LuckyBlock extends BrickBlock {
    constructor(position, game) {
        super(position, game);
        this.type = 'luckyBlock';
        this.image = document.getElementById('mario-blocks-luckyblock');
        this.starImage = document.getElementById('mario-stars');
        this.startingStarY = this.y;
        this.starY = this.startingStarY;
        this.coinCollected = false;
        this.bumped = false;
    }

    luckyStarAnimation(context) {
        context.drawImage(this.starImage, 0, this.height * this.currentImage, this.width, this.height, this.x, this.starY, this.width, this.height);
        if (this.currentImage > 3) this.currentImage = 0;
        else if (this.game.player.gameFrame % 16 === 0) this.currentImage++;
    }

    starMovement() {
        this.bumped = true;
        const riseInterval = setInterval(() => {
            // amount that the star goes up before going down
            if (this.starY < this.startingStarY - 50) {
                clearInterval(riseInterval);
                const fallInterval = setInterval(() => {
                    if (this.starY === this.startingStarY) {
                        clearInterval(fallInterval);
                        this.bumped = false;
                        this.coinCollected = true;
                        return;
                    }
                    this.starY++;
                })
            }
            this.starY -= 10;
        }, 50)
    }

    blockMovement() {
        super.blockMovement();
        if (!this.coinCollected) this.starMovement();
    }
}



export function initalizeWalls(player, game) {
    let Walls = [];
    Walls.push(new LuckyBlock({ x: player.width * 6, y: player.height * 2 }, game));

    Walls.push(new BrickBlock({ x: player.width * 8, y: player.height * 2 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 5, y: game.height - game.grassHeight - 100 }, game, 'Top'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 8, y: game.height - game.grassHeight - 100 }, game, 'Middle'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x, y: game.height - game.grassHeight - 100 * 2 }, game, 'Top'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 6, y: game.height - game.grassHeight - 100 }, game, 'Middle'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x, y: game.height - game.grassHeight - 100 * 2 }, game, 'Top'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 6, y: game.height - game.grassHeight - 100 }, game, 'Middle'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x, y: game.height - game.grassHeight - 100 * 2 }, game, 'Top'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 6, y: game.height - game.grassHeight - 100 }, game, 'Top'));





    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 85, y: player.height * 2 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));


    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 2, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new Block({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));



    return Walls;
}