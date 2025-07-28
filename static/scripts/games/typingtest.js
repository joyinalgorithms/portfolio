class TypingTest {
    constructor() {
        this.texts = [
            "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice. It's a simple sentence that helps improve finger dexterity and keyboard familiarity.",
            "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat.",
            "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them.",
            "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light.",
            "Space: the final frontier. These are the voyages of the starship Enterprise. Its continuing mission: to explore strange new worlds, to seek out new life and new civilizations, to boldly go where no one has gone before.",
            "All happy families are alike; each unhappy family is unhappy in its own way. Everything was in confusion in the Oblonskys' house. The wife had discovered that the husband was carrying on an intrigue with a French girl.",
            "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
            "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood.",
        ]
        this.currentText = ""
        this.currentIndex = 0
        this.startTime = null
        this.endTime = null
        this.timer = null
        this.timeLeft = 60
        this.isActive = false
        this.errors = 0
        this.totalTypedChars = 0

        this.initElements()
        this.initEventListeners()
        this.loadLeaderboard()
        this.generateNewText()
    }

    initElements() {
        this.textDisplay = document.getElementById("textDisplay")
        this.typingInput = document.getElementById("typingInput")
        this.startBtn = document.getElementById("startBtn")
        this.resetBtn = document.getElementById("resetBtn")
        this.newTextBtn = document.getElementById("newTextBtn")
        this.wpmDisplay = document.getElementById("wpm")
        this.accuracyDisplay = document.getElementById("accuracy")
        this.errorsDisplay = document.getElementById("errors")
        this.timeDisplay = document.getElementById("time")
        this.progressBar = document.getElementById("progress")
        this.leaderboardList = document.getElementById("leaderboardList")
    }

    initEventListeners() {
        this.startBtn.addEventListener("click", () => this.startTest())
        this.resetBtn.addEventListener("click", () => this.resetTest())
        this.newTextBtn.addEventListener("click", () => this.generateNewText())
        this.typingInput.addEventListener("input", (e) => this.handleInput(e))
        this.typingInput.addEventListener("keydown", (e) => this.handleKeyDown(e))
    }

    generateNewText() {
        this.currentText = this.texts[Math.floor(Math.random() * this.texts.length)]
        this.displayText()
        this.resetTest()
    }

    displayText() {
        this.textDisplay.innerHTML = this.currentText
            .split("")
            .map((char, index) => `<span class="char" data-index="${index}">${char}</span>`)
            .join("")
    }

    startTest() {
        if (this.isActive) return
        this.isActive = true
        this.startTime = new Date().getTime()
        this.typingInput.disabled = false
        this.typingInput.focus()
        this.textDisplay.classList.add("active")
        this.startBtn.textContent = "Testing..."
        this.startBtn.disabled = true

        const firstChar = this.textDisplay.querySelector('.char[data-index="0"]')
        if (firstChar) {
            firstChar.classList.add("current")
        }

        this.timer = setInterval(() => {
            this.timeLeft--
            this.timeDisplay.textContent = this.timeLeft
            if (this.timeLeft <= 0) {
                this.endTest()
            }
        }, 1000)
    }

    handleInput(e) {
        if (!this.isActive) return

        const inputValue = e.target.value
        const chars = this.textDisplay.querySelectorAll(".char")

        chars.forEach((char) => {
            char.classList.remove("correct", "incorrect", "current")
        })

        this.errors = 0
        this.totalTypedChars = inputValue.length

        for (let i = 0; i < inputValue.length; i++) {
            if (i < chars.length) {
                if (inputValue[i] === this.currentText[i]) {
                    chars[i].classList.add("correct")
                } else {
                    chars[i].classList.add("incorrect")
                    this.errors++
                }
            }
        }

        if (inputValue.length < chars.length) {
            chars[inputValue.length].classList.add("current")
        }

        const progress = (inputValue.length / this.currentText.length) * 100
        this.progressBar.style.width = `${Math.min(progress, 100)}%`

        this.calculateStats(inputValue)

        if (inputValue.length >= this.currentText.length) {
            this.endTest()
        }
    }

    handleKeyDown(e) {
        if (!this.isActive) return
        if (e.key === "Tab" || e.key === "Escape") {
            e.preventDefault()
        }
    }

    calculateStats(inputValue) {
        const currentTime = new Date().getTime()
        const timeElapsed = (currentTime - this.startTime) / 1000 / 60

        let correctCharsInInput = 0
        for (let i = 0; i < inputValue.length; i++) {
            if (inputValue[i] === this.currentText[i]) {
                correctCharsInInput++
            }
        }
        const wordsTyped = correctCharsInInput / 5
        const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0


        const accuracy = this.totalTypedChars > 0 ? Math.round((correctCharsInInput / this.totalTypedChars) * 100) : 100


        this.wpmDisplay.textContent = wpm
        this.accuracyDisplay.textContent = accuracy
        this.errorsDisplay.textContent = this.errors
    }

    endTest() {
        if (!this.isActive) return
        this.isActive = false
        this.endTime = new Date().getTime()
        clearInterval(this.timer)
        this.typingInput.disabled = true
        this.textDisplay.classList.remove("active")
        this.startBtn.textContent = "Start Test"
        this.startBtn.disabled = false

        const finalWPM = Number.parseInt(this.wpmDisplay.textContent)
        const finalAccuracy = Number.parseInt(this.accuracyDisplay.textContent)

        this.saveScore(finalWPM, finalAccuracy)
        this.showGameOver(finalWPM, finalAccuracy)
    }

    showGameOver(wpm, accuracy) {
        const existingGameOver = document.querySelector(".game-over")
        if (existingGameOver) {
            existingGameOver.remove()
        }

        const gameOverDiv = document.createElement("div")
        gameOverDiv.className = "game-over"
        gameOverDiv.innerHTML = `
            <div class="final-score">${wpm} WPM</div>
            <div class="final-accuracy">${accuracy}% Accuracy</div>
            <p style="margin-top: 15px; opacity: 0.9;">${this.getEncouragementMessage(wpm, accuracy)}</p>
        `
        const controls = document.querySelector(".controls")
        controls.parentNode.insertBefore(gameOverDiv, controls.nextSibling)

        setTimeout(() => {
            if (gameOverDiv.parentNode) {
                gameOverDiv.parentNode.removeChild(gameOverDiv)
            }
        }, 5000)
    }

    getEncouragementMessage(wpm, accuracy) {
        if (wpm >= 80 && accuracy >= 95) return "Outstanding performance! You're a typing master! 🏆"
        if (wpm >= 60 && accuracy >= 90) return "Excellent work! Keep it up! 🌟"
        if (wpm >= 40 && accuracy >= 85) return "Good job! You're improving! 👍"
        if (wpm >= 20) return "Nice effort! Practice makes perfect! 💪"
        return "Keep practicing, you'll get better! 🚀"
    }

    resetTest() {
        this.isActive = false
        this.currentIndex = 0
        this.startTime = null
        this.endTime = null
        this.timeLeft = 60
        this.errors = 0
        this.totalTypedChars = 0
        clearInterval(this.timer)
        this.typingInput.value = ""
        this.typingInput.disabled = true
        this.textDisplay.classList.remove("active")
        this.startBtn.textContent = "Start Test"
        this.startBtn.disabled = false
        this.wpmDisplay.textContent = "0"
        this.accuracyDisplay.textContent = "100"
        this.errorsDisplay.textContent = "0"
        this.timeDisplay.textContent = "60"
        this.progressBar.style.width = "0%"

        const chars = this.textDisplay.querySelectorAll(".char")
        chars.forEach((char) => {
            char.classList.remove("correct", "incorrect", "current")
        })

        const gameOver = document.querySelector(".game-over")
        if (gameOver) {
            gameOver.remove()
        }
    }

    saveScore(wpm, accuracy) {
        const scores = this.getScores()
        const newScore = {
            wpm: wpm,
            accuracy: accuracy,
            date: new Date().toLocaleDateString(),
            timestamp: new Date().getTime(),
        }
        scores.push(newScore)
        scores.sort((a, b) => b.wpm - a.wpm)
        const topScores = scores.slice(0, 10)
        localStorage.setItem("typingTestScores", JSON.stringify(topScores))
        this.loadLeaderboard()
    }

    getScores() {
        const scores = localStorage.getItem("typingTestScores")
        return scores ? JSON.parse(scores) : []
    }

    loadLeaderboard() {
        const scores = this.getScores()
        if (scores.length === 0) {
            this.leaderboardList.innerHTML =
                '<p style="text-align: center; color: #6c757d; padding: 20px;">No scores yet. Start typing to set your first record!</p>'
            return
        }
        this.leaderboardList.innerHTML = scores
            .map(
                (score, index) => `
                <div class="score-item">
                    <div class="score-rank">#${index + 1}</div>
                    <div class="score-details">
                        <div class="score-wpm">${score.wpm} WPM</div>
                        <div class="score-accuracy">${score.accuracy}% • ${score.date}</div>
                    </div>
                </div>
            `,
            )
            .join("")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new TypingTest()
})
