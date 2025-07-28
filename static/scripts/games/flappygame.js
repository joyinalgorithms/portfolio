class FlappyDroneGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas")
    this.ctx = this.canvas.getContext("2d")
    this.gameState = "start" // 'start', 'playing', 'gameOver'
    this.gravity = 0.5
    this.jumpPower = -10
    this.pipeSpeed = 3
    this.pipeGap = 180 // Gap between top and bottom pipes
    this.pipeWidth = 80
    this.drone = {
      x: 150,
      y: 300,
      width: 40,
      height: 30,
      velocity: 0,
      rotation: 0, // in degrees
    }
    this.pipes = []
    this.particles = [] // For jump effect
    this.score = 0
    this.highScore = this.loadHighScore()
    this.lastPipeTime = 0
    this.pipeInterval = 2000 // Time between new pipes in ms

    this.setupEventListeners()
    this.updateHighScoreDisplay()
    this.gameLoop()
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault() // Prevent scrolling
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
      this.createParticles(this.drone.x, this.drone.y + this.drone.height) // Particles from bottom of drone
    }
  }

  createParticles(x, y) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: Math.random() * 4 - 2, // Horizontal velocity
        vy: Math.random() * 4 + 2, // Upward velocity
        life: 30, // Frames until particle disappears
        maxLife: 30,
      })
    }
  }

  update() {
    if (this.gameState !== "playing") return

    // Update drone
    this.drone.velocity += this.gravity
    this.drone.y += this.drone.velocity
    // Rotate drone based on velocity
    this.drone.rotation = Math.min(Math.max(this.drone.velocity * 3, -30), 90) // Clamp rotation between -30 and 90 degrees

    // Generate pipes
    const currentTime = Date.now()
    if (currentTime - this.lastPipeTime > this.pipeInterval) {
      this.createPipe()
      this.lastPipeTime = currentTime
    }

    // Update pipes
    this.pipes.forEach((pipe) => {
      pipe.x -= this.pipeSpeed
      // Check for score
      if (!pipe.scored && pipe.x + this.pipeWidth < this.drone.x) {
        pipe.scored = true
        this.score++
        this.updateScoreDisplay()
      }
    })
    // Remove off-screen pipes
    this.pipes = this.pipes.filter((pipe) => pipe.x > -this.pipeWidth)

    // Update particles
    this.particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life--
    })
    // Remove dead particles
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
    // Wall collisions
    if (this.drone.y <= 0 || this.drone.y + this.drone.height >= this.canvas.height) {
      this.gameOver()
      return
    }

    // Pipe collisions
    this.pipes.forEach((pipe) => {
      // Check if drone is horizontally within pipe
      if (this.drone.x < pipe.x + this.pipeWidth && this.drone.x + this.drone.width > pipe.x) {
        // Check if drone is vertically colliding with top or bottom pipe
        if (this.drone.y < pipe.topHeight || this.drone.y + this.drone.height > pipe.bottomY) {
          this.gameOver()
        }
      }
    })
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // Clear canvas
    this.drawBackground() // Draw dynamic background elements

    if (this.gameState === "playing") {
      this.pipes.forEach((pipe) => this.drawPipe(pipe))
      this.particles.forEach((particle) => this.drawParticle(particle))
    }
    this.drawDrone()
  }

  drawBackground() {
    // Simulate binary code or data stream
    const time = Date.now() * 0.001 // Time in seconds
    this.ctx.fillStyle = "rgba(0, 255, 65, 0.1)" // Semi-transparent neon green
    this.ctx.font = "12px Courier New" // Monospace font for code feel

    // Draw moving text elements
    for (let i = 0; i < 5; i++) {
      const x = ((time * 20 + i * 160) % (this.canvas.width + 100)) - 100 // Scroll horizontally
      const y = 100 + Math.sin(time + i) * 50 // Oscillate vertically
      this.ctx.fillText('{ code: "flying" }', x, y)
    }
  }

  drawDrone() {
    this.ctx.save() // Save current canvas state
    // Move origin to drone's center for rotation
    this.ctx.translate(this.drone.x + this.drone.width / 2, this.drone.y + this.drone.height / 2)
    this.ctx.rotate((this.drone.rotation * Math.PI) / 180) // Convert degrees to radians

    // Drone body (main rectangle)
    this.ctx.fillStyle = "#00ff41" // Neon green
    this.ctx.fillRect(-this.drone.width / 2, -this.drone.height / 2, this.drone.width, this.drone.height)

    // Drone "eyes" or sensors
    this.ctx.fillStyle = "#ffffff" // White
    this.ctx.fillRect(-15, -10, 8, 8) // Left eye
    this.ctx.fillRect(7, -10, 8, 8) // Right eye

    // Drone "propellers" or wings (circles)
    this.ctx.strokeStyle = "#00ff41"
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.arc(-10, -15, 8, 0, Math.PI * 2) // Top-left
    this.ctx.arc(10, -15, 8, 0, Math.PI * 2) // Top-right
    this.ctx.stroke()

    this.ctx.restore() // Restore canvas state
  }

  drawPipe(pipe) {
    // Main pipe body (dark grey)
    this.ctx.fillStyle = "#2c3e50" // Dark grey
    this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight)
    this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, pipe.bottomHeight)

    // Inner pipe detail (lighter grey)
    this.ctx.fillStyle = "#34495e" // Lighter grey
    this.ctx.fillRect(pipe.x + 5, 5, this.pipeWidth - 10, pipe.topHeight - 10)
    this.ctx.fillRect(pipe.x + 5, pipe.bottomY + 5, this.pipeWidth - 10, pipe.bottomHeight - 10)

    // Simulate server rack lights (random colors)
    for (let i = 0; i < Math.floor(pipe.topHeight / 30); i++) {
      this.ctx.fillStyle = Math.random() > 0.5 ? "#00ff41" : "#ff4444" // Green or Red
      this.ctx.fillRect(pipe.x + 10, 15 + i * 30, 4, 4) // Left light
      this.ctx.fillRect(pipe.x + this.pipeWidth - 14, 15 + i * 30, 4, 4) // Right light
    }
    for (let i = 0; i < Math.floor(pipe.bottomHeight / 30); i++) {
      this.ctx.fillStyle = Math.random() > 0.5 ? "#00ff41" : "#ff4444"
      this.ctx.fillRect(pipe.x + 10, pipe.bottomY + 15 + i * 30, 4, 4)
      this.ctx.fillRect(pipe.x + this.pipeWidth - 14, pipe.bottomY + 15 + i * 30, 4, 4)
    }
  }

  drawParticle(particle) {
    const alpha = particle.life / particle.maxLife // Fade out
    this.ctx.fillStyle = `rgba(0, 255, 65, ${alpha})` // Neon green, fading
    this.ctx.fillRect(particle.x, particle.y, 3, 3) // Small square particle
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
    this.lastPipeTime = Date.now() // Reset pipe timer
    this.updateScoreDisplay()
  }

  restartGame() {
    document.getElementById("gameOverScreen").classList.add("hidden")
    this.startGame() // Calls resetGame internally
  }

  goToStart() {
    this.gameState = "start"
    document.getElementById("gameOverScreen").classList.add("hidden")
    document.getElementById("startScreen").classList.remove("hidden")
    this.resetGame() // Reset game state for next start
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

// Global game instance and helper functions for HTML buttons
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

// Initialize game when window loads
window.addEventListener("load", () => {
  game = new FlappyDroneGame()
})
