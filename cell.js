

export class Cell {
    constructor(x_coord, y_coord, cells) {
        this.x_coord = x_coord;
        this.y_coord = y_coord;
        this.cells = cells;
        this.availableNums = [1,2,3,4,5,6,7,8,9];
        this.triedNums = [];
        this.currentNum = 0;
    }

    tryPickNum() {
        // Remove triedNums from availableNums
        tempAvailableNums = [...this.availableNums];
        for (num in this.availableNums) {
            if (num in this.triedNums) {
                let index = tempAvailableNums.indexOf(num);
                tempAvailableNums.splice(index, 1);
            }
        }
        if (tempAvailableNums.length <= 0) { // No numbers available
            return false
        }
        else {
            let randIndex = Math.random() * (tempAvailableNums.length - 1);
            this.currentNum = tempAvailableNums[randIndex];
            this.notifyRemove(this.currentNum);
        }
        return true;
    }

    isValid(callingCell, num) {
        // Check Row
        for (let x = 0; x <= callingCell.x_coord; x++) {
            let cell = this.cells[x][this.y_coord];
            if (cell != callingCell) { // skip cell that called this function
                if (cell.currentNum == num) {
                    return false
                }
            }
        }

        // Check column
        for (let y = 0; y < 9; y++) {
            let cell = this.cells[this.x_coord][y];
            if (cell != callingCell) {
                if (cell.currentNum == num) {
                    return false
                }
            }
        }
        
        // Check box
        let startX = this.topLeftCell()[0];
        let startY = this.topLeftCell()[1];
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
            if (not(num in this.availableNums)) {
                this.availableNums.push(num);
            }
        }
    }

    removeNum(num) {
        if (num in this.availableNums) {
            this.availableNums.splice(this.availableNums.indexOf(num), 1);
        }
    }

    notifyAdd(num) {
        return
    }
    notifyRemove(num) {

    }
    topLeftCell() {
        return
    }
    nextCell() {
        return
    }
    previousCell() {
        return
    }
    clearTried() {
        return
    }
    undo() {
        return
    }
}