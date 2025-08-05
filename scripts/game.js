import { Player } from "./player.js";
import { Layer } from "./layer.js";
import { Grass, initalizeGrass } from './grass.js';
import { Block, initalizeWalls } from './block.js';

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
            this.Grass = initalizeGrass(this);
            this.Walls = initalizeWalls(this.player, this);
        }

        updateGrass() {
            this.Grass.forEach(block => {
                block.x -= 5;
            })
            this.Walls.forEach((wall) => {
                wall.x -= 5;
            })
        }

        update() {
            this.player.updatePlayer();
            this.marioBackGround.updateBackGround(this.gameSpeed);

            this.Walls.forEach((wall) => {
                wall.collision();
            });
            if (this.player.isMoving && Math.floor(this.player.x) >= Math.floor(this.width / 3)) {
                this.gameSpeed = 2;
                this.updateGrass();
            }
            else
                this.gameSpeed = 0;


        }

        draw(context) {
            this.marioBackGround.drawBackGround(context);
            this.player.drawPlayer(context);
            this.Grass.forEach(block => {
                block.drawGrass(context);
            }
            )
            this.Walls.forEach((wall) => {
                if (wall.bumped) wall.luckyStarAnimation(context);
                wall.drawBlock(context);
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