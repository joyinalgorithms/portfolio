document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board")
    const scoreElement = document.getElementById("score")
    const highScoreElement = document.getElementById("highScore")
    const finalScoreElement = document.getElementById("final-score")
    const gameOverScreen = document.getElementById("game-over")
    const startScreen = document.getElementById("start-screen")
    const startBtn = document.getElementById("start-btn")
    const restartBtn = document.getElementById("restart-btn")

    const gridSize = 20
    const initialSpeed = 200
    const speedIncrease = 5

    let snake = []
    let food = {}
    let direction = "right"
    let nextDirection = "right"
    let gameInterval
    let score = 0
    let highScore = localStorage.getItem("snakeHighScore") || 0
    let gameSpeed = initialSpeed
    let gameActive = false

    let touchStartX = 0
    let touchStartY = 0

    highScoreElement.textContent = highScore

    function createGameElement(tag, className) {
        const element = document.createElement(tag)
        element.className = className
        return element
    }

    function setPosition(element, position) {
        element.style.gridColumn = position.x
        element.style.gridRow = position.y
    }

    function initGame() {
        snake = [{
                x: 10,
                y: 10
            },
            {
                x: 9,
                y: 10
            },
            {
                x: 8,
                y: 10
            },
        ]
        score = 0
        gameSpeed = initialSpeed
        direction = "right"
        nextDirection = "right"
        scoreElement.textContent = "0"
        gameBoard.innerHTML = ""

        snake.forEach((segment, index) => {
            const snakeElement = createGameElement("div", index === 0 ? "snake-head" : "snake")
            setPosition(snakeElement, segment)
            gameBoard.appendChild(snakeElement)
        })

        createFood()
        gameActive = true
        gameInterval = setInterval(moveSnake, gameSpeed)
    }

    function createFood() {
        let foodPosition
        do {
            foodPosition = {
                x: Math.floor(Math.random() * gridSize) + 1,
                y: Math.floor(Math.random() * gridSize) + 1,
            }
        } while (snake.some((segment) => segment.x === foodPosition.x && segment.y === foodPosition.y))

        food = foodPosition
        const foodElement = createGameElement("div", "food")
        setPosition(foodElement, foodPosition)
        gameBoard.appendChild(foodElement)
    }


    function moveSnake() {
        if (!gameActive) return

        direction = nextDirection

        const head = {
            ...snake[0]
        }

        switch (direction) {
            case "up":
                head.y--
                break
            case "down":
                head.y++
                break
            case "left":
                head.x--
                break
            case "right":
                head.x++
                break
        }

        if (
            head.x < 1 ||
            head.x > gridSize ||
            head.y < 1 ||
            head.y > gridSize ||
            snake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
            gameOver()
            return
        }

        snake.unshift(head)

        const ateFood = head.x === food.x && head.y === food.y
        if (ateFood) {
            const foodElement = document.querySelector(".food")
            if (foodElement) {
                foodElement.remove()
            }
            score += 10
            scoreElement.textContent = score
            createFood()


            gameSpeed = Math.max(50, gameSpeed - speedIncrease)
            clearInterval(gameInterval)
            gameInterval = setInterval(moveSnake, gameSpeed)
        } else {
            snake.pop()
        }

        updateSnakeDisplay()
    }

    function updateSnakeDisplay() {
        const existingSnakeElements = document.querySelectorAll(".snake, .snake-head")
        existingSnakeElements.forEach((element) => element.remove())

        snake.forEach((segment, index) => {
            const snakeElement = createGameElement("div", index === 0 ? "snake-head" : "snake")
            setPosition(snakeElement, segment)
            gameBoard.appendChild(snakeElement)
        })
    }

    function gameOver() {
        gameActive = false
        clearInterval(gameInterval)

        if (score > highScore) {
            highScore = score
            localStorage.setItem("snakeHighScore", highScore)
            highScoreElement.textContent = highScore
        }

        finalScoreElement.textContent = score
        gameOverScreen.classList.remove("hidden")
        gameOverScreen.classList.add("visible")
    }

    document.addEventListener("keydown", (e) => {
        if (!gameActive) return

        switch (e.key) {
            case "ArrowUp":
                if (direction !== "down") nextDirection = "up"
                break
            case "ArrowDown":
                if (direction !== "up") nextDirection = "down"
                break
            case "ArrowLeft":
                if (direction !== "right") nextDirection = "left"
                break
            case "ArrowRight":
                if (direction !== "left") nextDirection = "right"
                break
        }
    })

    gameBoard.addEventListener(
        "touchstart",
        (e) => {
            touchStartX = e.changedTouches[0].screenX
            touchStartY = e.changedTouches[0].screenY
        },
        false,
    )

    gameBoard.addEventListener(
            "touchend",
            (e) => {
                if (!gameActive) return

                const touchEndX = e.changedTouches[0].screenX
                const touchEndY = e.changedTouches[0].screenY

                const deltaX = touchEndX - touchStartX
                const deltaY = touchEndY - touchStartY

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 0 && direction !== "left") {
                        nextDirection = "right"
                    } else if (deltaX < 0 && direction !== "right") {
                        nextDirection = "left"
                    }
                } else
                if (deltaY > 0 && direction !== "up") {
                    nextDirection = "down"
                } else if (deltaY < 0 && direction !== "down") {
                    nextDirection = "up"
                }
            }
        },
        false,
)

gameBoard.addEventListener(
    "touchmove",
    (e) => {
        if (gameActive) {
            e.preventDefault()
        }
    }, {
        passive: false
    },
)

startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden")
    startScreen.classList.remove("visible")
    initGame()
})

restartBtn.addEventListener("click", () => {
    gameOverScreen.classList.add("hidden")
    gameOverScreen.classList.remove("visible")
    initGame()
})
})
