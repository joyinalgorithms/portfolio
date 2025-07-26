const techSymbols = [
    '⚛️', '🐍', '☕', '🔥', '⚡', '🌐', '💾', '🖥️',
    '📱', '🔧', '🚀', '💻', '🔒', '☁️', '🎯', '⚙️'
];

let gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    startTime: null,
    timer: null,
    gameActive: false
};

function initializeGame() {
    const selectedSymbols = techSymbols.slice(0, 8);
    const cardSymbols = [...selectedSymbols, ...selectedSymbols];

    gameState.cards = shuffleArray(cardSymbols).map((symbol, index) => ({
        id: index,
        symbol: symbol,
        isFlipped: false,
        isMatched: false
    }));

    renderGameBoard();
    resetGameStats();
    loadHighScores();
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function renderGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    gameState.cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.cardId = card.id;
        cardElement.onclick = () => flipCard(card.id);

        cardElement.innerHTML = `
            <div class="card-front"></div>
            <div class="card-back">${card.symbol}</div>
        `;

        gameBoard.appendChild(cardElement);
    });
}

function flipCard(cardId) {
    if (!gameState.gameActive) {
        startGame();
    }

    const card = gameState.cards[cardId];
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);

    if (card.isFlipped || card.isMatched || gameState.flippedCards.length >= 2) {
        return;
    }

    card.isFlipped = true;
    cardElement.classList.add('flipped');
    gameState.flippedCards.push(card);

    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        updateMoves();

        setTimeout(() => {
            checkForMatch();
        }, 1000);
    }
}

function checkForMatch() {
    const [card1, card2] = gameState.flippedCards;
    const card1Element = document.querySelector(`[data-card-id="${card1.id}"]`);
    const card2Element = document.querySelector(`[data-card-id="${card2.id}"]`);

    if (card1.symbol === card2.symbol) {
        card1.isMatched = true;
        card2.isMatched = true;
        card1Element.classList.add('matched');
        card2Element.classList.add('matched');

        gameState.matchedPairs++;
        updateMatches();

        if (gameState.matchedPairs === 8) {
            endGame();
        }
    } else {
        card1.isFlipped = false;
        card2.isFlipped = false;
        card1Element.classList.remove('flipped');
        card2Element.classList.remove('flipped');
    }

    gameState.flippedCards = [];
}

function startGame() {
    gameState.gameActive = true;
    gameState.startTime = Date.now();
    gameState.timer = setInterval(updateTimer, 1000);
}

function endGame() {
    gameState.gameActive = false;
    clearInterval(gameState.timer);

    const endTime = Date.now();
    const totalTime = Math.floor((endTime - gameState.startTime) / 1000);
    const score = calculateScore(totalTime, gameState.moves);

    saveHighScore(totalTime, gameState.moves, score);

    document.getElementById('finalTime').textContent = formatTime(totalTime);
    document.getElementById('finalMoves').textContent = gameState.moves;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverModal').style.display = 'flex';
}

function calculateScore(time, moves) {
    const baseScore = 1000;
    const timePenalty = time * 2;
    const movePenalty = moves * 10;
    return Math.max(100, baseScore - timePenalty - movePenalty);
}

function updateTimer() {
    if (!gameState.gameActive) return;

    const currentTime = Date.now();
    const elapsed = Math.floor((currentTime - gameState.startTime) / 1000);
    document.getElementById('timer').textContent = formatTime(elapsed);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateMoves() {
    document.getElementById('moves').textContent = gameState.moves;
}

function updateMatches() {
    document.getElementById('matches').textContent = gameState.matchedPairs;
}

function resetGameStats() {
    gameState.moves = 0;
    gameState.matchedPairs = 0;
    gameState.flippedCards = [];
    gameState.gameActive = false;
    gameState.startTime = null;

    if (gameState.timer) {
        clearInterval(gameState.timer);
    }

    document.getElementById('timer').textContent = '00:00';
    document.getElementById('moves').textContent = '0';
    document.getElementById('matches').textContent = '0';
}

function startNewGame() {
    initializeGame();
}

function closeGameOver() {
    document.getElementById('gameOverModal').style.display = 'none';
    startNewGame();
}

function saveHighScore(time, moves, score) {
    const highScores = getHighScores();
    const newScore = {
        date: new Date().toLocaleDateString(),
        time: time,
        moves: moves,
        score: score
    };

    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);

    const topScores = highScores.slice(0, 5);
    localStorage.setItem('techMemoryHighScores', JSON.stringify(topScores));

    loadHighScores();
}

function getHighScores() {
    const scores = localStorage.getItem('techMemoryHighScores');
    return scores ? JSON.parse(scores) : [];
}

function loadHighScores() {
    const highScores = getHighScores();
    const highScoresList = document.getElementById('highScoresList');

    if (highScores.length === 0) {
        highScoresList.innerHTML = '<div class="score-item"><span>No scores yet</span><span>-</span></div>';
        return;
    }

    highScoresList.innerHTML = highScores.map((score, index) => `
        <div class="score-item">
            <span>#${index + 1} (${score.date})</span>
            <span>${score.score} pts</span>
        </div>
    `).join('');
}

function resetStats() {
    if (confirm('Are you sure you want to reset all high scores?')) {
        localStorage.removeItem('techMemoryHighScores');
        loadHighScores();
    }
}

document.addEventListener('DOMContentLoaded', initializeGame);
