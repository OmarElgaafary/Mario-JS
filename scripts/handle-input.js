export class HandleInput {
    constructor(player) {
        this.player = player
        this.keys = [];
        this.lastkey = 'ArrowRight';
        this.direction = { x: 1 };
        window.addEventListener('keydown', (e) => {
            if ((e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight'
            ) && !this.keys.includes(e.key) && player.status) {
                if (this.keys.length > 0) this.keys = [];
                this.keys.push(e.key);
                this.lastkey = e.key;
                if (e.key === 'ArrowRight') this.direction = { x: 1 };
                else if (e.key === 'ArrowLeft') this.direction = { x: -1 };
            }
            else if (e.key === ' ' && !this.keys.includes('Space')) {
                this.keys.push('Space');
            }

        })

        window.addEventListener('keyup', (e) => {
            if ((e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight') && this.keys.includes(e.key) && player.status) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
            else if (e.key === ' ' && this.keys.includes('Space'))
                this.keys.splice(this.keys.indexOf('Space'), 1);
        })
    }
}