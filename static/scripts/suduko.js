class SudokuGame {
    constructor() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.timer = 0;
        this.timerInterval = null;
        this.score = 0;
        this.mistakes = 0;
        this.maxMistakes = 3;
        this.difficulty = 'easy';
        this.gameStarted = false;
        this.gameCompleted = false;

        this.initializeElements();
        this.attachEventListeners();
        this.loadHighScores();
        this.generateNewPuzzle();
    }

    initializeElements() {
        this.gridElement = document.getElementById('sudoku-grid');
        this.timerElement = document.getElementById('timer');
        this.scoreElement = document.getElementById('score');
        this.mistakesElement = document.getElementById('mistakes');
        this.highScoresElement = document.getElementById('high-scores-list');

        this.createGrid();
    }

    createGrid() {
        this.gridElement.innerHTML = '';
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.className = 'cell';
            cell.maxLength = 1;
            cell.dataset.index = i;
            this.gridElement.appendChild(cell);
        }
    }

    attachEventListeners() {
        // Grid cell clicks
        this.gridElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                this.selectCell(e.target);
            }
        });

        // Number pad
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const number = e.target.dataset.number;
                this.inputNumber(number);
            });
        });

        // Action buttons
        document.getElementById('clear-btn').addEventListener('click', () => this.clearCell());
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.getElementById('hint-btn').addEventListener('click', () => this.giveHint());
        document.getElementById('check-btn').addEventListener('click', () => this.checkSolution());
        document.getElementById('solve-btn').addEventListener('click', () => this.solvePuzzle());

        // Difficulty selector
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.difficulty = e.target.dataset.difficulty;
                this.newGame();
            });
        });

        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '9') {
                this.inputNumber(e.key);
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                this.clearCell();
            }
        });
    }

    generateNewPuzzle() {
        // Generate a complete valid Sudoku solution
        this.solution = this.generateCompleteSudoku();

        // Create puzzle by removing numbers based on difficulty
        this.grid = this.solution.map(row => [...row]);
        const cellsToRemove = this.getCellsToRemove();

        const positions = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                positions.push([i, j]);
            }
        }

        // Shuffle positions
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }

        // Remove numbers
        for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
            const [row, col] = positions[i];
            this.grid[row][col] = 0;
        }

        this.updateDisplay();
    }

    generateCompleteSudoku() {
        const grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solveSudoku(grid);
        return grid;
    }

    solveSudoku(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    // Shuffle numbers for randomness
                    for (let i = numbers.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
                    }

                    for (const num of numbers) {
                        if (this.isValidMove(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (this.solveSudoku(grid)) {
                                return true;
                            }
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    getCellsToRemove() {
        switch (this.difficulty) {
            case 'easy':
                return 40;
            case 'medium':
                return 50;
            case 'hard':
                return 60;
            default:
                return 40;
        }
    }

    updateDisplay() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = this.grid[row][col];

            cell.value = value === 0 ? '' : value;
            cell.classList.remove('given', 'error', 'correct');

            if (value !== 0) {
                cell.classList.add('given');
                cell.readOnly = true;
            } else {
                cell.readOnly = false;
            }
        });
    }

    selectCell(cell) {
        if (cell.readOnly) return;

        document.querySelectorAll('.cell').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        this.selectedCell = cell;
        cell.focus();
    }

    inputNumber(number) {
        if (!this.selectedCell || this.selectedCell.readOnly || this.gameCompleted) return;

        if (!this.gameStarted) {
            this.startGame();
        }

        const index = parseInt(this.selectedCell.dataset.index);
        const row = Math.floor(index / 9);
        const col = index % 9;

        this.selectedCell.value = number;

        // Check if the move is valid
        if (parseInt(number) === this.solution[row][col]) {
            this.selectedCell.classList.remove('error');
            this.selectedCell.classList.add('correct');
            this.score += 10;
            this.updateScore();

            // Check if puzzle is completed
            setTimeout(() => {
                if (this.isPuzzleComplete()) {
                    this.completePuzzle();
                }
            }, 100);
        } else {
            this.selectedCell.classList.remove('correct');
            this.selectedCell.classList.add('error');
            this.mistakes++;
            this.updateMistakes();

            if (this.mistakes >= this.maxMistakes) {
                this.gameOver();
            }
        }
    }

    clearCell() {
        if (!this.selectedCell || this.selectedCell.readOnly) return;

        this.selectedCell.value = '';
        this.selectedCell.classList.remove('error', 'correct');
    }

    isValidMove(grid, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) return false;
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) return false;
        }

        // Check 3x3 box
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) return false;
            }
        }

        return true;
    }

    startGame() {
        this.gameStarted = true;
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        this.timerElement.textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    updateMistakes() {
        this.mistakesElement.textContent = `${this.mistakes}/${this.maxMistakes}`;
    }

    isPuzzleComplete() {
        const cells = document.querySelectorAll('.cell');
        return Array.from(cells).every(cell => cell.value !== '');
    }

    completePuzzle() {
        this.gameCompleted = true;
        clearInterval(this.timerInterval);

        // Calculate final score
        const timeBonus = Math.max(0, 1000 - this.timer);
        const mistakesPenalty = this.mistakes * 50;
        const finalScore = this.score + timeBonus - mistakesPenalty;

        this.saveHighScore(finalScore);
        this.showCelebration(finalScore);
    }

    gameOver() {
        this.gameCompleted = true;
        clearInterval(this.timerInterval);
        alert('Game Over! Too many mistakes. Try again!');
    }

    showCelebration(finalScore) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        celebration.innerHTML = `
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You completed the puzzle!</p>
            <p><strong>Final Score: ${finalScore}</strong></p>
            <p>Time: ${this.timerElement.textContent}</p>
            <p>Mistakes: ${this.mistakes}</p>
            <button class="action-btn" onclick="this.parentElement.parentElement.remove(); this.parentElement.remove();">Close</button>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(celebration);

        // Auto close after 5 seconds
        setTimeout(() => {
            if (overlay.parentElement) overlay.remove();
            if (celebration.parentElement) celebration.remove();
        }, 5000);
    }

    newGame() {
        this.resetGame();
        this.generateNewPuzzle();
    }

    resetGame() {
        this.gameStarted = false;
        this.gameCompleted = false;
        this.timer = 0;
        this.score = 0;
        this.mistakes = 0;
        this.selectedCell = null;

        clearInterval(this.timerInterval);
        this.updateTimer();
        this.updateScore();
        this.updateMistakes();
    }

    giveHint() {
        if (this.gameCompleted) return;

        const emptyCells = [];
        const cells = document.querySelectorAll('.cell');

        cells.forEach((cell, index) => {
            if (cell.value === '' && !cell.readOnly) {
                emptyCells.push({
                    cell,
                    index
                });
            }
        });

        if (emptyCells.length === 0) return;

        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const row = Math.floor(randomCell.index / 9);
        const col = randomCell.index % 9;

        randomCell.cell.value = this.solution[row][col];
        randomCell.cell.classList.add('correct');
        randomCell.cell.readOnly = true;

        this.score = Math.max(0, this.score - 20); // Penalty for hint
        this.updateScore();
    }

    checkSolution() {
        const cells = document.querySelectorAll('.cell');
        let correct = 0;
        let total = 0;

        cells.forEach((cell, index) => {
            if (!cell.readOnly && cell.value !== '') {
                total++;
                const row = Math.floor(index / 9);
                const col = index % 9;

                if (parseInt(cell.value) === this.solution[row][col]) {
                    correct++;
                }
            }
        });

        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        alert(`Current accuracy: ${percentage}% (${correct}/${total} correct)`);
    }

    solvePuzzle() {
        if (confirm('Are you sure you want to solve the puzzle? This will end the current game.')) {
            const cells = document.querySelectorAll('.cell');
            cells.forEach((cell, index) => {
                const row = Math.floor(index / 9);
                const col = index % 9;
                cell.value = this.solution[row][col];
                cell.classList.add('correct');
            });

            this.gameCompleted = true;
            clearInterval(this.timerInterval);
        }
    }

    saveHighScore(score) {
        const highScores = this.getHighScores();
        const newScore = {
            score: score,
            time: this.timerElement.textContent,
            difficulty: this.difficulty,
            date: new Date().toLocaleDateString()
        };

        highScores.push(newScore);
        highScores.sort((a, b) => b.score - a.score);
        highScores.splice(5); // Keep only top 5

        localStorage.setItem('sudokuHighScores', JSON.stringify(highScores));
        this.displayHighScores();
    }

    getHighScores() {
        const scores = localStorage.getItem('sudokuHighScores');
        return scores ? JSON.parse(scores) : [];
    }

    loadHighScores() {
        this.displayHighScores();
    }

    displayHighScores() {
        const highScores = this.getHighScores();
        this.highScoresElement.innerHTML = '';

        if (highScores.length === 0) {
            this.highScoresElement.innerHTML = '<p>No high scores yet!</p>';
            return;
        }

        highScores.forEach((score, index) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';
            scoreItem.innerHTML = `
                <span>#${index + 1} - ${score.difficulty}</span>
                <span>${score.score} pts (${score.time})</span>
            `;
            this.highScoresElement.appendChild(scoreItem);
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
