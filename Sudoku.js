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
        this.permenantNum_font = `${this.cell_spacing/1.5}px Arial`;
        this.modifiableNum_font = `${this.cell_spacing/1.5}px Arial`;
        this.permenantNum_color = "black";
        this.modifiableNum_color = "grey"
        this.ctx.font = this.permenantNum_font;
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
        this.cellClick = this.cellClick.bind(this);
        this.canvas.addEventListener('mousedown', this.cellClick);
}

    createGrid() {
        for (let i = 0; i <= 9; i++) {
            this.ctx.beginPath();
            if (i % 3 == 0) {
                // Set every 3 lines bold
                this.ctx.lineWidth = 3;
                this.ctx.strokeStyle = this.permenantNum_color;
            }
            else {
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = this.modifiableNum_color;
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
                chosenCell.modifiable = true;
                minCellsToClear -= 1;
            }
        }
    }

    drawBoard() {
        this.clearBoard();
        this.createGrid();
        for (let cell_x = 0; cell_x < 9; cell_x++) {
            for (let cell_y = 0; cell_y < 9; cell_y++) {
                this.showCell(cell_x, cell_y);
            }
        }
    }

    showCell(cell_x, cell_y) {
        let currentCell = this.cells[cell_x][cell_y]
        let currentNum = currentCell.currentNum;
        if (currentCell.editMode == true) {
            let x = this.padding + this.cell_spacing * cell_x + this.cell_padding;
            let y = this.padding + this.cell_spacing * cell_y + this.cell_padding;
            let width = this.cell_spacing - this.cell_padding * 2;
            let height = this.cell_spacing - this.cell_padding * 2;
            this.ctx.fillStyle = "rgb(85, 219, 203)";
            this.ctx.fillRect(x, y, width, height);
            this.ctx.fillStyle = "black";
        }
        if (currentNum != 0) {
            if (currentCell.modifiable == true) {
                this.ctx.fillStyle = "grey";
            }
            else {
                this.ctx.fillStyle = "black"
            }
            let metrics = this.ctx.measureText(currentNum);
            let textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            let posX = this.padding + (this.cell_spacing / 2) + (this.cell_spacing * cell_x);
            let posY = this.padding + (this.cell_spacing / 2) + (this.cell_spacing * cell_y) - (textHeight / 2) + (this.cell_spacing * .05);

            this.ctx.fillText(currentNum, posX, posY);
        }
        this.ctx.fillStyle = "black";
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

    cellClick(event) {
        this.toggleCellsEditOff();
        this.drawBoard();
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
                // this.toggleCellEdit(cell_x, cell_y);
                currentCell.toggleCellEdit();
                if (currentCell.editMode == true) {
                    currentCell.keypress = currentCell.keypress.bind(currentCell);
                    document.addEventListener("keydown", currentCell.keypress, {once: true});
                    document.addEventListener("keydown", this.drawBoard.bind(this), {once: true});
                }
                this.drawBoard();
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
                if (currentCell.editMode == true) {
                    currentCell.toggleCellEdit();
                    currentCell.keypress = currentCell.keypress.bind(currentCell);
                    document.removeEventListener("keypress", currentCell.keypress, {once: true})
                }
            }
        }
        this.drawBoard();
    }

    toggleCellEdit(cell_x, cell_y) {
            let currentCell = this.cells[cell_x][cell_y];
            if (currentCell.editMode == false) {
                currentCell.editMode = true;
                this.drawBoard();
            }
            else {
                currentCell.editMode = false;
            }
    }

    get activeCell() {
        for (let cell_x = 0; cell_x < 9; cell_x++) {
            for (let cell_y = 0; cell_y < 9; cell_y++) {
                let currentCell = this.cells[cell_x][cell_y];
                if (currentCell.editMode == true) {
                    return currentCell;
                }
            }
        }
        this.drawBoard();
    }
}