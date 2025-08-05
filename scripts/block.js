let Walls = [];


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

    collision(target) {
        const player = target;
        if (this.detectCollision(player)) {

            let VX = 0;
            if (player.handleInput.keys.includes('ArrowRight')) VX = 5;
            else if (player.handleInput.keys.includes('ArrowLeft')) VX = -5;

            const prevX = player.x - VX;
            const prevY = player.y - player.vy;

            const wasAbove = prevY + player.height <= this.y;
            const wasBelow = prevY >= this.y + this.height;
            const wasLeft = prevX + player.width <= this.x;
            const wasRight = prevX >= this.x + this.width;

            if (wasAbove && player.y + player.height > this.y) {
                if (this.type === 'goomba' && player === this.game.player) {
                    this.speed = 0;
                    this.stomped = true;
                    this.height = 24;
                    this.y = this.game.height - this.game.grassHeight - this.height;
                    this.image = document.getElementById('mario-goomba-stomp');
                    const deathInterval = setTimeout(() => {
                        this.status = false;
                    }, 500)
                }
                player.y = this.y - player.height;
                player.vy = 0;
                player.onBlock = true;
            } else player.onBlock = false;
            if (wasBelow && player.y < this.y + this.height) {
                if (this.type === 'goomba' && player === this.game.player) {
                    // player.speed = 0;
                    // player.status = false;
                    // setInterval(() => {
                    //     player
                    // });

                }
                player.y = this.y + this.height;
                player.vy = 0;
                if (this.type === 'brickBlock' || this.type === 'luckyBlock')
                    this.blockMovement();
            }
            if (wasLeft && player.x + player.width >= this.x) {
                if (this.type === 'goomba' && player === this.game.player) {
                    player.speed = 0;
                    player.status = false;
                    setInterval(() => {
                        if (player.y < this.game.height) {
                            player.y += 2.5;
                        }
                        else player.y = 500;
                    }, 20)

                }
                player.x = this.x - player.width;
                console.log('i did something')
            }
            if (wasRight && player.x <= this.x + this.width) player.x = this.x + this.width;

        }

        return null;
    }

    detectCollision(target) {
        const player = target;
        if (player.y + player.height > this.y && this.y + this.height > player.y
            && player.x + player.width > this.x && this.x + this.width > player.x
        ) {
            console.log(this)
            return true

        }
        else {
            return false
        }
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
        this.width = this.height = game.BLOCK_SIZE * 2;
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

function createStairs(game, height, reverse, blockSpace, peak) {
    if (height === 1) {
        if (reverse) Walls.push(new Block({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: game.height - game.grassHeight - game.BLOCK_SIZE }, game));
        else Walls.push(new Block({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 3, y: game.height - game.grassHeight - game.BLOCK_SIZE }, game));
        return;
    }

    for (let i = 1; i < height + 1; i++) {
        if (reverse && height === peak && i === 1) Walls.push(new Block({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * blockSpace, y: game.height - game.grassHeight - game.BLOCK_SIZE }, game));
        else if (i === 1) Walls.push(new Block({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: game.height - game.grassHeight - game.BLOCK_SIZE }, game));
        else {
            Walls.push(new Block({ x: Walls[Walls.length - 1].x, y: game.height - game.grassHeight - game.BLOCK_SIZE * i }, game));

        }
    }
}

function createBlockStack(game, height) {
    for (let i = 1; i < height + 1; i++) {
        if (i === 1) Walls.push(new Block({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: game.height - game.grassHeight - game.BLOCK_SIZE }, game));
        else Walls.push(new Block({ x: Walls[Walls.length - 1].x, y: game.height - game.grassHeight - game.BLOCK_SIZE * i }, game));
    }

}

function makeStairs(game, height, reverse, blockSpace, peak) {
    for (let i = 1; i <= height; i++) createStairs(game, i, reverse, blockSpace, peak);
}

function makeReverseStairs(game, height, reverse, blockSpace, peak) {
    for (let i = height; i >= 0; i--) createStairs(game, i, reverse, blockSpace, peak);
}

export function initalizeWalls(player, game) {
    Walls.push(new LuckyBlock({ x: player.width * 6, y: player.height * 2 }, game));

    Walls.push(new BrickBlock({ x: player.width * 8, y: player.height * 2 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 5, y: game.height - game.grassHeight - game.BLOCK_SIZE * 2 }, game, 'Top'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 8, y: game.height - game.grassHeight - game.BLOCK_SIZE * 2 }, game, 'Middle'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x, y: game.height - game.grassHeight - game.BLOCK_SIZE * 2 * 2 }, game, 'Top'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 6, y: game.height - game.grassHeight - game.BLOCK_SIZE * 2 }, game, 'Middle'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x, y: game.height - game.grassHeight - game.BLOCK_SIZE * 2 * 2 }, game, 'Top'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 6, y: game.height - game.grassHeight - game.BLOCK_SIZE * 2 }, game, 'Middle'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x, y: game.height - game.grassHeight - game.BLOCK_SIZE * 2 * 2 }, game, 'Top'));
    Walls.push(new TubeBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 6, y: game.height - game.grassHeight - game.BLOCK_SIZE * 2 }, game, 'Top'));

    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 4, y: player.height * 2 }, game));

    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 20, y: player.height * 2 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));

    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));

    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 7, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x, y: player.height * 2 }, game));

    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 4, y: player.height * 2 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 2 }, game));

    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 6, y: player.height * 2 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 4, y: player.height * 2 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x, y: player.height * 0 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 4, y: player.height * 2 }, game));

    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 4, y: player.height * 2 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 5, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));

    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width * 4, y: player.height * 1 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new LuckyBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));
    Walls.push(new BrickBlock({ x: Walls[Walls.length - 1].x + Walls[Walls.length - 1].width, y: player.height * 1 }, game));


    makeStairs(game, 4, false, 3, 4);
    makeReverseStairs(game, 4, true, 3, 4);
    makeStairs(game, 4, false, 3, 4)
    createBlockStack(game, 4);

    makeReverseStairs(game, 4, true, 5.2, 4);

    makeStairs(game, 6, false, 1, 6);
    createBlockStack(game, 6);


    return Walls;
}