/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  board = Array(HEIGHT).fill(null).map(()=>Array(WIDTH).fill(null))
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {

  const htmlBoard = document.querySelector("#board");

  //Creates the column-top row and adds a click event listener to it
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //Creates cells for the header with an ID from 0 to WIDTH-1 and then places them on the DOM
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  //Creates the cells for the rest of the game board with an ID of its x,y coordinate and then places it on the DOM by table row
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let i=HEIGHT-1; i > -1; i--) {
    if(board[i][x] === null) {
      return i;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const placedPiece = document.createElement("div");
  placedPiece.classList = `piece p${currPlayer}`;
  const placedDestination = document.querySelector(`[id='${y}-${x}']`);
  placedDestination.appendChild(placedPiece);
}

/** endGame: announce game end after pausing to allow piece placement to catch up */
function endGame(msg) {
  setTimeout(() => {alert(msg)},500);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);

  //places string into board array (in-game memory)
  placeInBoardArray(y, x);

  //calls check for win and displays which color player won
  if (checkForWin()) {
    const winMessage = currPlayer === 1 ? "Red" : "Blue";
    return endGame(`${winMessage} wins!`);
  }

  //switches between players 1 and 2 after each click
  switchPlayers();

  
  // check for tie
  if(checkForTie()) {
    setTimeout(() => {alert("You tied!")},300);
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    
    // Check four cells to see if they're all color of current player
    //  - cells: array of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //this nested for loop allows the checking of the array matrix data from 0,0 to HEIGHT,WIDTH 
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      
      //builds left to right game piece series
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];

      //builds top to bottom game piece series
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];

      //builds right and down diagonal game piece series
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      //builds right and up diagonal game piece series
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      //runs all 4 game piece series cases through _win function and returns true if any of the four cases is true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

/**switches between players 1 and 2 after each click*/
function switchPlayers() {
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/**places string into board array (in-game memory)*/
function placeInBoardArray (y, x) {
board[y][x] = currPlayer;
}

/**check for tie*/
function checkForTie () {
 for (let i=0; i < board[0].length; i++) {
   if(board[0][i] === 1 || board[0][i] === 2) {
   } else return
 }
 return true;
}

makeBoard();
makeHtmlBoard();

//Adds a button to reload the page which starts a new game
const newGameButton = document.querySelector('[name="newGame"]');
newGameButton.addEventListener("click", function() {
  location.reload();
  });