const prompt = require('prompt-sync')();
// Constants to define the size of the game board
const ROWS = 8;
const COLS = 8;
const MINES = 10;

let winner = false;
let loser = false;

// A 2D array to represent the game board
const board = [];

// A 2D array to represent the hidden game board
const hiddenBoard = [];

// A 2D array to represent the visited cells
const checked = [];

// An object to keep track of the positions of mines on the board
const mines = [];

// Initialize the board, state, and place mines randomly

function startBoard() {
    for (let row = 0; row < ROWS; row++) {
        board[row] = [];
        hiddenBoard[row] = [];
        checked[row] = [];
        for (let col = 0; col < COLS; col++) {
            board[row][col] = 0;
            hiddenBoard[row][col] = "#"
            checked[row][col] = false;
        }
    }
}


function placeMines() {
    for (let i = 0; i <= MINES; i++) {
        let row = Math.floor(Math.random() * ROWS);
        let col = Math.floor(Math.random() * COLS);
        if (board[row][col] !== "*") {
            board[row][col] = "*";
            mines.push([row, col]);
        }
    }
}



function countMinesAroundCells() {
    // Populate the board with the number of mines around each cell
    for (let i = 0; i < mines.length; i++) {
        let row = mines[i][0];
        let col = mines[i][1];
        for (let r = Math.max(0, row - 1); r <= Math.min(row + 1, ROWS - 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(col + 1, COLS - 1); c++) {
                if (board[r][c] !== "*") {
                    board[r][c]++;
                }
            }
        }
    }
}

// Function to display the game board in the console
function displayBoard() {
    console.log("  " + [...Array(COLS).keys()].join(" "));
    for (let row = 0; row < ROWS; row++) {
        console.log(row + " " + hiddenBoard[row].join(" "));
    }
    console.log("\n");
}

function validCoordinates(row, col) {
    return (row >= 0 && row < ROWS && col >= 0 && col < COLS);
}

function checkWin() {
    let win = true;

    const uncheckedCoordinates = [];
    for (let row = 0; row < ROWS; row++){
        for (let col = 0; col < COLS; col++){
            if(!checked[row][col]) {
                uncheckedCoordinates.push({row, col});
            }
        }
    }

    for(const coordinate of uncheckedCoordinates) {
        if(board[coordinate.row][coordinate.col] !== "*") {
            win = false;
            break;
        }
    }

    return win;
}

function findUnchecked() {
    for (let row = 0; row < ROWS; row++){
        for (let col = 0; col < COLS; col++){
            if(!checked[row][col]) {
                return true;
            }
        }
    }

    return false;
}

function coordinateIsAlreadyChecked(row, col) {
    return checked[row][col];
}

function revealCell(row, col){
    if(!validCoordinates(row, col)) {
        return;
    }

    if(!findUnchecked()) {
        return;
    }

    if(coordinateIsAlreadyChecked(row, col)) {
        return;
    }

    hiddenBoard[row][col] = board[row][col];
    checked[row][col] = true;

    displayBoard();
    console.log("\n\n");

    if(checkWin()) {
        winner = true;
        console.log("You win");
        return;
    }

    if (board[row][col] === "*") {
        loser = true;
        console.log("You Lost");
        return;
    }

    if(board[row][col] !== 0) {
        return;
    }

    revealCell(row + 1, col);
    revealCell(row - 1, col);
    revealCell(row, col + 1);
    revealCell(row, col - 1);
}

function play() {
    startBoard();
    placeMines();
    countMinesAroundCells();
    displayBoard();

    while(!winner && !loser) {

        const row = parseInt(prompt('Select which row: '));
        const col = parseInt(prompt('Select which col: '));

        revealCell(row, col);
    }
}

play()

