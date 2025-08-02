import { Player } from "./player.js";
import { Layer } from './layer.js'
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
            this.marioGrass = new Layer(document.getElementById('mario-map-grass'), this, this.grassHeight, this.height - this.grassHeight);
            this.marioBackGround = new Layer(document.getElementById('mario-map-background'), this, 427, 0);
        }

        update() {
            this.gameSpeed = this.player.isMoving ? 1 : 0;
            this.player.updatePlayer();
            this.marioGrass.updateBackGround(this.gameSpeed);
            this.marioBackGround.updateBackGround(this.gameSpeed);
        }

        draw(context) {
            this.marioGrass.drawBackGround(context);
            this.marioBackGround.drawBackGround(context);
            this.player.drawPlayer(context);

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