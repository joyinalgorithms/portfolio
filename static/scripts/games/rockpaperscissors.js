const resultDisplay = document.querySelector(".js-result")
const movesDisplay = document.querySelector(".js-moves")
const scoreDisplay = document.querySelector(".js-score")
const rockBtn = document.querySelector(".js-rock-btn")
const paperBtn = document.querySelector(".js-paper-btn")
const scissorsBtn = document.querySelector(".js-scissors-btn")
const resetBtn = document.querySelector(".reset-btn")
const autoPlayBtn = document.querySelector(".auto-play-btn")

let score = JSON.parse(localStorage.getItem("score")) || {
    wins: 0,
    losses: 0,
    ties: 0,
}

function updateScore() {
    scoreDisplay.innerHTML = `Wins: ${score.wins} Losses: ${score.losses} Ties: ${score.ties}`
}

updateScore()

function pickComputerMove() {
    const randomNumber = Math.random()
    if (randomNumber < 1 / 3) {
        return "Rock"
    } else if (randomNumber < 2 / 3) {
        return "Paper"
    } else {
        return "Scissors"
    }
}

let isAutoPlaying = false
let autoPlayIntervalId

function autoPlay() {
    if (!isAutoPlaying) {
        autoPlayIntervalId = setInterval(() => {
            const playerMove = pickComputerMove()
            playGame(playerMove)
        }, 1000)
        isAutoPlaying = true
        autoPlayBtn.textContent = "Stop Auto Play"
        autoPlayBtn.style.backgroundColor = "var(--accent-color)"
    } else {
        clearInterval(autoPlayIntervalId)
        isAutoPlaying = false
        autoPlayBtn.textContent = "Auto Play"
        autoPlayBtn.style.backgroundColor = "var(--primary-color)"
    }
}

function playGame(playerMove) {
    const computerMove = pickComputerMove()
    let result = ""

    if (playerMove === computerMove) {
        result = "Tie"
    } else if (
        (playerMove === "Rock" && computerMove === "Scissors") ||
        (playerMove === "Paper" && computerMove === "Rock") ||
        (playerMove === "Scissors" && computerMove === "Paper")
    ) {
        result = "You win"
    } else {
        result = "You lose"
    }

    if (result === "You win") {
        score.wins++
    } else if (result === "You lose") {
        score.losses++
    } else if (result === "Tie") {
        score.ties++
    }

    localStorage.setItem("score", JSON.stringify(score))

    updateScore()
    resultDisplay.textContent = result
    resultDisplay.className = `js-result result ${result.toLowerCase().replace(" ", "")}`

    movesDisplay.innerHTML = `
      You <img class="move-icon" src="/static/images/${playerMove}-emoji.png" alt="${playerMove}">
      <span class="vs-text">vs</span>
      <img class="move-icon" src="/static/images/${computerMove}-emoji.png" alt="${computerMove}"> Computer
  `
}

rockBtn.addEventListener("click", () => playGame("Rock"))
paperBtn.addEventListener("click", () => playGame("Paper"))
scissorsBtn.addEventListener("click", () => playGame("Scissors"))

resetBtn.addEventListener("click", () => {
    score = {
        wins: 0,
        losses: 0,
        ties: 0
    }
    localStorage.removeItem("score")
    updateScore()
    resultDisplay.textContent = ""
    movesDisplay.innerHTML = ""
    resultDisplay.className = "js-result result"
})

autoPlayBtn.addEventListener("click", autoPlay)

document.body.addEventListener("keydown", (event) => {
    if (event.key === "r" || event.key === "R") {
        playGame("Rock")
    } else if (event.key === "p" || event.key === "P") {
        playGame("Paper")
    } else if (event.key === "s" || event.key === "S") {
        playGame("Scissors")
    }
})
