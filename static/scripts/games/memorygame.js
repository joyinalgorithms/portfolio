const DIFFICULTIES = {
    easy: {
        pairs: 6,
        grid: "easy",
        name: "Easy"
    },
    medium: {
        pairs: 8,
        grid: "medium",
        name: "Medium"
    },
    hard: {
        pairs: 10,
        grid: "hard",
        name: "Hard"
    },
}

const TECH_SYMBOLS = [
    "⚛️",
    "🐍",
    "☕",
    "🔥",
    "⚡",
    "🌐",
    "💾",
    "🖥️",
    "📱",
    "🔧",
    "🚀",
    "💻",
    "🔒",
    "☁️",
    "🎯",
    "⚙️",
    "🌟",
    "💡",
    "🎨",
    "🔮",
    "🎪",
    "🎭",
    "🎨",
    "🎯",
]

const ACHIEVEMENTS = {
    speedster: {
        name: "Speed Demon",
        description: "Completed in under 30 seconds!",
        icon: "⚡"
    },
    efficient: {
        name: "Memory Master",
        description: "Completed with minimal moves!",
        icon: "🧠"
    },
    perfect: {
        name: "Perfect Game",
        description: "No wrong moves!",
        icon: "💎"
    },
    persistent: {
        name: "Never Give Up",
        description: "Completed after many attempts!",
        icon: "💪"
    },
}

const gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    startTime: null,
    timer: null,
    gameActive: false,
    isPaused: false,
    difficulty: "medium",
    currentScore: 0,
    perfectGame: true,
}

document.addEventListener("DOMContentLoaded", () => {
    initializeGame()
    loadHighScores()
    setupKeyboardNavigation()
})

function initializeGame() {
    const difficulty = DIFFICULTIES[gameState.difficulty]
    const selectedSymbols = TECH_SYMBOLS.slice(0, difficulty.pairs)
    const cardSymbols = [...selectedSymbols, ...selectedSymbols]

    gameState.cards = shuffleArray(cardSymbols).map((symbol, index) => ({
        id: index,
        symbol: symbol,
        isFlipped: false,
        isMatched: false,
    }))

    renderGameBoard()
    resetGameStats()
    updateCurrentScore()
}

function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

function renderGameBoard() {
    const gameBoard = document.getElementById("gameBoard")
    const difficulty = DIFFICULTIES[gameState.difficulty]

    gameBoard.className = `game-board ${difficulty.grid}`
    gameBoard.innerHTML = ""

    gameState.cards.forEach((card) => {
        const cardElement = document.createElement("div")
        cardElement.className = "card"
        cardElement.dataset.cardId = card.id
        cardElement.tabIndex = 0
        cardElement.setAttribute("role", "button")
        cardElement.setAttribute("aria-label", `Card ${card.id + 1}`)

        cardElement.onclick = () => flipCard(card.id)
        cardElement.onkeydown = (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                flipCard(card.id)
            }
        }

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${card.symbol}</div>
            </div>
        `

        gameBoard.appendChild(cardElement)
    })
}

function flipCard(cardId) {
    if (gameState.isPaused) return

    if (!gameState.gameActive) {
        startGame()
    }

    const card = gameState.cards[cardId]
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)

    if (card.isFlipped || card.isMatched || gameState.flippedCards.length >= 2) {
        return
    }

    card.isFlipped = true
    cardElement.classList.add("flipped")
    cardElement.setAttribute("aria-label", `Card ${cardId + 1}: ${card.symbol}`)
    gameState.flippedCards.push(card)

    setTimeout(() => {
        if (gameState.flippedCards.length === 2) {
            gameState.moves++
            updateMoves()
            updateCurrentScore()

            setTimeout(() => {
                checkForMatch()
            }, 1000)
        }
    }, 100)
}

function checkForMatch() {
    const [card1, card2] = gameState.flippedCards
    const card1Element = document.querySelector(`[data-card-id="${card1.id}"]`)
    const card2Element = document.querySelector(`[data-card-id="${card2.id}"]`)

    if (card1.symbol === card2.symbol) {
        card1.isMatched = true
        card2.isMatched = true
        card1Element.classList.add("matched")
        card2Element.classList.add("matched")

        gameState.matchedPairs++
        updateMatches()
        updateCurrentScore()

        if (gameState.matchedPairs === DIFFICULTIES[gameState.difficulty].pairs) {
            setTimeout(() => endGame(), 500)
        }
    } else {
        gameState.perfectGame = false
        card1.isFlipped = false
        card2.isFlipped = false

        card1Element.classList.add("shake")
        card2Element.classList.add("shake")

        setTimeout(() => {
            card1Element.classList.remove("flipped", "shake")
            card2Element.classList.remove("flipped", "shake")

            card1Element.setAttribute("aria-label", `Card ${card1.id + 1}`)
            card2Element.setAttribute("aria-label", `Card ${card2.id + 1}`)
        }, 500)
    }

    gameState.flippedCards = []
}

function startGame() {
    gameState.gameActive = true
    gameState.startTime = Date.now()
    gameState.timer = setInterval(updateTimer, 1000)
}

function pauseGame() {
    if (!gameState.gameActive) return

    if (gameState.isPaused) {
        resumeGame()
    } else {
        gameState.isPaused = true
        clearInterval(gameState.timer)
        document.getElementById("pauseModal").classList.add("show")
        document.getElementById("pauseBtn").innerHTML = '<span class="btn-icon">▶️</span>Resume'
    }
}

function resumeGame() {
    gameState.isPaused = false
    gameState.startTime = Date.now() - gameState.moves * 1000
    gameState.timer = setInterval(updateTimer, 1000)
    document.getElementById("pauseModal").classList.remove("show")
    document.getElementById("pauseBtn").innerHTML = '<span class="btn-icon">⏸️</span>Pause'
}

function endGame() {
    gameState.gameActive = false
    clearInterval(gameState.timer)

    const endTime = Date.now()
    const totalTime = Math.floor((endTime - gameState.startTime) / 1000)
    const score = calculateScore(totalTime, gameState.moves)


    saveHighScore(totalTime, gameState.moves, score)

    document.getElementById("finalTime").textContent = formatTime(totalTime)
    document.getElementById("finalMoves").textContent = gameState.moves
    document.getElementById("finalScore").textContent = score

    const achievement = getAchievement(totalTime, gameState.moves)
    const achievementElement = document.getElementById("achievement")
    if (achievement) {
        achievementElement.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${achievement.icon}</div>
            <div style="font-weight: bold; margin-bottom: 0.25rem;">${achievement.name}</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">${achievement.description}</div>
        `
        achievementElement.style.display = "block"
    } else {
        achievementElement.style.display = "none"
    }

    document.getElementById("gameOverModal").classList.add("show")
}

