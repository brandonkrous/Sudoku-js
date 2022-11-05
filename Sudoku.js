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
        // Create multidirection array to represent a sudoku puzzle
        this.cells = new Array(9);
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i] = new Array(9);
        }
        this.cell_padding = 5;
        this.initializeCells();
        this.buildBoard();
        this.buildPuzzle();
        this.drawBoard();
        this.canvas.addEventListener('mousedown', (e) => this.cellClick(e));
}

    createGrid() {
        for (let i = 0; i <= 9; i++) {
            this.ctx.beginPath();
            if (i % 3 == 0) {
                // Set every 3 lines bold
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
        // Generate Cell object for each cell in Cells
        for (let cell_x = 0; cell_x < 9; cell_x++) {
            for (let cell_y = 0; cell_y < 9; cell_y++) {
                this.cells[cell_x][cell_y] = new Cell(cell_x, cell_y, this);
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

            let result = currentCell.tryPickNum(this); // If a num available, result = true
            if (result) {
                try {
                    // Look forward. Is it end of board?
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
                chosenCell.modifiable = true;
                minCellsToClear -= 1;
            }
        }
    }

    drawBoard() {
        // Use Canvas to wipe and re-draw lines and numbers
        this.clearBoard();
        this.createGrid();
        for (let cell_x = 0; cell_x < 9; cell_x++) {
            for (let cell_y = 0; cell_y < 9; cell_y++) {
                this.showCell(cell_x, cell_y);
            }
        }
    }

    showCell(cell_x, cell_y) {
        // Display each cells current number
        let currentNum = this.cells[cell_x][cell_y].currentNum;
        let currentCell = this.cells[cell_x][cell_y]
        if (currentCell.editMode == true) {
            // Add editMode look to cell
            let x = this.padding + this.cell_spacing * cell_x + this.cell_padding;
            let y = this.padding + this.cell_spacing * cell_y + this.cell_padding;
            let width = this.cell_spacing - this.cell_padding * 2;
            let height = this.cell_spacing - this.cell_padding * 2;
            this.ctx.fillStyle = "rgb(85, 219, 203)";
            this.ctx.fillRect(x, y, width, height);
            this.ctx.fillStyle = "black";
        }
        if (currentNum != 0) {
            let metrics = this.ctx.measureText(currentNum);
            let textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            let posX = this.padding + (this.cell_spacing / 2) + (this.cell_spacing * cell_x);
            let posY = this.padding + (this.cell_spacing / 2) + (this.cell_spacing * cell_y) - (textHeight / 2) + (this.cell_spacing * .05);

            this.ctx.fillText(currentNum, posX, posY);
        }
        this.ctx.stroke();
    }

    clearCell(cell_x, cell_y) {
        let x = this.padding + this.cell_spacing * cell_x + this.cell_padding;
        let y = this.padding + this.cell_spacing * cell_y + this.cell_padding;
        let width = this.cell_spacing - this.cell_padding * 2;
        let height = this.cell_spacing - this.cell_padding * 2;

        this.ctx.clearRect(x, y, width, height);
    }

    clearBoard() {
        let canvasSize = this.canvas.getBoundingClientRect();
        let x = this.padding;
        let y = this.padding;
        let width = canvasSize.width - this.padding * 2;
        let height = canvasSize.height - this.padding * 2;
        this.ctx.clearRect(x, y, width, height)
    }

    keypress(event) {
        let activeCell;
        let currentCell;
        for (let cell_x = 0; cell_x < 9; cell_x++) {
            for (let cell_y = 0; cell_y < 9; cell_y++) {
               currentCell = this.cells[cell_x][cell_y];
               if (currentCell.editMode == true) {
                activeCell = currentCell;
                break
               }
            }
        }
        console.log(activeCell);
    }

    cellClick(event) {
        let canvasSize = this.canvas.getBoundingClientRect();
        let x = event.clientX - canvasSize.left;
        let y = event.clientY - canvasSize.top;
        if (
            x > this.padding && x < this.width - this.padding &&
            y > this.padding && y < this.height - this.padding
        ) {
            let [cell_x, cell_y] = this.coordToCell(x, y);
            let currentCell = this.cells[cell_x][cell_y];
            if (currentCell.modifiable == true) {
                this.toggleCellsEditOff();
                currentCell.toggleCellEdit();
                this.drawBoard();
                document.addEventListener("keypress", currentCell.keypress.bind(currentCell), {once: true}); 
            }
        }
    }

    coordToCell(x, y) {
        if (
            x > this.padding && x < this.width - this.padding &&
            y > this.padding && y < this.height - this.padding
        ) {
            let [collumn_x, collumn_y] = [0, 0]
            let [start_x, start_y] = [this.padding, this.padding]
            while (start_x < x) {
                start_x += this.cell_spacing;
                collumn_x++;
            }
            while(start_y < y) {
                start_y += this.cell_spacing;
                collumn_y++;
            }
            return [collumn_x - 1, collumn_y - 1];
        }
    }

    toggleCellsEditOff() {
        for (let cell_x = 0; cell_x < 9; cell_x++) {
            for (let cell_y = 0; cell_y < 9; cell_y++) {
                let currentCell = this.cells[cell_x][cell_y];
                currentCell.editMode = false;
            }
        }
        this.drawBoard();
    }

}