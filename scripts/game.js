import { Player } from "./player.js";
import { Layer } from "./layer.js";
import { Grass, initalizeGrass } from './grass.js';
import { Block, initalizeWalls, getFlag } from './block.js';
import { Goomba, getGoombas } from './enemies.js'

window.addEventListener('load', () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;
    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;

    class Game {
        constructor(context) {
            this.BLOCK_SIZE = 50;
            this.width = context.width;
            this.height = context.height;
            this.grassHeight = 75;
            this.player = new Player(this);
            this.gameSpeed = 0;
            this.backGroundMultipler = 1;
            this.marioBackGround = new Layer(document.getElementById('mario-map-sky'), this, 427, 0);
            this.Grass = initalizeGrass(this);
            this.Walls = initalizeWalls(this.player, this);
            this.Goombas = getGoombas(this);
            this.Flag = getFlag();
            this.status = true;
            this.winImage;
            this.winX = this.Flag.x;
            this.winY = this.Flag.y + this.BLOCK_SIZE / 2;
            this.marioClimb1 = document.getElementById('mario-climb-1');
            this.marioClimb2 = document.getElementById('mario-climb-2');
        }

        updateGrass(context) {
            this.Grass.forEach(block => {
                block.x -= 5;
            })
            this.Walls.forEach((wall) => {
                wall.x -= 5;
            })
            this.Goombas.forEach((goomba) => {
                goomba.x -= 5;
            })

            this.Flag.playerWin(context);


        }

        update(context) {

            if (this.player.isMoving && Math.floor(this.player.x) >= Math.floor(this.width / 3)) {
                this.gameSpeed = 2;
                this.updateGrass(context);
            }
            else
                this.gameSpeed = 0;

            if (!this.player.winStatus && this.status)
                this.player.updatePlayer();


            this.Goombas.forEach((goomba) => {
                if (goomba.status && this.player.status) {
                    goomba.collision(this.player);
                    goomba.update();
                }
            });

            this.marioBackGround.updateBackGround(this.gameSpeed);

            this.Walls.forEach((wall) => {
                if (wall.type !== 'flag')
                    wall.collision(this.player);
            });



        }

        draw(context) {
            this.marioBackGround.drawBackGround(context);


            if (this.player.winStatus)
                this.marioWinAnimation(context);

            this.Walls.forEach((wall) => {
                if (wall.bumped) wall.luckyStarAnimation(context);
                wall.drawBlock(context);
            });


            this.Grass.forEach(block => {
                block.drawGrass(context);
            }
            )



            if (!this.player.winStatus) {
                if (this.player.status)
                    this.player.drawPlayer(context);
                else if (!this.player.status) {
                    this.player.marioDeathAnimation(context);
                }
            }

            this.Goombas.forEach((goomba) => {
                if (goomba.status && this.player.status) {
                    goomba.drawBlock(context);
                }
            });

        }

        marioWinAnimation(context) {
            if (this.winY < this.height - this.grassHeight - this.BLOCK_SIZE * 2) {
                this.winY += 0.5;
                this.marioClimbAnimation(context);
            }
        }

        marioClimbAnimation(context) {
            this.player.gameFrame++;
            if (!this.winImage) this.winImage = this.marioClimb1;
            if (this.player.gameFrame % 16 === 0) {
                if (this.winImage === this.marioClimb1) this.winImage = this.marioClimb2
                else this.winImage = this.marioClimb1
            }
            context.drawImage(this.winImage, this.Flag.x + this.BLOCK_SIZE / 2, this.winY, 50, 75);
        }

    }

    const newGame = new Game({
        width: canvasWidth,
        height: canvasHeight
    });

    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        if (newGame.status)
            newGame.update(ctx);
        newGame.draw(ctx);
        ctx.font = "32px 'Press Start 2P'";
        ctx.fillStyle = 'white';
        ctx.fillText('Score', 50, 50);
        requestAnimationFrame(animate);
    }

    animate();

})