import { Cell } from "./Cell.js";

export class Sudoku {
    constructor(canvasRef) {
        this.canvas = canvasRef;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext('2d');
        this.height = this.canvas.height;
        this.width = this.canvas.width;
        this.padding = this.width * .02;
        this.cell_spacing = (this.width - this.padding * 2) / 9;
        this.ctx.font = `${this.cell_spacing/1.5}px Arial`;
        this.ctx.textBaseline = "hanging";
        this.ctx.textAlign = 'center';
        // Create multidirection array to represent sudoku
        this.cells = new Array(9);
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i] = new Array(9);
        }
        this.createGrid();
        this.initializeCells();
        this.buildBoard();
        this.buildPuzzle();
        this.displayBoard();
}

    createGrid() {
        // Create Grid
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
            let line = this.padding + this.cell_spacing * i;
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
                this.cells[x][y] = new Cell(x, y, this);
            }
        }
    }

    buildBoard() {
        // Loop each cell; Pick valid number
        let endOfBoard = false;
        let [currentX, currentY] = [0, 0];
        while (!endOfBoard) {
            let currentCell = this.cells[currentX][currentY];
            let [previousX, previousY] = currentCell.previousCell();
            let previousCell = this.cells[previousX][previousY];

            let result = currentCell.tryPickNum(this);
            if (result) {
                try {
                    [currentX, currentY] = currentCell.nextCell();
                }
                catch (error) {
                    endOfBoard = true;
                }
            }
            else {
                this.clearCell(previousX, previousY)
                previousCell.undo(this);
                [currentX, currentY] = [previousX, previousY];
            }
        }
    }

    buildPuzzle() {
        let minCellsToClear = 50;
        while (minCellsToClear > 0) {
            // Remove random cell number
            let randomX = Math.floor(Math.random() * 9);
            let randomY = Math.floor(Math.random() * 9);
            let chosenCell = this.cells[randomX][randomY];
            let num = chosenCell.currentNum;
            if (num != 0) {
                chosenCell.notifyAdd(num);
                chosenCell.currentNum = 0;
                minCellsToClear -= 1;
            }
        }
    }

    displayBoard() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                this.showCell(x, y);
            }
        }
    }

    showCell(x_coord, y_coord) {
        let currentNum = this.cells[x_coord][y_coord].currentNum;
        if (currentNum != 0) {
            let metrics = this.ctx.measureText(currentNum);
            let textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            let posX = this.padding + (this.cell_spacing / 2) + (this.cell_spacing * x_coord);
            let posY = this.padding + (this.cell_spacing / 2) + (this.cell_spacing * y_coord) - (textHeight / 2);

            this.ctx.fillText(currentNum, posX, posY);
        }
    }

    clearCell(x_coord, y_coord) {
        let cell_padding = 5;
        let x = this.padding + this.cell_spacing * x_coord + cell_padding;
        let y = this.padding + this.cell_spacing * y_coord + cell_padding;
        let width = this.cell_spacing - cell_padding * 2;
        let height = this.cell_spacing - cell_padding * 2;

        this.ctx.clearRect(x, y, width, height);
    }

}