export class Layer {
    constructor(image, game, height, y) {
        this.game = game;
        this.width = 1500;
        this.height = height;
        this.x = 0;
        this.y = y;
        this.backGroundMultipler = this.game.backGroundMultipler;
        this.speed = this.game.gameSpeed * this.game.backGroundMultipler;
        this.image = image;
        this.castleSize = 350;
    }

    updateBackGround(gameSpeed) {
        this.speed = gameSpeed * this.backGroundMultipler;
        if (this.x <= -this.width) this.x = 0;
        this.x -= this.speed;
    }

    drawBackGround(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
        this.drawCastle(context)
    }

    drawCastle(context) {
        context.drawImage(document.getElementById('mario-castle'), this.game.Flag.x + this.game.BLOCK_SIZE * 5, this.game.height - this.game.grassHeight - this.castleSize, this.castleSize, this.castleSize);
    }
}