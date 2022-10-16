import { Sudoku } from "./Sudoku.js"
const canvas = document.getElementById('board');
let sudoku = new Sudoku(canvas);

sudoku.createGrid();

// const canvas = document.getElementById('board');
// /** @type {CanvasRenderingContext2D} */
// const ctx = canvas.getContext('2d');
// canvas.width = 600;
// canvas.height = 600;

// padding = 10;

// // Create Grid
// cell_spacing = (canvas.width - padding * 2) / 9
// for (let i = 0; i <= 9; i++) {
//     ctx.beginPath();
//     if (i % 3 == 0) {
//         ctx.lineWidth = 3;
//         ctx.strokeStyle = "black"
//     }
//     else {
//         ctx.lineWidth = 1;
//         ctx.strokeStyle = "grey"
//     }
//     let line = padding + cell_spacing * i
//     // Horrizontal Lines
//     ctx.moveTo(line, padding)
//     ctx.lineTo(line, 600 - padding)
//     // Vertical Lines
//     ctx.moveTo(padding, line)
//     ctx.lineTo(600 - padding, line)
//     ctx.stroke();
// }

// ctx.font = `${cell_spacing/1.5}px Arial`;
// let metrics = ctx.measureText('5');
// let height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
// ctx.textBaseline = "hanging";
// ctx.textAlign = 'center';
// let posX = (padding + cell_spacing / 2);
// let posY = (padding + cell_spacing / 2) - (height / 2) + 5;
// ctx.fillText('5', posX, posY);