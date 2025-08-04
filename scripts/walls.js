export class Wall {
    constructor(position, game) {
        this.game = game;
        this.height = 50;
        this.width = 50;
        this.x = position.x;
        this.y = position.y;
        this.image = document.getElementById('mario-blocks-brick');
    }

    drawWall(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    collision() {
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
}
