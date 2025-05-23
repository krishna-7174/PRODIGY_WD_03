const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;

const winningCombinations = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== '' || !isGameActive) return;

  makeMove(index, 'X');
  if (checkEnd('X')) return;

  setTimeout(() => {
    const aiIndex = getAIMove();
    if (aiIndex !== undefined) {
      makeMove(aiIndex, 'O');
      checkEnd('O');
    }
  }, 200); // delay to simulate AI "thinking"
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add('taken');
}

function checkEnd(player) {
  if (checkWin(player)) {
    statusText.textContent = `${player} wins!`;
    isGameActive = false;
    return true;
  }
  if (board.every(cell => cell !== '')) {
    statusText.textContent = "It's a draw!";
    isGameActive = false;
    return true;
  }
  currentPlayer = player === 'X' ? 'O' : 'X';
  statusText.textContent = `Current Player: ${currentPlayer}`;
  return false;
}

function checkWin(player) {
  return winningCombinations.some(combo =>
    combo.every(index => board[index] === player)
  );
}

function getAIMove() {
  const difficulty = difficultySelect.value;

  if (difficulty === 'easy') {
    return getRandomMove();
  }

  if (difficulty === 'medium') {
    return Math.random() < 0.5 ? getRandomMove() : getBestMove();
  }

  return getBestMove(); // hard
}

function getRandomMove() {
  const available = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  if (available.length === 0) return;
  return available[Math.floor(Math.random() * available.length)];
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWin('O')) return 10 - depth;
  if (checkWin('X')) return depth - 10;
  if (newBoard.every(cell => cell !== '')) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === '') {
        newBoard[i] = 'O';
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === '') {
        newBoard[i] = 'X';
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function restartGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  isGameActive = true;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
  statusText.textContent = `Current Player: ${currentPlayer}`;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
