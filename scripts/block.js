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

export function initalizeBlocks(game) {
    let Blocks = [];
    Blocks.push(new Block({ x: 0, y: game.height - 75 }, { width: game.width * 3, height: 75 }, game));
    Blocks.push(new Block({ x: Blocks[Blocks.length - 1].x + Blocks[Blocks.length - 1].width + 200, y: game.height - 75 }, { width: 1500, height: 75 }, game));
    Blocks.push(new Block({ x: Blocks[Blocks.length - 1].x + Blocks[Blocks.length - 1].width, y: game.height - 75 }, { width: 1500, height: 75 }, game));
    Blocks.push(new Block({ x: Blocks[Blocks.length - 1].x + Blocks[Blocks.length - 1].width, y: game.height - 75 }, { width: 1500, height: 75 }, game));
    Blocks.push(new Block({ x: Blocks[Blocks.length - 1].x + Blocks[Blocks.length - 1].width + 200, y: game.height - 75 }, { width: 1500, height: 75 }, game));
    Blocks.push(new Block({ x: Blocks[Blocks.length - 1].x + Blocks[Blocks.length - 1].width, y: game.height - 75 }, { width: 1500, height: 75 }, game));
    Blocks.push(new Block({ x: Blocks[Blocks.length - 1].x + Blocks[Blocks.length - 1].width, y: game.height - 75 }, { width: 1500, height: 75 }, game));


    return Blocks;
}
