export class Grass {
    constructor(position, size, game) {
        this.game = game;
        this.singleGrassWidth = 50;
        this.width = size.width;
        this.height = size.height;
        this.x = position.x;
        this.y = position.y;
        this.grassImage = document.getElementById('mario-map-block');
    }

    drawGrass(context) {
        const GrassDrawn = Math.floor(this.width / this.singleGrassWidth);
        for (let i = 0; i < GrassDrawn; i++) {
            context.drawImage(this.grassImage, this.x + this.singleGrassWidth * i, this.y, 50, this.height);
        }
    }

    isOnGrass(target) {
        for (let i = 0; i < this.game.Grass.length - 1; i++) {
            if (this.game.Grass[i].x + this.game.Grass[i].width < target.x
                && this.game.Grass[i + 1].x > target.x + target.width
            )
                return false;
            else
                continue;
        }
    }
}

export function initalizeGrass(game) {
    let GrassArray = [];
    GrassArray.push(new Grass({ x: 0, y: game.height - 75 }, { width: game.width * 3, height: 75 }, game));
    GrassArray.push(new Grass({ x: GrassArray[GrassArray.length - 1].x + GrassArray[GrassArray.length - 1].width + 200, y: game.height - 75 }, { width: 1100, height: 75 }, game));
    GrassArray.push(new Grass({ x: GrassArray[GrassArray.length - 1].x + GrassArray[GrassArray.length - 1].width + 200, y: game.height - 75 }, { width: 1500 * 2 + 100, height: 75 }, game));
    GrassArray.push(new Grass({ x: GrassArray[GrassArray.length - 1].x + GrassArray[GrassArray.length - 1].width + 200, y: game.height - 75 }, { width: 1500 + 300, height: 75 }, game));
    GrassArray.push(new Grass({ x: GrassArray[GrassArray.length - 1].x + GrassArray[GrassArray.length - 1].width, y: game.height - 75 }, { width: 300, height: 75 }, game));

    return GrassArray;
}
