class ScrabbleScorer {
    constructor() {
        this.points = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10];
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        this.word1Input = document.getElementById('word1');
        this.word2Input = document.getElementById('word2');
        this.score1Display = document.getElementById('score1');
        this.score2Display = document.getElementById('score2');
        this.tiles1 = document.getElementById('tiles1');
        this.tiles2 = document.getElementById('tiles2');
        this.playButton = document.getElementById('playButton');
        this.loading = document.getElementById('loading');
        this.winnerAnnouncement = document.getElementById('winnerAnnouncement');
        this.winnerText = document.getElementById('winnerText');
        this.player1Section = document.getElementById('player1Section');
        this.player2Section = document.getElementById('player2Section');

        this.init();
    }

    init() {
        this.createLetterValues();
        this.setupEventListeners();
    }

    createLetterValues() {
        const valuesGrid = document.getElementById('valuesGrid');

        for (let i = 0; i < this.alphabet.length; i++) {
            const tile = document.createElement('div');
            tile.className = 'value-tile';
            tile.textContent = this.alphabet[i];
            tile.setAttribute('data-points', this.points[i]);
            valuesGrid.appendChild(tile);
        }
    }

    setupEventListeners() {
        this.word1Input.addEventListener('input', (e) => this.handleWordInput(e, 1));
        this.word2Input.addEventListener('input', (e) => this.handleWordInput(e, 2));
        this.playButton.addEventListener('click', () => this.playGame());

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.playGame();
            }
        });
    }

    handleWordInput(e, player) {
        const word = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
        e.target.value = word;

        this.updateLetterTiles(word, player);
        this.updateScore(word, player);
        this.clearWinner();
    }

    updateLetterTiles(word, player) {
        const tilesContainer = player === 1 ? this.tiles1 : this.tiles2;
        tilesContainer.innerHTML = '';

        for (let char of word) {
            if (char.match(/[A-Z]/)) {
                const tile = document.createElement('div');
                tile.className = 'letter-tile';
                tile.textContent = char;

                const index = char.charCodeAt(0) - 65;
                tile.setAttribute('data-points', this.points[index]);

                tilesContainer.appendChild(tile);
            }
        }
    }

    updateScore(word, player) {
        const score = this.computeScore(word);
        const scoreDisplay = player === 1 ? this.score1Display : this.score2Display;

        scoreDisplay.classList.add('updating');
        setTimeout(() => {
            scoreDisplay.textContent = score;
            scoreDisplay.classList.remove('updating');
        }, 250);
    }

    computeScore(word) {
        let score = 0;
        for (let char of word) {
            if (char.match(/[A-Z]/)) {
                const index = char.charCodeAt(0) - 65;
                score += this.points[index];
            }
        }
        return score;
    }

    async playGame() {
        const word1 = this.word1Input.value.trim();
        const word2 = this.word2Input.value.trim();

        if (!word1 || !word2) {
            alert('Both players must enter a word!');
            return;
        }

        this.showLoading(true);
        this.playButton.disabled = true;

        try {
            const response = await fetch('/play', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    word1: word1,
                    word2: word2
                })
            });

            const data = await response.json();

            await new Promise(resolve => setTimeout(resolve, 1500));

            this.displayWinner(data.winner, data.score1, data.score2);

        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const score1 = this.computeScore(word1.toUpperCase());
            const score2 = this.computeScore(word2.toUpperCase());

            let winner;
            if (score1 > score2) {
                winner = "Player 1 wins!";
            } else if (score2 > score1) {
                winner = "Player 2 wins!";
            } else {
                winner = "It's a tie!";
            }

            this.displayWinner(winner, score1, score2);
        } finally {
            this.showLoading(false);
            this.playButton.disabled = false;
        }
    }

    displayWinner(winner, score1, score2) {
        this.score1Display.textContent = score1;
        this.score2Display.textContent = score2;

        this.winnerText.textContent = winner;
        this.winnerAnnouncement.classList.add('show');

        this.clearWinner();
        if (winner.includes('Player 1')) {
            this.player1Section.classList.add('winner');
            this.createConfetti();
        } else if (winner.includes('Player 2')) {
            this.player2Section.classList.add('winner');
            this.createConfetti();
        }
    }

    clearWinner() {
        this.winnerAnnouncement.classList.remove('show');
        this.player1Section.classList.remove('winner');
        this.player2Section.classList.remove('winner');
    }

    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
    }

    createConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = this.getRandomColor();
                confetti.style.animationDelay = Math.random() * 3 + 's';
                document.body.appendChild(confetti);

                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 100);
        }
    }

    getRandomColor() {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScrabbleScorer();
});
