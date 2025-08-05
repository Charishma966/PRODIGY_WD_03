const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');

let gameState = ["", "", "", "", "", "", "", "", ""];
let humanPlayer = "X";
let aiPlayer = "O";
let gameActive = true;

const winningConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createBoard() {
  board.innerHTML = "";
  gameState.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.setAttribute("data-index", index);
    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", handleHumanMove);
    board.appendChild(cellDiv);
  });
}

function handleHumanMove(e) {
  const index = e.target.getAttribute("data-index");

  if (gameState[index] !== "" || !gameActive) return;

  makeMove(index, humanPlayer);

  if (checkWinner(gameState, humanPlayer)) {
    endGame(`You win!`);
    return;
  }

  if (isDraw()) {
    endGame("It's a draw!");
    return;
  }

  // AI's turn
  const bestMove = minimax(gameState, aiPlayer).index;
  makeMove(bestMove, aiPlayer);

  if (checkWinner(gameState, aiPlayer)) {
    endGame("AI wins!");
    return;
  }

  if (isDraw()) {
    endGame("It's a draw!");
    return;
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  createBoard();
}

function isDraw() {
  return gameState.every(cell => cell !== "");
}

function endGame(message) {
  gameActive = false;
  statusText.textContent = message;
}

function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  statusText.textContent = "Your Turn (X)";
  createBoard();
}

resetBtn.addEventListener("click", resetGame);

// Check winner helper
function checkWinner(board, player) {
  return winningConditions.some(condition => {
    return condition.every(index => board[index] === player);
  });
}

// Minimax algorithm
function minimax(newBoard, player) {
  const emptyIndexes = newBoard
    .map((val, index) => val === "" ? index : null)
    .filter(val => val !== null);

  if (checkWinner(newBoard, humanPlayer)) {
    return { score: -10 };
  } else if (checkWinner(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (emptyIndexes.length === 0) {
    return { score: 0 };
  }

  let moves = [];

  for (let i = 0; i < emptyIndexes.length; i++) {
    let move = {};
    move.index = emptyIndexes[i];
    newBoard[emptyIndexes[i]] = player;

    if (player === aiPlayer) {
      let result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[emptyIndexes[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

createBoard();
statusText.textContent = "Your Turn (X)";
