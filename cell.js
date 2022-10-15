

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
    isValid(originCell, num) {
        return
    }
    addNum(num) {
        return
    }
    removeNum(num) {
        return
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