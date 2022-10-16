import { Cell } from "./Cell.js";

export class Sudoku {
    constructor(canvasRef) {
        this.canvas = canvasRef;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext('2d');
        this.height = this.canvas.height;
        this.width = this.canvas.width;
        this.padding = this.width * .02;
        // Create multidirection array to represent sudoku
        this.cells = new Array(9);
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i] = new Array(9);
        }
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
            this.ctx.lineTo(line, this.width - this.padding);
            // Vertical Lines
            this.ctx.moveTo(this.padding, line);
            this.ctx.lineTo(this.width - this.padding, line);
            this.ctx.stroke();
        }
    }

    initializeCells() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                this.cells[x][y] = new Cell(x, y, this.cells);
            }
        }
    }
}