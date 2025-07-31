export class HandleInput {
    constructor() {
        this.keys = [];
        this.lastkey = 'ArrowRight';
        window.addEventListener('keydown', (e) => {
            if ((e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight'
            ) && !this.keys.includes(e.key)) {
                if (this.keys.length > 0) this.keys = [];
                this.keys.push(e.key);
                this.lastkey = e.key;
            }
            else if (e.key === ' ' && !this.keys.includes('Space')) {
                this.keys.push('Space');
            }

        })

        window.addEventListener('keyup', (e) => {
            if ((e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight') && this.keys.includes(e.key)) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
                console.log(e.key);
            }
            else if (e.key === ' ' && this.keys.includes('Space'))
                this.keys.splice(this.keys.indexOf('Space'), 1);
        })
    }
}