// Cache DOM elements
const resultDisplay = document.querySelector(".js-result")
const movesDisplay = document.querySelector(".js-moves")
const scoreDisplay = document.querySelector(".js-score")
const rockBtn = document.querySelector(".js-rock-btn")
const paperBtn = document.querySelector(".js-paper-btn")
const scissorsBtn = document.querySelector(".js-scissors-btn")
const resetBtn = document.querySelector(".reset-btn")
const autoPlayBtn = document.querySelector(".auto-play-btn")

// Initialize score from local storage or set to default
let score = JSON.parse(localStorage.getItem("score")) || {
  wins: 0,
  losses: 0,
  ties: 0,
}

// Function to update score display
function updateScore() {
  scoreDisplay.innerHTML = `Wins: ${score.wins} Losses: ${score.losses} Ties: ${score.ties}`
}

// Initial score update
updateScore()

// Function to pick computer's move
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

// Auto Play function
function autoPlay() {
  if (!isAutoPlaying) {
    autoPlayIntervalId = setInterval(() => {
      const playerMove = pickComputerMove() // Computer plays as player
      playGame(playerMove)
    }, 1000)
    isAutoPlaying = true
    autoPlayBtn.textContent = "Stop Auto Play"
    autoPlayBtn.style.backgroundColor = "var(--accent-color)" // Change color when active
  } else {
    clearInterval(autoPlayIntervalId)
    isAutoPlaying = false
    autoPlayBtn.textContent = "Auto Play"
    autoPlayBtn.style.backgroundColor = "var(--primary-color)" // Reset color
  }
}

// Main game logic function
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

  // Update score
  if (result === "You win") {
    score.wins++
  } else if (result === "You lose") {
    score.losses++
  } else if (result === "Tie") {
    score.ties++
  }

  // Save score to local storage
  localStorage.setItem("score", JSON.stringify(score))

  // Update UI
  updateScore()
  resultDisplay.textContent = result
  resultDisplay.className = `js-result result ${result.toLowerCase().replace(" ", "")}` // Add class for styling

  movesDisplay.innerHTML = `
      You <img class="move-icon" src="images/minigames/${playerMove}-emoji.jpg" alt="${playerMove}">
      <span class="vs-text">vs</span>
      <img class="move-icon" src="images/minigames/${computerMove}-emoji.jpg" alt="${computerMove}"> Computer
  `
}

// Event Listeners
rockBtn.addEventListener("click", () => playGame("Rock"))
paperBtn.addEventListener("click", () => playGame("Paper"))
scissorsBtn.addEventListener("click", () => playGame("Scissors"))

resetBtn.addEventListener("click", () => {
  score = { wins: 0, losses: 0, ties: 0 }
  localStorage.removeItem("score")
  updateScore()
  resultDisplay.textContent = "" // Clear result
  movesDisplay.innerHTML = "" // Clear moves
  resultDisplay.className = "js-result result" // Reset class
})

autoPlayBtn.addEventListener("click", autoPlay)

// Keyboard shortcuts
document.body.addEventListener("keydown", (event) => {
  if (event.key === "r" || event.key === "R") {
    playGame("Rock")
  } else if (event.key === "p" || event.key === "P") {
    playGame("Paper")
  } else if (event.key === "s" || event.key === "S") {
    playGame("Scissors")
  }
})
