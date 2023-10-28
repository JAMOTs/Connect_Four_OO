class Player {
    constructor(color) {
      this.color = color;
    }
  }
  
  class Game {
    constructor(height, width) {
      this.HEIGHT = height;
      this.WIDTH = width;
      this.players = [];
      this.currentPlayerIndex = 0;
      this.isGameOver = false;
      this.board = [];
      this.makeBoard();
      this.makeHtmlBoard();
    }
  
    makeBoard() {
      for (let y = 0; y < this.HEIGHT; y++) {
        this.board.push(Array.from({ length: this.WIDTH }));
      }
    }
  
    makeHtmlBoard() {
      const board = document.getElementById('board');
  
      // Clear the board
      board.innerHTML = '';
  
      // Create column tops (clickable areas for adding a piece to that column)
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');
      top.addEventListener('click', (evt) => this.handleClick(evt));
  
      for (let x = 0; x < this.WIDTH; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }
  
      board.append(top);
  
      // Create the main part of the board
      for (let y = 0; y < this.HEIGHT; y++) {
        const row = document.createElement('tr');
  
        for (let x = 0; x < this.WIDTH; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }
  
        board.append(row);
      }
    }
  
    findSpotForCol(x) {
      for (let y = this.HEIGHT - 1; y >= 0; y--) {
        if (!this.board[y][x]) {
          return y;
        }
      }
      return null; // Column is full
    }
  
    placeInTable(y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.classList.add(`p${this.currentPlayerIndex + 1}`);
      piece.style.top = -50 * (y + 2);
  
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
    }
  
    endGame(msg) {
      alert(msg);
      this.isGameOver = true;
    }
  
    handleClick(evt) {
      if (this.isGameOver) return;
  
      // Get x from ID of clicked cell
      const x = +evt.target.id;
  
      // Find the first available spot in the column
      const y = this.findSpotForCol(x);
      if (y === null) {
        return; // Column is full
      }
  
      // Update the board and HTML table
      this.board[y][x] = this.currentPlayerIndex + 1;
      this.placeInTable(y, x);
  
      // Check for a win
      if (this.checkForWin()) {
        this.endGame(`Player ${this.currentPlayerIndex + 1} won!`);
      } else {
        // Check for a tie
        if (this.board.every(row => row.every(cell => cell))) {
          this.endGame('Tie!');
        } else {
          // Switch players
          this.currentPlayerIndex = 1 - this.currentPlayerIndex;
        }
      }
    }
  
    checkForWin() {
      function _win(cells) {
        // Check if all cells in a given sequence belong to the same player
        return cells.every(([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currentPlayerIndex + 1
        );
      }
    
      for (let y = 0; y < this.HEIGHT; y++) {
        for (let x = 0; x < this.WIDTH; x++) {
          // Define possible winning sequences
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
    
          // Check for a win in any of the directions
          if (
            _win.call(this, horiz) ||
            _win.call(this, vert) ||
            _win.call(this, diagDR) ||
            _win.call(this, diagDL)
          ) {
            return true; // A player has won
          }
        }
      }
      return false; // No win condition met
    }
  
    startGame() {
      // Reset game state and board
      this.board = [];
      this.makeBoard();
      this.makeHtmlBoard();
      this.isGameOver = false;
  
      // Update player colors based on user input
      ui.updatePlayerColors();
  
      // Initialize currentPlayerIndex (player 1 starts)
      this.currentPlayerIndex = 0;
    }
  }
  
  class UI {
    constructor(game) {
      this.game = game;
      this.startButton = document.getElementById('start-game');
      this.startButton.addEventListener('click', () => this.game.startGame());
      this.p1ColorInput = document.getElementById('p1-color');
      this.p2ColorInput = document.getElementById('p2-color');
    }
  
    // Add a method to update player colors based on user input
    updatePlayerColors() {
      const p1Color = this.p1ColorInput.value || 'red';
      const p2Color = this.p2ColorInput.value || 'blue';
  
      // Set CSS variables for player colors
      document.documentElement.style.setProperty('--player-1-color', p1Color);
      document.documentElement.style.setProperty('--player-2-color', p2Color);
    }
  }
  
  // Usage
  const game = new Game(6, 7);
  const ui = new UI(game);
  