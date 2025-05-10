const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const timer = document.getElementById('timer');
const newGameBtn = document.getElementById('newGameBtn');
const historyList = document.getElementById('historyList');

const inputPlayerX = document.getElementById('playerX');
const inputPlayerO = document.getElementById('playerO');

let currentPlayer = 'X';
let playerNames = { X: 'Jogador X', O: 'Jogador O' };
let gameActive = false;
let startTime = null;
let timerInterval = null;

const winCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function updateTimer() {
  if (!startTime) return;
  const now = Date.now();
  const diff = now - startTime;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startNewGame() {
  const nameX = inputPlayerX.value.trim();
  const nameO = inputPlayerO.value.trim();

  if (!nameX || !nameO) {
    alert("Por favor, insira os nomes dos dois jogadores.");
    return;
  }

  playerNames = { X: nameX, O: nameO };

  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
  });

  board.classList.add('game-active');
  gameActive = true;
  currentPlayer = 'X';
  status.textContent = `Vez de ${playerNames[currentPlayer]}`;

  startTime = Date.now();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
}

function endGame(winner = null) {
  gameActive = false;
  board.classList.remove('game-active');
  if (timerInterval) clearInterval(timerInterval);

  if (winner) {
    const li = document.createElement('li');
    li.textContent = `Último vencedor: ${playerNames[winner]}`;
    historyList.prepend(li);
  } else {
    const li = document.createElement('li');
    li.textContent = 'Última partida: Empate';
    historyList.prepend(li);
  }
}

function handleClick(e) {
  if (!gameActive) return;

  const cell = e.target;
  if (cell.textContent !== '') return;

  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());

  if (checkWin()) {
    status.textContent = `${playerNames[currentPlayer]} venceu!`;
    endGame(currentPlayer);
    return;
  }

  if (checkDraw()) {
    status.textContent = 'Empate!';
    endGame(null);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `Vez de ${playerNames[currentPlayer]}`;
}

function checkWin() {
  return winCombinations.some(combination => {
    return combination.every(index => {
      return cells[index].textContent === currentPlayer;
    });
  });
}

function checkDraw() {
  return [...cells].every(cell => cell.textContent !== '');
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
newGameBtn.addEventListener('click', startNewGame);

endGame(); // Inicialmente desativa o jogo
