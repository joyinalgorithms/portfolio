document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll("[data-cell]");
    let xTurn = true;
    let board = ["", "", "", "", "", "", "", "", ""];

    const soundX = new Audio('/static/sounds/place_x.mp3');
    const soundO = new Audio('/static/sounds/place_o.mp3');
    const soundWin = new Audio('/static/sounds/win.mp3');
    const soundDraw = new Audio('/static/sounds/draw.mp3');

    const messageContainer = document.getElementById("message-container");
    const messageText = document.getElementById("message-text");
    const restartButton = document.getElementById("restart-button");

    restartButton.addEventListener("click", restartGame);

    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            if (cell.hasChildNodes() || board[index] || !xTurn) return;

            placeMark(cell, index, "X");

            if (checkWin("X")) {
                soundWin.play();
                showMessage("X wins!");
                return;
            } else if (checkDraw()) {
                soundDraw.play();
                showMessage("It's a draw!");
                return;
            }

            xTurn = false;
            aiMove();
        });
    });

    function placeMark(cell, index, player) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 60 60");
        svg.setAttribute("width", "60");
        svg.setAttribute("height", "60");
        svg.style.transition = "transform 0.2s ease";
        svg.style.transform = "scale(1.05)";
        setTimeout(() => {
            svg.style.transform = "scale(1)";
        }, 100);

        if (player === "X") {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M10 10 L50 50 M50 10 L10 50");
            path.setAttribute("stroke", "#2196f3");
            path.style.strokeLinecap = "round";
            path.style.strokeWidth = "5";
            svg.appendChild(path);
            soundX.play();
        } else {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", "30");
            circle.setAttribute("cy", "30");
            circle.setAttribute("r", "20");
            circle.setAttribute("stroke", "#f44336");
            circle.setAttribute("fill", "none");
            circle.style.strokeLinecap = "round";
            circle.style.strokeWidth = "5";
            circle.style.strokeDasharray = 125.6;
            circle.style.strokeDashoffset = 125.6;
            circle.style.animation = "draw 0.4s ease-out forwards";
            svg.appendChild(circle);
            soundO.play();
        }

        cell.appendChild(svg);
        board[index] = player;
    }

    function checkWin(player) {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => board[index] === player);
        });
    }

    function showMessage(text) {
        messageText.textContent = text;
        messageContainer.classList.remove("hidden");
        cells.forEach(cell => cell.style.pointerEvents = "none");
    }

    function restartGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        xTurn = true;
        cells.forEach(cell => {
            cell.innerHTML = "";
            cell.style.pointerEvents = "auto";
        });
        messageContainer.classList.add("hidden");
    }

    function checkDraw() {
        return board.every(cell => cell !== "");
    }

    function aiMove() {
        const emptyCells = board
            .map((val, idx) => val === "" ? idx : null)
            .filter(idx => idx !== null);

        if (emptyCells.length === 0) return;

        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

        setTimeout(() => {
            placeMark(cells[randomIndex], randomIndex, "O");

            if (checkWin("O")) {
                soundWin.play();
                showMessage("O wins!");
                return;
            } else if (checkDraw()) {
                soundDraw.play();
                showMessage("It's a draw!");
                return;
            }

            xTurn = true;
        }, 500);
    }

});
