import { Sudoku } from "./Sudoku.js"

const canvas = document.getElementById('board');
let sudoku = new Sudoku(canvas);
sudoku.buttonClick(9)
