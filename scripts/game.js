import { Player } from "./player.js";
import { Layer } from "./layer.js";
import { Block, initalizeBlocks } from './block.js';
import { Wall, LuckyBlock, initalizeWalls } from './walls.js';

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
            this.Blocks = initalizeBlocks(this);
            this.Walls = initalizeWalls(this.player, this);
        }

        updateBlocks() {
            this.Blocks.forEach(block => {
                block.x -= 5;
            })
            this.Walls.forEach((wall) => {
                wall.x -= 5;
            })
        }

        update() {
            this.Walls.forEach((wall) => {
                wall.collision();
            });
            if (this.player.isMoving && this.player.x === this.width / 3) {
                this.gameSpeed = 2;
                this.updateBlocks();
            }
            else
                this.gameSpeed = 0;

            this.player.updatePlayer();
            this.marioBackGround.updateBackGround(this.gameSpeed);
        }

        draw(context) {
            this.marioBackGround.drawBackGround(context);
            this.player.drawPlayer(context);
            this.Blocks.forEach(block => {
                block.drawBlock(context);
            }
            )
            this.Walls.forEach((wall) => {
                if (wall.bumped) wall.luckyStarAnimation(context);
                wall.drawWall(context);
            });
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
        ctx.font = "32px 'Press Start 2P'";
        ctx.fillStyle = 'white';
        ctx.fillText('Score', 50, 50);
        requestAnimationFrame(animate);
    }

    animate();

})