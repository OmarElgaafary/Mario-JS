export class Block {
    constructor(position, size, game) {
        this.game = game;
        this.singleBlockWidth = 50;
        this.width = size.width;
        this.height = size.height;
        this.x = position.x;
        this.y = position.y;
        this.grassImage = document.getElementById('mario-map-block');
    }

    drawBlock(context) {
        const blocksDrawn = Math.floor(this.width / this.singleBlockWidth);
        for (let i = 0; i < blocksDrawn; i++) {
            context.drawImage(this.grassImage, this.x + this.singleBlockWidth * i, this.y, 50, this.height);
        }
    }

    isOnGrass() {
        for (let i = 0; i < this.game.Blocks.length - 1; i++) {
            if (this.game.Blocks[i].x + this.game.Blocks[i].width < this.game.player.x
                && this.game.Blocks[i + 1].x > this.game.player.x + this.game.player.width
            )
                return true;
            else
                continue;
        }
    }
}