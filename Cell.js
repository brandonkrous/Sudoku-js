export class Cell {
    constructor(x_coord, y_coord) {
        this.x_coord = x_coord;
        this.y_coord = y_coord;
        this.availableNums = [1,2,3,4,5,6,7,8,9];
        this.triedNums = [];
        this.currentNum = 0;
    }

    tryPickNum(sudokuObj) {
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
            this.notifyRemove(sudokuObj, this.currentNum);
        }
        return true;
    }

    isValid(callingCell, sudokuObj, num) {
        // Check Row
        for (let x = 0; x <= callingCell.x_coord; x++) {
            let cell = sudokuObj.cells[x][this.y_coord];
            if (cell != callingCell) { // skip cell that called this function
                if (cell.currentNum == num) {
                    return false
                }
            }
        }

        // Check column
        for (let y = 0; y < 9; y++) {
            let cell = sudokuObj.cells[this.x_coord][y];
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
                cell = sudokuObj.cells[startX + x][startY + y];
                if (cell != callingCell) {
                    if (cell.currentNum == num) {
                        return false
                    }
                }
            }
        }
        return true
    }

    addNum(callingCell, sudokuObj, num) {
        if (this.isValid(callingCell, sudokuObj, num)) {
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

    notifyAdd(sudokuObj, num) {
        // Notify row
        for (let x = 0; x < 9; x++) {
            sudokuObj.cells[x][this.y_coord].addNum(this, sudokuObj, num);
        }

        // Notify collumn
        for (let y = 0; y < 9; y++) {
            sudokuObj.cells[this.x_coord][y].addNum(this, sudokuObj, num);
        }

        // Notify box
        let [startX, startY] = this.topLeftCell();
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                sudokuObj.cells[startX + x][startY + y].addNum(this, sudokuObj, num);
            }
        }
    }

    notifyRemove(sudokuObj, num) {
        // Notify row
        for (let x = 0; x < 9; x++) {
            sudokuObj.cells[x][this.y_coord].removeNum(num);
        }

        // Notify collumn
        for (let y = 0; y < 9; y++) {
            sudokuObj.cells[this.x_coord][y].removeNum(num);
        }

        // Notify box
        let [startX, startY] = this.topLeftCell();
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                sudokuObj.cells[startX + x][startY + y].removeNum(num);
            }
        }

    }

    topLeftCell() {
        let [workingX, workingY] = [this.x_coord, this.y_coord];

        while (workingX % 3 != 0) {
            workingX -= 1;
        }

        while (workingY % 3 != 0) {
            workingY -= 1
        }

        return [workingX, workingY];
    }

    nextCell() {
        let [workingX, workingY] = [this.x_coord, this.y_coord];

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
        let [workingX, workingY] = [this.x_coord, this.y_coord];
    
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

    undo(sudokuObj) {
        let [nextX, nextY] = this.nextCell();
        let nextCell = sudokuObj.cells[nextX][nextY];
        nextCell.clearTried();
        this.notifyAdd(sudokuObj, this.currentNum);
        this.triedNums.push(this.currentNum);
        this.currentNum = 0
    }
}