function calculateScore(time, moves) {
    const difficulty = DIFFICULTIES[gameState.difficulty]
    const baseScore = difficulty.pairs * 100
    const timePenalty = Math.max(0, time - 30) * 2
    const movePenalty = Math.max(0, moves - difficulty.pairs * 2) * 5
    const perfectBonus = gameState.perfectGame ? 200 : 0

    return Math.max(50, baseScore - timePenalty - movePenalty + perfectBonus)
}

function updateCurrentScore() {
    if (!gameState.gameActive) {
        gameState.currentScore = 0
    } else {
        const currentTime = Math.floor((Date.now() - gameState.startTime) / 1000)
        gameState.currentScore = calculateScore(currentTime, gameState.moves)
    }
    document.getElementById("currentScore").textContent = gameState.currentScore
}

function getAchievement(time, moves) {
    const difficulty = DIFFICULTIES[gameState.difficulty]

    if (time <= 30) return ACHIEVEMENTS.speedster
    if (moves <= difficulty.pairs * 1.5) return ACHIEVEMENTS.efficient
    if (gameState.perfectGame) return ACHIEVEMENTS.perfect
    if (moves > difficulty.pairs * 3) return ACHIEVEMENTS.persistent

    return null
}

function updateTimer() {
    if (!gameState.gameActive || gameState.isPaused) return

    const currentTime = Date.now()
    const elapsed = Math.floor((currentTime - gameState.startTime) / 1000)
    document.getElementById("timer").textContent = formatTime(elapsed)
    updateCurrentScore()
}

function updateMoves() {
    document.getElementById("moves").textContent = gameState.moves
}

function updateMatches() {
    document.getElementById("matches").textContent = gameState.matchedPairs
}

function resetGameStats() {
    gameState.moves = 0
    gameState.matchedPairs = 0
    gameState.flippedCards = []
    gameState.gameActive = false
    gameState.isPaused = false
    gameState.startTime = null
    gameState.currentScore = 0
    gameState.perfectGame = true

    if (gameState.timer) {
        clearInterval(gameState.timer)
    }

    document.getElementById("timer").textContent = "00:00"
    document.getElementById("moves").textContent = "0"
    document.getElementById("matches").textContent = "0"
    document.getElementById("currentScore").textContent = "0"
    document.getElementById("pauseBtn").innerHTML = '<span class="btn-icon">⏸️</span>Pause'
}

