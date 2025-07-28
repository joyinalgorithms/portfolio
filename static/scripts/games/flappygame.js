class FlappyDroneGame {
    constructor() {
        this.canvas = document.getElementById("gameCanvas")
        this.ctx = this.canvas.getContext("2d")
        this.gameState = "start"
        this.gravity = 0.5
        this.jumpPower = -10
        this.pipeSpeed = 3
        this.pipeGap = 180
        this.pipeWidth = 80
        this.drone = {
            x: 150,
            y: 300,
            width: 40,
            height: 30,
            velocity: 0,
            rotation: 0,
        }
        this.pipes = []
        this.particles = []
        this.score = 0
        this.highScore = this.loadHighScore()
        this.lastPipeTime = 0
        this.pipeInterval = 2000

        this.setupEventListeners()
        this.updateHighScoreDisplay()
        this.gameLoop()
    }

    setupEventListeners() {
        document.addEventListener("keydown", (e) => {
            if (e.code === "Space") {
                e.preventDefault()
                this.jump()
            }
        })
        this.canvas.addEventListener("click", () => {
            this.jump()
        })
    }

    jump() {
        if (this.gameState === "playing") {
            this.drone.velocity = this.jumpPower
            this.createParticles(this.drone.x, this.drone.y + this.drone.height)
        }
    }

    createParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 4 + 2,
                life: 30,
                maxLife: 30,
            })
        }
    }

    update() {
        if (this.gameState !== "playing") return

        this.drone.velocity += this.gravity
        this.drone.y += this.drone.velocity
        this.drone.rotation = Math.min(Math.max(this.drone.velocity * 3, -30), 90)

        const currentTime = Date.now()
        if (currentTime - this.lastPipeTime > this.pipeInterval) {
            this.createPipe()
            this.lastPipeTime = currentTime
        }

        this.pipes.forEach((pipe) => {
            pipe.x -= this.pipeSpeed
            if (!pipe.scored && pipe.x + this.pipeWidth < this.drone.x) {
                pipe.scored = true
                this.score++
                this.updateScoreDisplay()
            }
        })
        this.pipes = this.pipes.filter((pipe) => pipe.x > -this.pipeWidth)
        this.particles.forEach((particle) => {
            particle.x += particle.vx
            particle.y += particle.vy
            particle.life--
        })
        this.particles = this.particles.filter((particle) => particle.life > 0)

        this.checkCollisions()
    }

    createPipe() {
        const minHeight = 100
        const maxHeight = this.canvas.height - this.pipeGap - minHeight
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight

        this.pipes.push({
            x: this.canvas.width,
            topHeight: topHeight,
            bottomY: topHeight + this.pipeGap,
            bottomHeight: this.canvas.height - (topHeight + this.pipeGap),
            scored: false,
        })
    }

    checkCollisions() {
        if (this.drone.y <= 0 || this.drone.y + this.drone.height >= this.canvas.height) {
            this.gameOver()
            return
        }

        this.pipes.forEach((pipe) => {
            if (this.drone.x < pipe.x + this.pipeWidth && this.drone.x + this.drone.width > pipe.x) {
                if (this.drone.y < pipe.topHeight || this.drone.y + this.drone.height > pipe.bottomY) {
                    this.gameOver()
                }
            }
        })
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawBackground()

        if (this.gameState === "playing") {
            this.pipes.forEach((pipe) => this.drawPipe(pipe))
            this.particles.forEach((particle) => this.drawParticle(particle))
        }
        this.drawDrone()
    }

    drawBackground() {
        const time = Date.now() * 0.001
        this.ctx.fillStyle = "rgba(0, 255, 65, 0.1)"
        this.ctx.font = "12px Courier New"

        for (let i = 0; i < 5; i++) {
            const x = ((time * 20 + i * 160) % (this.canvas.width + 100)) - 100
            const y = 100 + Math.sin(time + i) * 50
            this.ctx.fillText('{ code: "flying" }', x, y)
        }
    }

    drawDrone() {
        this.ctx.save()
        this.ctx.translate(this.drone.x + this.drone.width / 2, this.drone.y + this.drone.height / 2)
        this.ctx.rotate((this.drone.rotation * Math.PI) / 180)
        this.ctx.fillStyle = "#00ff41"
        this.ctx.fillRect(-this.drone.width / 2, -this.drone.height / 2, this.drone.width, this.drone.height)
        this.ctx.fillStyle = "#ffffff"
        this.ctx.fillRect(-15, -10, 8, 8)
        this.ctx.fillRect(7, -10, 8, 8)
        this.ctx.strokeStyle = "#00ff41"
        this.ctx.lineWidth = 2
        this.ctx.beginPath()
        this.ctx.arc(-10, -15, 8, 0, Math.PI * 2)
        this.ctx.arc(10, -15, 8, 0, Math.PI * 2)
        this.ctx.stroke()

        this.ctx.restore()
    }

    drawPipe(pipe) {
        this.ctx.fillStyle = "#2c3e50"
        this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight)
        this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, pipe.bottomHeight)
        this.ctx.fillStyle = "#34495e"
        this.ctx.fillRect(pipe.x + 5, 5, this.pipeWidth - 10, pipe.topHeight - 10)
        this.ctx.fillRect(pipe.x + 5, pipe.bottomY + 5, this.pipeWidth - 10, pipe.bottomHeight - 10)

        for (let i = 0; i < Math.floor(pipe.topHeight / 30); i++) {
            this.ctx.fillStyle = Math.random() > 0.5 ? "#00ff41" : "#ff4444"
            this.ctx.fillRect(pipe.x + 10, 15 + i * 30, 4, 4)
            this.ctx.fillRect(pipe.x + this.pipeWidth - 14, 15 + i * 30, 4, 4)
        }
        for (let i = 0; i < Math.floor(pipe.bottomHeight / 30); i++) {
            this.ctx.fillStyle = Math.random() > 0.5 ? "#00ff41" : "#ff4444"
            this.ctx.fillRect(pipe.x + 10, pipe.bottomY + 15 + i * 30, 4, 4)
            this.ctx.fillRect(pipe.x + this.pipeWidth - 14, pipe.bottomY + 15 + i * 30, 4, 4)
        }
    }

    drawParticle(particle) {
        const alpha = particle.life / particle.maxLife
        this.ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`
        this.ctx.fillRect(particle.x, particle.y, 3, 3)
    }

    gameLoop() {
        this.update()
        this.render()
        requestAnimationFrame(() => this.gameLoop())
    }

    startGame() {
        this.gameState = "playing"
        this.resetGame()
        document.getElementById("startScreen").classList.add("hidden")
    }

    gameOver() {
        this.gameState = "gameOver"
        if (this.score > this.highScore) {
            this.highScore = this.score
            this.saveHighScore()
            this.updateHighScoreDisplay()
        }
        document.getElementById("finalScore").textContent = `Score: ${this.score}`
        document.getElementById("gameOverScreen").classList.remove("hidden")
    }

    resetGame() {
        this.drone.y = 300
        this.drone.velocity = 0
        this.pipes = []
        this.particles = []
        this.score = 0
        this.lastPipeTime = Date.now()
        this.updateScoreDisplay()
    }

    restartGame() {
        document.getElementById("gameOverScreen").classList.add("hidden")
        this.startGame()
    }

    goToStart() {
        this.gameState = "start"
        document.getElementById("gameOverScreen").classList.add("hidden")
        document.getElementById("startScreen").classList.remove("hidden")
        this.resetGame()
    }

    updateScoreDisplay() {
        document.getElementById("score").textContent = `Score: ${this.score}`
    }

    updateHighScoreDisplay() {
        document.getElementById("highScore").textContent = `Best: ${this.highScore}`
    }

    saveHighScore() {
        localStorage.setItem("flappyDroneHighScore", this.highScore.toString())
    }

    loadHighScore() {
        const saved = localStorage.getItem("flappyDroneHighScore")
        return saved ? Number.parseInt(saved) : 0
    }
}

let game

function startGame() {
    game.startGame()
}

function restartGame() {
    game.restartGame()
}

function goToStart() {
    game.goToStart()
}

window.addEventListener("load", () => {
    game = new FlappyDroneGame()
})
