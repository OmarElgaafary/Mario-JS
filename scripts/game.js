import { Player } from "./player.js";
import { Layer } from "./layer.js";
import { Block } from './block.js';
window.addEventListener('load', () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;
    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;

    class Game {
        constructor(context) {
            this.width = context.width;
            this.height = context.height;
            this.grassHeight = 75;
            this.player = new Player(this);
            this.gameSpeed = 0;
            this.backGroundMultipler = 1;
            this.marioBackGround = new Layer(document.getElementById('mario-map-sky'), this, 427, 0);
            this.Blocks = [];
            this.block1 = this.Blocks.push(new Block({ x: 0, y: this.height - 75 }, { width: this.width * 3, height: 75 }, this));
            this.block2 = this.Blocks.push(new Block({ x: this.Blocks[this.Blocks.length - 1].x + this.Blocks[this.Blocks.length - 1].width + 200, y: this.height - 75 }, { width: 1500, height: 75 }, this));
            this.block3 = this.Blocks.push(new Block({ x: this.Blocks[this.Blocks.length - 1].x + this.Blocks[this.Blocks.length - 1].width + 200, y: this.height - 75 }, { width: 1500, height: 75 }, this));
        }

        updateBlocks() {
            this.Blocks.forEach(block => {
                block.x -= 5;
            })
        }

        update() {
            if (this.player.isMoving && this.player.x === this.width / 3) {
                this.gameSpeed = 2;
                this.updateBlocks();
            }
            else
                this.gameSpeed = 0;

            this.player.updatePlayer();
            this.marioBackGround.updateBackGround(this.gameSpeed);
            console.log(this.player.y);
        }

        draw(context) {
            this.marioBackGround.drawBackGround(context);
            this.player.drawPlayer(context);
            this.Blocks.forEach(block => {
                block.drawBlock(context);
            }
            )
        }

    }

    const newGame = new Game({
        width: canvasWidth,
        height: canvasHeight
    });

    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        newGame.update();
        newGame.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate();

})