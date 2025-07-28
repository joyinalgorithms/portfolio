document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll("[data-cell]")
    const messageContainer = document.getElementById("message-container")
    const messageText = document.getElementById("message-text")
    const restartButton = document.getElementById("restart-button")

    let xTurn = true
    let board = ["", "", "", "", "", "", "", "", ""]
    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    const soundX = new Audio("/static/sounds/place_x.mp3")
    const soundO = new Audio("/static/sounds/place_o.mp3")
    const soundWin = new Audio("/static/sounds/win.mp3")
    const soundDraw = new Audio("/static/sounds/draw.mp3")

    restartButton.addEventListener("click", restartGame)
    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => handleCellClick(cell, index))
    })

    function handleCellClick(cell, index) {
        if (board[index] !== "" || !xTurn || messageContainer.classList.contains("visible")) {
            return
        }

        placeMark(cell, index, "X")

        if (checkWin("X")) {
            soundWin.play()
            showMessage("X wins!", "win")
            return
        } else if (checkDraw()) {
            soundDraw.play()
            showMessage("It's a draw!", "draw")
            return
        }

        xTurn = false
        setTimeout(aiMove, 700)
    }

    function placeMark(cell, index, player) {
        cell.innerHTML = ""

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute("viewBox", "0 0 60 60")
        svg.setAttribute("width", "60")
        svg.setAttribute("height", "60")

        if (player === "X") {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
            path.setAttribute("d", "M10 10 L50 50 M50 10 L10 50")
            path.setAttribute("stroke", "var(--primary-color)")
            svg.appendChild(path)
            soundX.play()
        } else {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
            circle.setAttribute("cx", "30")
            circle.setAttribute("cy", "30")
            circle.setAttribute("r", "20")
            circle.setAttribute("stroke", "var(--secondary-color)")
            circle.setAttribute("fill", "none")
            svg.appendChild(circle)
            soundO.play()
        }
        cell.appendChild(svg)
        board[index] = player
    }

    function checkWin(player) {
        return WINNING_COMBINATIONS.some((combination) => {
            return combination.every((index) => board[index] === player)
        })
    }

    function checkDraw() {
        return board.every((cell) => cell !== "")
    }

    function showMessage(text, type) {
        messageText.textContent = text
        messageContainer.classList.remove("hidden")
        messageContainer.classList.add("visible")
        messageText.className = ""
        if (type === "win") {
            messageText.classList.add("win-message")
        } else if (type === "draw") {
            messageText.classList.add("draw-message")
        } else if (type === "lose") {
            messageText.classList.add("lose-message")
        }
        cells.forEach((cell) => (cell.style.pointerEvents = "none"))
    }

    function restartGame() {
        board = ["", "", "", "", "", "", "", "", ""]
        xTurn = true
        cells.forEach((cell) => {
            cell.innerHTML = ""
            cell.style.pointerEvents = "auto"
        })
        messageContainer.classList.add("hidden")
        messageContainer.classList.remove("visible")
        messageText.className = ""
    }

    function aiMove() {
        const emptyCells = board.map((val, idx) => (val === "" ? idx : null)).filter((idx) => idx !== null)

        if (emptyCells.length === 0) {
            return
        }

        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)]
        const aiCell = cells[randomIndex]

        placeMark(aiCell, randomIndex, "O")

        if (checkWin("O")) {
            soundWin.play()
            showMessage("O wins!", "lose")
            return
        } else if (checkDraw()) {
            soundDraw.play()
            showMessage("It's a draw!", "draw")
            return
        }

        xTurn = true
    }
})
