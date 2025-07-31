import { Player } from "./player.js";

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
            this.player = new Player(this);
        }

        update() {
            this.player.updatePlayer();
        }

        draw(context) {
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