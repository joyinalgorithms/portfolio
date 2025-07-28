class ColorGuessingGame {
    constructor() {
        this.score = 0
        this.round = 1
        this.streak = 0
        this.maxRounds = 10
        this.currentColors = []
        this.correctIndex = 0
        this.gameEnded = false
        this.soundEnabled = true
        this.isMobile = this.detectMobile()

        this.initializeSounds()
        this.initGame()
        this.bindEvents()
    }

    detectMobile() {
        return (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0
        )
    }

    initializeSounds() {
        this.sounds = {
            correct: this.createSuccessSound(),
            incorrect: this.createErrorSound(),
            click: this.createClickSound(),
        }
    }

    createSuccessSound() {
        return () => {
            if (!this.soundEnabled) return
            const audioContext = new(window.AudioContext || window.webkitAudioContext)()
            const frequencies = [523, 659, 784, 1047]

            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator()
                const gainNode = audioContext.createGain()

                oscillator.connect(gainNode)
                gainNode.connect(audioContext.destination)

                oscillator.frequency.value = freq
                oscillator.type = "sine"

                const startTime = audioContext.currentTime + index * 0.1
                gainNode.gain.setValueAtTime(0.2, startTime)
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)

                oscillator.start(startTime)
                oscillator.stop(startTime + 0.3)
            })
        }
    }

    createErrorSound() {
        return () => {
            if (!this.soundEnabled) return
            const audioContext = new(window.AudioContext || window.webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.value = 200
            oscillator.type = "sawtooth"

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.5)
        }
    }

    createClickSound() {
        return () => {
            if (!this.soundEnabled) return
            const audioContext = new(window.AudioContext || window.webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.value = 800
            oscillator.type = "square"

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.1)
        }
    }

    bindEvents() {
        document.addEventListener("keydown", (e) => {
            if (this.gameEnded) return

            if (e.key >= "1" && e.key <= "4") {
                e.preventDefault()
                const index = Number.parseInt(e.key) - 1
                this.selectColor(index)
            } else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                const nextButton = document.getElementById("nextButton")
                if (!nextButton.disabled) {
                    this.nextRound()
                }
            } else if (e.key === "r" || e.key === "R") {
                if (this.gameEnded) {
                    this.restart()
                }
            }
        })

        if (this.isMobile) {
            this.setupTouchEvents()
        }

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.pauseGame()
            }
        })
    }

    setupTouchEvents() {
        const options = document.querySelectorAll(".color-option")
        options.forEach((option, index) => {
            option.addEventListener(
                "touchstart",
                (e) => {
                    e.preventDefault()
                    option.style.transform = "scale(0.95)"
                }, {
                    passive: false
                },
            )

            option.addEventListener(
                "touchend",
                (e) => {
                    e.preventDefault()
                    option.style.transform = ""
                    this.selectColor(index)
                }, {
                    passive: false
                },
            )
        })
    }

    pauseGame() {
        if (this.gameTimer) {
            clearTimeout(this.gameTimer)
        }
    }

    initGame() {
        this.generateRound()
        this.updateDisplay()
        this.showGameInstructions()
    }

    showGameInstructions() {
        if (this.round === 1 && !localStorage.getItem("colorGameInstructionsShown")) {
            setTimeout(() => {
                const instructions = document.querySelector(".game-instructions")
                if (instructions) {
                    instructions.style.animation = "pulse 2s ease-in-out 3"
                }
                localStorage.setItem("colorGameInstructionsShown", "true")
            }, 1000)
        }
    }

    generateRandomColor() {
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        return {
            r,
            g,
            b
        }
    }

    colorToRgb(color) {
        return `rgb(${color.r}, ${color.g}, ${color.b})`
    }

    colorToHex(color) {
        const toHex = (n) => n.toString(16).padStart(2, "0").toUpperCase()
        return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
    }

    generateSimilarColor(baseColor, variation = 60) {
        const vary = (value) => {
            const change = (Math.random() - 0.5) * variation * 2
            return Math.max(0, Math.min(255, Math.round(value + change)))
        }

        return {
            r: vary(baseColor.r),
            g: vary(baseColor.g),
            b: vary(baseColor.b),
        }
    }

    generateRound() {
        const correctColor = this.generateRandomColor()
        const distractors = []

        for (let i = 0; i < 3; i++) {
            let distractor
            let attempts = 0
            do {
                distractor = this.generateSimilarColor(correctColor, 80)
                attempts++
            } while (attempts < 10 && this.colorDistance(correctColor, distractor) < 30)

            distractors.push(distractor)
        }

        this.currentColors = [correctColor, ...distractors]
        this.correctIndex = 0

        for (let i = this.currentColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentColors[i], this.currentColors[j]] = [this.currentColors[j], this.currentColors[i]]

            if (i === this.correctIndex) {
                this.correctIndex = j
            } else if (j === this.correctIndex) {
                this.correctIndex = i
            }
        }
    }

    colorDistance(color1, color2) {
        const rDiff = color1.r - color2.r
        const gDiff = color1.g - color2.g
        const bDiff = color1.b - color2.b
        return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff)
    }

    updateDisplay() {
        const correctColor = this.currentColors[this.correctIndex]

        const targetColorElement = document.getElementById("targetColor")
        targetColorElement.style.backgroundColor = this.colorToRgb(correctColor)
        targetColorElement.setAttribute("aria-label", `Target color: ${this.colorToHex(correctColor)}`)

        const showHex = Math.random() > 0.5
        const colorCodeElement = document.getElementById("colorCode")
        colorCodeElement.textContent = showHex ? this.colorToHex(correctColor) : this.colorToRgb(correctColor)

        const options = document.querySelectorAll(".color-option")
        options.forEach((option, index) => {
            option.style.backgroundColor = this.colorToRgb(this.currentColors[index])
            option.className = "color-option"
            option.disabled = false
            option.setAttribute("aria-label", `Color option ${index + 1}: ${this.colorToHex(this.currentColors[index])}`)
        })

        document.getElementById("score").textContent = this.score
        document.getElementById("round").textContent = this.round
        document.getElementById("streak").textContent = this.streak

        const feedback = document.getElementById("feedback")
        feedback.textContent = ""
        feedback.className = "feedback"

        const nextButton = document.getElementById("nextButton")
        nextButton.disabled = true
        nextButton.style.opacity = "0.6"
    }

    selectColor(index) {
        if (this.gameEnded) return

        const options = document.querySelectorAll(".color-option")
        const feedback = document.getElementById("feedback")
        const nextButton = document.getElementById("nextButton")

        options.forEach((option) => {
            option.disabled = true
        })

        this.sounds.click()

        if (index === this.correctIndex) {
            this.handleCorrectAnswer(options, feedback, index)
        } else {
            this.handleIncorrectAnswer(options, feedback, index)
        }

        nextButton.disabled = false
        nextButton.style.opacity = "1"

        if (this.isMobile) {
            this.gameTimer = setTimeout(() => {
                if (!nextButton.disabled) {
                    this.nextRound()
                }
            }, 2000)
        }
    }

    handleCorrectAnswer(options, feedback, index) {
        this.score++
        this.streak++

        if (this.streak >= 3) {
            this.score += Math.floor(this.streak / 3)
        }

        options[index].classList.add("correct")
        feedback.textContent =
            this.streak >= 3 ? `🎉 Correct! Streak bonus! (+${Math.floor(this.streak / 3)})` : "🎉 Correct!"
        feedback.className = "feedback correct"

        this.sounds.correct()
        this.createSuccessParticles()
    }

    handleIncorrectAnswer(options, feedback, index) {
        this.streak = 0

        options[index].classList.add("incorrect")
        options[this.correctIndex].classList.add("correct")

        feedback.textContent = "❌ Wrong! The correct answer is highlighted."
        feedback.className = "feedback incorrect"

        this.sounds.incorrect()
    }

    createSuccessParticles() {
        const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"]
        const targetColor = document.getElementById("targetColor")
        const rect = targetColor.getBoundingClientRect()

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement("div")
            particle.style.position = "fixed"
            particle.style.left = rect.left + rect.width / 2 + "px"
            particle.style.top = rect.top + rect.height / 2 + "px"
            particle.style.width = "8px"
            particle.style.height = "8px"
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
            particle.style.borderRadius = "50%"
            particle.style.pointerEvents = "none"
            particle.style.zIndex = "1000"

            document.body.appendChild(particle)

            const angle = (Math.PI * 2 * i) / 15
            const velocity = 100 + Math.random() * 100
            const vx = Math.cos(angle) * velocity
            const vy = Math.sin(angle) * velocity

            particle.animate(
                [{
                        transform: "translate(0, 0) scale(1)",
                        opacity: 1
                    },
                    {
                        transform: `translate(${vx}px, ${vy}px) scale(0)`,
                        opacity: 0
                    },
                ], {
                    duration: 1000,
                    easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                },
            ).onfinish = () => {
                particle.remove()
            }
        }
    }

    nextRound() {
        if (this.gameTimer) {
            clearTimeout(this.gameTimer)
        }

        if (this.round >= this.maxRounds) {
            this.endGame()
            return
        }

        this.round++
        this.generateRound()
        this.updateDisplay()

        const gameArea = document.getElementById("game-area")
        gameArea.style.opacity = "0.5"
        gameArea.style.transform = "scale(0.95)"

        setTimeout(() => {
            gameArea.style.opacity = "1"
            gameArea.style.transform = "scale(1)"
        }, 200)
    }

    async endGame() {
        this.gameEnded = true

        if (window.currentUser) {
            try {
                await fetch("/api/save_score", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        score: this.score,
                        total_rounds: this.maxRounds,
                    }),
                })
            } catch (error) {
                console.error("Failed to save score:", error)
            }
        }

        document.getElementById("game-area").style.display = "none"
        const gameOver = document.getElementById("gameOver")
        gameOver.style.display = "block"

        const finalScore = document.getElementById("finalScore")
        const performanceMessage = document.getElementById("performanceMessage")

        finalScore.textContent = `${this.score}/${this.maxRounds}`

        const percentage = (this.score / this.maxRounds) * 100
        let message = ""

        if (percentage === 100) {
            message = "🏆 Perfect! You're a true Color Master!"
        } else if (percentage >= 80) {
            message = "🌟 Excellent! You have a great eye for colors!"
        } else if (percentage >= 60) {
            message = "👍 Good job! Keep practicing to improve!"
        } else if (percentage >= 40) {
            message = "🎯 Not bad! Colors can be tricky!"
        } else {
            message = "🎨 Keep trying! Practice makes perfect!"
        }

        performanceMessage.textContent = message

        if (percentage >= 80) {
            this.createCelebrationEffect()
        }
    }

    createCelebrationEffect() {
        const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"]

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement("div")
            confetti.style.position = "fixed"
            confetti.style.left = Math.random() * window.innerWidth + "px"
            confetti.style.top = "-10px"
            confetti.style.width = Math.random() * 10 + 5 + "px"
            confetti.style.height = Math.random() * 10 + 5 + "px"
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
            confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0"
            confetti.style.pointerEvents = "none"
            confetti.style.zIndex = "1001"

            document.body.appendChild(confetti)

            const duration = Math.random() * 2000 + 2000
            const rotation = Math.random() * 720 - 360

            confetti.animate(
                [{
                        transform: "translateY(0) rotate(0deg)",
                        opacity: 1,
                    },
                    {
                        transform: `translateY(${window.innerHeight + 100}px) rotate(${rotation}deg)`,
                        opacity: 0,
                    },
                ], {
                    duration: duration,
                    easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                },
            ).onfinish = () => {
                confetti.remove()
            }
        }
    }

    restart() {
        this.score = 0
        this.round = 1
        this.streak = 0
        this.gameEnded = false

        if (this.gameTimer) {
            clearTimeout(this.gameTimer)
        }

        document.getElementById("game-area").style.display = "block"
        document.getElementById("gameOver").style.display = "none"

        this.generateRound()
        this.updateDisplay()

        const gameContainer = document.querySelector(".game-container")
        gameContainer.style.animation = "none"
        gameContainer.offsetHeight
        gameContainer.style.animation = "fadeInUp 0.6s ease"
    }
}

let game

function selectColor(index) {
    if (game) {
        game.selectColor(index)
    }
}

function nextRound() {
    if (game) {
        game.nextRound()
    }
}

function restartGame() {
    if (game) {
        game.restart()
    }
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        game = new ColorGuessingGame()

        const userElement = document.querySelector("[data-user]")
        if (userElement) {
            window.currentUser = JSON.parse(userElement.dataset.user)
        }
    } catch (error) {
        console.error("Failed to initialize Color Guessing Game:", error)

        const gameContainer = document.querySelector(".game-container")
        if (gameContainer) {
            gameContainer.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h2 style="color: #f44336; margin-bottom: 20px;">⚠️ Game Failed to Load</h2>
                    <p style="color: #666; margin-bottom: 20px;">Sorry, there was an error loading the game.</p>
                    <button onclick="location.reload()" class="btn btn-primary">
                        <i class="fas fa-refresh"></i>
                        Reload Page
                    </button>
                </div>
            `
        }
    }
})

document.addEventListener("visibilitychange", () => {
    if (game && document.hidden) {
        game.pauseGame()
    }
})

window.addEventListener("beforeunload", () => {
    if (game && game.gameTimer) {
        clearTimeout(game.gameTimer)
    }
})
