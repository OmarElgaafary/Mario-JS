export class Wall {
    constructor(position, game) {
        this.type = 'block';
        this.game = game;
        this.height = 50;
        this.width = 50;
        this.x = position.x;
        this.y = position.y;
        this.hitAnimationActive = false;
        this.image = document.getElementById('mario-blocks-brick');
        this.originalY = this.y;
        this.gameFrame = 0;
        this.currentImage = 0;
    }

    drawWall(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    collision(context) {
        if (this.detectCollision()) {
            const player = this.game.player;
            const prevX = player.x - player.vx;
            const prevY = player.y - player.vy;

            const wasAbove = prevY + player.height <= this.y;
            const wasBelow = prevY >= this.y + this.height;
            const wasLeft = prevX + player.width <= this.x;
            const wasRight = prevX >= this.x + this.width;

            if (wasAbove && player.y + player.height > this.y) {
                player.y = this.y - player.height;
                player.vy = 0;
                player.onBlock = true;
            } else player.onBlock = false;
            if (wasBelow && player.y < this.y + this.height) {
                player.y = this.y + this.height;
                player.vy = 0;
                this.blockMovement();
            }
            if (wasLeft && player.x + player.width > this.x) player.x = this.x - player.width;
            if (wasRight && player.x < this.x + this.width) player.x = this.x + this.width;
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

export class LuckyBlock extends Wall {
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
        this.starMovement();
    }



}

