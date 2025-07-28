const DIFFICULTY = {
    easy: {
        name: "Easy",
        remove: 40,
        multiplier: 1
    },
    medium: {
        name: "Medium",
        remove: 50,
        multiplier: 1.5
    },
    hard: {
        name: "Hard",
        remove: 60,
        multiplier: 2
    },
}

class SudokuGame {
    constructor() {
        this.grid = Array(9)
            .fill()
            .map(() => Array(9).fill(0))
        this.solution = Array(9)
            .fill()
            .map(() => Array(9).fill(0))
        this.selectedCell = null
        this.timer = 0
        this.score = 0
        this.mistakes = 0
        this.difficulty = "easy"
        this.gameStarted = false
        this.gameCompleted = false
        this.hintsUsed = 0

        this.init()
    }

    init() {
        this.createGrid()
        this.attachEvents()
        this.loadScores()
        this.newGame()
    }

    createGrid() {
        const grid = document.getElementById("grid")
        grid.innerHTML = ""

        for (let i = 0; i < 81; i++) {
            const cell = document.createElement("input")
            cell.type = "text"
            cell.className = "cell"
            cell.maxLength = 1
            cell.dataset.index = i
            grid.appendChild(cell)
        }
    }

    attachEvents() {
        document.getElementById("grid").addEventListener("click", (e) => {
            if (e.target.classList.contains("cell")) {
                this.selectCell(e.target)
            }
        })

        document.querySelectorAll(".num-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                this.inputNumber(e.target.dataset.num)
            })
        })

        document.getElementById("clear").addEventListener("click", () => this.clearCell())
        document.getElementById("new-game").addEventListener("click", () => this.newGame())
        document.getElementById("hint").addEventListener("click", () => this.giveHint())
        document.getElementById("check").addEventListener("click", () => this.checkSolution())
        document.getElementById("solve").addEventListener("click", () => this.solvePuzzle())

        document.querySelectorAll(".diff-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                this.changeDifficulty(e.target.dataset.level)
            })
        })

        document.addEventListener("keydown", (e) => {
            if (e.key >= "1" && e.key <= "9") {
                this.inputNumber(e.key)
            } else if (e.key === "Backspace" || e.key === "Delete") {
                this.clearCell()
            }
        })
    }

    generatePuzzle() {
        this.solution = this.generateComplete()
        this.grid = this.solution.map((row) => [...row])

        const toRemove = DIFFICULTY[this.difficulty].remove
        const positions = []

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                positions.push([i, j])
            }
        }

        positions.sort(() => Math.random() - 0.5)
        for (let i = 0; i < toRemove; i++) {
            const [row, col] = positions[i]
            this.grid[row][col] = 0
        }

        this.updateDisplay()
    }

    generateComplete() {
        const grid = Array(9)
            .fill()
            .map(() => Array(9).fill(0))
        this.solve(grid)
        return grid
    }

    solve(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)

                    for (const num of numbers) {
                        if (this.isValid(grid, row, col, num)) {
                            grid[row][col] = num
                            if (this.solve(grid)) return true
                            grid[row][col] = 0
                        }
                    }
                    return false
                }
            }
        }
        return true
    }

    isValid(grid, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) return false
        }

        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) return false
        }

        const startRow = row - (row % 3)
        const startCol = col - (col % 3)
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) return false
            }
        }

        return true
    }

    updateDisplay() {
        const cells = document.querySelectorAll(".cell")
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9)
            const col = index % 9
            const value = this.grid[row][col]

            cell.value = value === 0 ? "" : value
            cell.classList.remove("given", "error", "correct", "hint")

            if (value !== 0) {
                cell.classList.add("given")
                cell.readOnly = true
            } else {
                cell.readOnly = false
            }
        })
    }

    selectCell(cell) {
        if (cell.readOnly || this.gameCompleted) return

        document.querySelectorAll(".cell").forEach((c) => c.classList.remove("selected"))
        cell.classList.add("selected")
        this.selectedCell = cell
        cell.focus()
    }

    inputNumber(number) {
        if (!this.selectedCell || this.selectedCell.readOnly || this.gameCompleted) return

        if (!this.gameStarted) this.startGame()

        const index = Number.parseInt(this.selectedCell.dataset.index)
        const row = Math.floor(index / 9)
        const col = index % 9

        this.selectedCell.value = number

        if (Number.parseInt(number) === this.solution[row][col]) {
            this.selectedCell.classList.remove("error")
            this.selectedCell.classList.add("correct")
            this.score += 10 * DIFFICULTY[this.difficulty].multiplier
            this.updateScore()

            setTimeout(() => {
                if (this.isComplete()) this.completeGame()
            }, 100)
        } else {
            this.selectedCell.classList.remove("correct")
            this.selectedCell.classList.add("error")
            this.mistakes++
            this.updateMistakes()

            if (this.mistakes >= 3) this.gameOver()
        }
    }

    clearCell() {
        if (!this.selectedCell || this.selectedCell.readOnly) return
        this.selectedCell.value = ""
        this.selectedCell.classList.remove("error", "correct", "hint")
    }

    startGame() {
        this.gameStarted = true
        this.timerInterval = setInterval(() => {
            this.timer++
            this.updateTimer()
        }, 1000)
    }

    updateTimer() {
        const minutes = Math.floor(this.timer / 60)
        const seconds = this.timer % 60
        document.getElementById("timer").textContent =
            `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    updateScore() {
        document.getElementById("score").textContent = this.score
    }

    updateMistakes() {
        document.getElementById("mistakes").textContent = `${this.mistakes}/3`
    }

    isComplete() {
        return Array.from(document.querySelectorAll(".cell")).every((cell) => cell.value !== "")
    }

    completeGame() {
        this.gameCompleted = true
        clearInterval(this.timerInterval)

        const finalScore = this.score + Math.max(0, 1000 - this.timer) - this.mistakes * 50 - this.hintsUsed * 20
        this.saveScore(finalScore)
        this.showModal(finalScore)
    }

    gameOver() {
        this.gameCompleted = true
        clearInterval(this.timerInterval)
        alert("Game Over! Too many mistakes.")
    }

    showModal(finalScore) {
        document.getElementById("final-time").textContent = document.getElementById("timer").textContent
        document.getElementById("final-score").textContent = finalScore
        document.getElementById("final-mistakes").textContent = this.mistakes
        document.getElementById("modal").classList.add("show")
    }

    changeDifficulty(level) {
        document.querySelectorAll(".diff-btn").forEach((btn) => btn.classList.remove("active"))
        document.querySelector(`[data-level="${level}"]`).classList.add("active")
        this.difficulty = level
        this.newGame()
    }

    newGame() {
        this.resetGame()
        this.generatePuzzle()
    }

    resetGame() {
        this.gameStarted = false
        this.gameCompleted = false
        this.timer = 0
        this.score = 0
        this.mistakes = 0
        this.hintsUsed = 0
        this.selectedCell = null
        clearInterval(this.timerInterval)
        this.updateTimer()
        this.updateScore()
        this.updateMistakes()
        document.getElementById("modal").classList.remove("show")
    }

    giveHint() {
        if (this.gameCompleted) return

        const emptyCells = Array.from(document.querySelectorAll(".cell"))
            .map((cell, index) => ({
                cell,
                index
            }))
            .filter(({
                cell
            }) => cell.value === "" && !cell.readOnly)

        if (emptyCells.length === 0) return

        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
        const row = Math.floor(randomCell.index / 9)
        const col = randomCell.index % 9

        randomCell.cell.value = this.solution[row][col]
        randomCell.cell.classList.add("hint")
        randomCell.cell.readOnly = true

        this.hintsUsed++
        this.score = Math.max(0, this.score - 20)
        this.updateScore()

        setTimeout(() => {
            if (this.isComplete()) this.completeGame()
        }, 100)
    }

    checkSolution() {
        if (this.gameCompleted) return

        const cells = document.querySelectorAll(".cell")
        let correct = 0
        let total = 0

        cells.forEach((cell, index) => {
            if (!cell.readOnly && cell.value !== "") {
                total++
                const row = Math.floor(index / 9)
                const col = index % 9
                if (Number.parseInt(cell.value) === this.solution[row][col]) correct++
            }
        })

        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
        alert(`Accuracy: ${percentage}% (${correct}/${total} correct)`)
    }

    solvePuzzle() {
        if (confirm("Solve the puzzle? This will end the game.")) {
            document.querySelectorAll(".cell").forEach((cell, index) => {
                const row = Math.floor(index / 9)
                const col = index % 9
                cell.value = this.solution[row][col]
                cell.classList.add("correct")
                cell.readOnly = true
            })

            this.gameCompleted = true
            clearInterval(this.timerInterval)
        }
    }

    saveScore(score) {
        const scores = this.getScores(this.difficulty)
        scores.push({
            score,
            time: document.getElementById("timer").textContent,
            mistakes: this.mistakes,
            date: new Date().toLocaleDateString(),
        })

        scores.sort((a, b) => b.score - a.score)
        scores.splice(5)

        localStorage.setItem(`sudoku_${this.difficulty}`, JSON.stringify(scores))
        this.displayScores()
    }

    getScores(difficulty) {
        const scores = localStorage.getItem(`sudoku_${difficulty}`)
        return scores ? JSON.parse(scores) : []
    }

    loadScores() {
        this.displayScores()
    }

    displayScores() {
        showScores(this.difficulty)
    }
}

function closeModal() {
    document.getElementById("modal").classList.remove("show")
    game.newGame()
}

function showScores(difficulty) {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"))
    document.querySelector(`[onclick="showScores('${difficulty}')"]`).classList.add("active")

    const scores = game.getScores(difficulty)
    const list = document.getElementById("scores-list")

    if (scores.length === 0) {
        list.innerHTML = '<div class="score-item"><span>No scores yet</span><span>-</span></div>'
        return
    }

    list.innerHTML = scores
        .map(
            (score, index) => `
    <div class="score-item">
      <div>
        <span class="score-rank">#${index + 1}</span>
        <span>${score.date} • ${score.time} • ${score.mistakes} mistakes</span>
      </div>
      <span class="score-value">${score.score}</span>
    </div>
  `,
        )
        .join("")
}

function shareScore() {
    const score = document.getElementById("final-score").textContent
    const time = document.getElementById("final-time").textContent
    const text = `🧩 I scored ${score} points in Sudoku Master! Time: ${time}. Can you beat it?`

    if (navigator.share) {
        navigator.share({
            title: "Sudoku Master",
            text,
            url: window.location.href
        })
    } else {
        navigator.clipboard.writeText(text).then(() => alert("Score copied!"))
    }
}

// Initialize
let game
document.addEventListener("DOMContentLoaded", () => {
    game = new SudokuGame()
})
