export class Cell {
    constructor(cell_x, cell_y, sudokuObj) {
        this.cell_x = cell_x;
        this.cell_y = cell_y;
        this.availableNums = [1,2,3,4,5,6,7,8,9];
        this.triedNums = [];
        this.currentNum = 0;
        this.cells = sudokuObj.cells
        this.editMode = false;
        this.modifiable = false;
    }

    tryPickNum() {
        // Remove triedNums from availableNums
        let tempAvailableNums = [...this.availableNums];
        for (let num in this.availableNums) {
            if (num in this.triedNums) {
                let index = tempAvailableNums.indexOf(num);
                tempAvailableNums.splice(index, 1);
            }
        }
        if (tempAvailableNums.length <= 0) { // No numbers available
            return false
        }
        else {
            let randIndex = Math.floor(Math.random() * (tempAvailableNums.length));
            this.currentNum = tempAvailableNums[randIndex];
            this.notifyRemove(this.currentNum);
        }
        return true;
    }

    isValid(callingCell, num) {
        // Check Row
        for (let x = 0; x <= callingCell.cell_x; x++) {
            let cell = this.cells[x][this.cell_y];
            if (cell != callingCell) { // skip cell that called this function
                if (cell.currentNum == num) {
                    return false
                }
            }
        }

        // Check column
        for (let y = 0; y < 9; y++) {
            let cell = this.cells[this.cell_x][y];
            if (cell != callingCell) {
                if (cell.currentNum == num) {
                    return false
                }
            }
        }
        
        // Check box
        let [startX, startY] = this.topLeftCell();
        let cell
        for (let x = 0; x < 3; x++){
            for (let y = 0; y < 3; y++) {
                cell = this.cells[startX + x][startY + y];
                if (cell != callingCell) {
                    if (cell.currentNum == num) {
                        return false
                    }
                }
            }
        }
        return true
    }

    addNum(callingCell, num) {
        if (this.isValid(callingCell, num)) {
            let index = this.availableNums.indexOf(num)
            if (index == -1) {
                this.availableNums.push(num);
            }
        }
    }

    removeNum(num) {
        let index = this.availableNums.indexOf(num);
        if (index > -1) {
            this.availableNums.splice(index, 1);
        }
    }

    notifyAdd(num) {
        // Notify row
        for (let x = 0; x < 9; x++) {
            this.cells[x][this.cell_y].addNum(this, num);
        }

        // Notify collumn
        for (let y = 0; y < 9; y++) {
            this.cells[this.cell_x][y].addNum(this, num);
        }

        // Notify box
        let [startX, startY] = this.topLeftCell();
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                this.cells[startX + x][startY + y].addNum(this, num);
            }
        }
    }

    notifyRemove(num) {
        // Notify row
        for (let x = 0; x < 9; x++) {
            this.cells[x][this.cell_y].removeNum(num);
        }

        // Notify collumn
        for (let y = 0; y < 9; y++) {
            this.cells[this.cell_x][y].removeNum(num);
        }

        // Notify box
        let [startX, startY] = this.topLeftCell();
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                this.cells[startX + x][startY + y].removeNum(num);
            }
        }

    }

    topLeftCell() {
        let [workingX, workingY] = [this.cell_x, this.cell_y];

        while (workingX % 3 != 0) {
            workingX -= 1;
        }

        while (workingY % 3 != 0) {
            workingY -= 1
        }

        return [workingX, workingY];
    }

    nextCell() {
        let [workingX, workingY] = [this.cell_x, this.cell_y];

        if (workingY == 8 && workingX < 8) {
            workingY = 0;
            workingX += 1;
        }
        else if (workingY < 8) {
            workingY += 1;
        }
        else {
            throw 'End Of Board Reached'
        }
        
        return [workingX, workingY];
    }

    previousCell() {
        let [workingX, workingY] = [this.cell_x, this.cell_y];
    
        if (workingY == 0 && workingX != 0) {
            workingX -= 1;
            workingY = 8;
        }
        else if (workingY > 0) {
            workingY -= 1
        }

        return [workingX, workingY];
    }

    clearTried() {
        this.triedNums = [];
    }

    undo() {
        let [nextX, nextY] = this.nextCell();
        let nextCell = this.cells[nextX][nextY];
        nextCell.clearTried();
        this.notifyAdd(this.currentNum);
        this.triedNums.push(this.currentNum);
        this.currentNum = 0
    }

    keypress(event) {
        console.log(event.key);
        if (event.key == "Backspace") {
            this.currentNum = 0;
            this.editMode = false;
        }
        else if (
            parseInt(event.key) != NaN &&
            this.editMode == true
            ) {
            this.currentNum = parseInt(event.key);
            this.editMode = false;
        }
    }

    toggleCellEdit() {
        if (this.editMode == false) {
            this.editMode = true;
        }
        else {
            this.editMode = false;
        }
    }
}