function startNewGame() {
    document.getElementById("gameOverModal").classList.remove("show")
    document.getElementById("pauseModal").classList.remove("show")

    initializeGame()
}

function changeDifficulty() {
    const select = document.getElementById("difficulty")
    gameState.difficulty = select.value
    startNewGame()
}

function closeGameOver() {
    document.getElementById("gameOverModal").classList.remove("show")
    startNewGame()
}

function saveHighScore(time, moves, score) {
    const highScores = getHighScores(gameState.difficulty)
    const newScore = {
        date: new Date().toLocaleDateString(),
        time: time,
        moves: moves,
        score: score,
        difficulty: gameState.difficulty,
    }

    highScores.push(newScore)
    highScores.sort((a, b) => b.score - a.score)
    const topScores = highScores.slice(0, 10)

    localStorage.setItem(`techMemoryHighScores_${gameState.difficulty}`, JSON.stringify(topScores))
    loadHighScores()
}

function getHighScores(difficulty) {
    const scores = localStorage.getItem(`techMemoryHighScores_${difficulty}`)
    return scores ? JSON.parse(scores) : []
}

function loadHighScores() {
    showScores(gameState.difficulty)
}

function showScores(difficulty) {
    document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
    document.querySelector(`[onclick="showScores('${difficulty}')"]`).classList.add("active")

    const highScores = getHighScores(difficulty)
    const highScoresList = document.getElementById("highScoresList")

    if (highScores.length === 0) {
        highScoresList.innerHTML = `
            <div class="score-item">
                <span>No scores yet for ${DIFFICULTIES[difficulty].name} mode</span>
                <span>-</span>
            </div>
        `
        return
    }

    highScoresList.innerHTML = highScores
        .map(
            (score, index) => `
        <div class="score-item">
            <div>
                <span class="score-rank">#${index + 1}</span>
                <div class="score-details">
                    <div>${score.date}</div>
                    <div class="score-date">${formatTime(score.time)} • ${score.moves} moves</div>
                </div>
            </div>
            <div class="score-value">${score.score} pts</div>
        </div>
    `,
        )
        .join("")
}

function resetStats() {
    if (confirm("Are you sure you want to reset all high scores for all difficulties?")) {
        Object.keys(DIFFICULTIES).forEach((difficulty) => {
            localStorage.removeItem(`techMemoryHighScores_${difficulty}`)
        })
        loadHighScores()
    }
}

function shareScore() {
    const finalScore = document.getElementById("finalScore").textContent
    const finalTime = document.getElementById("finalTime").textContent
    const finalMoves = document.getElementById("finalMoves").textContent
    const difficulty = DIFFICULTIES[gameState.difficulty].name

    const shareText = `🚀 I just scored ${finalScore} points in Tech Memory Match (${difficulty} mode)! Time: ${finalTime}, Moves: ${finalMoves}. Can you beat my score?`

    if (navigator.share) {
        navigator.share({
            title: "Tech Memory Match - My Score",
            text: shareText,
            url: window.location.href,
        })
    } else {
        navigator.clipboard
            .writeText(shareText)
            .then(() => {
                alert("Score copied to clipboard!")
            })
            .catch(() => {
                const textArea = document.createElement("textarea")
                textArea.value = shareText
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand("copy")
                document.body.removeChild(textArea)
                alert("Score copied to clipboard!")
            })
    }
}

function setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (document.getElementById("gameOverModal").classList.contains("show")) {
                closeGameOver()
            } else if (document.getElementById("pauseModal").classList.contains("show")) {
                resumeGame()
            } else if (gameState.gameActive) {
                pauseGame()
            }
        }

        if (e.key === " " && !gameState.gameActive && !document.querySelector(".modal-overlay.show")) {
            e.preventDefault()
            startNewGame()
        }
    })
}

function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

function announceToScreenReader(message) {
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.textContent = message
    document.body.appendChild(announcement)

    setTimeout(() => {
        document.body.removeChild(announcement)
    }, 1000)
}

const originalCheckForMatch = checkForMatch
checkForMatch = () => {
    const [card1, card2] = gameState.flippedCards
    originalCheckForMatch()

    if (card1.symbol === card2.symbol) {
        announceToScreenReader(
            `Match found! ${gameState.matchedPairs} of ${DIFFICULTIES[gameState.difficulty].pairs} pairs completed.`,
        )
    } else {
        announceToScreenReader("No match. Cards flipped back.")
    }
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => console.log("SW registered"))
            .catch((registrationError) => console.log("SW registration failed"))
    })
}
