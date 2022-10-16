
export class Sudoku {
    constructor(canvasRef) {
        this.canvas = canvasRef;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext('2d');
        this.height = this.canvas.height;
        this.width = this.canvas.width;
        this.padding = 10;
    }

    createGrid() {
        // Create Grid
        let cell_spacing = (this.width - this.padding * 2) / 9;
        for (let i = 0; i <= 9; i++) {
            this.ctx.beginPath();
            if (i % 3 == 0) {
                this.ctx.lineWidth = 3;
                this.ctx.strokeStyle = "black";
            }
            else {
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = "grey";
            }
            let line = this.padding + cell_spacing * i;
            // Horrizontal Lines
            this.ctx.moveTo(line, this.padding);
            this.ctx.lineTo(line, 600 - this.padding);
            // Vertical Lines
            this.ctx.moveTo(this.padding, line);
            this.ctx.lineTo(600 - this.padding, line);
            this.ctx.stroke();
        }
    }
}