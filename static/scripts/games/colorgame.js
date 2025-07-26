class ColorGuessingGame {
    constructor() {
        this.score = 0;
        this.round = 1;
        this.streak = 0;
        this.maxRounds = 10;
        this.currentColors = [];
        this.correctIndex = 0;
        this.gameEnded = false;

        this.initGame();
    }

    initGame() {
        this.generateRound();
        this.updateDisplay();
    }

    generateRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return {
            r,
            g,
            b
        };
    }

    colorToRgb(color) {
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }

    colorToHex(color) {
        const toHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();
        return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
    }

    generateSimilarColor(baseColor, variation = 50) {
        const vary = () => Math.max(0, Math.min(255,
            baseColor.r + (Math.random() - 0.5) * variation * 2
        ));

        return {
            r: Math.max(0, Math.min(255, baseColor.r + (Math.random() - 0.5) * variation * 2)),
            g: Math.max(0, Math.min(255, baseColor.g + (Math.random() - 0.5) * variation * 2)),
            b: Math.max(0, Math.min(255, baseColor.b + (Math.random() - 0.5) * variation * 2))
        };
    }

    generateRound() {
        const correctColor = this.generateRandomColor();

        const distractors = [];
        for (let i = 0; i < 3; i++) {
            distractors.push(this.generateSimilarColor(correctColor, 80));
        }

        this.currentColors = [correctColor, ...distractors];
        this.correctIndex = Math.floor(Math.random() * 4);

        [this.currentColors[0], this.currentColors[this.correctIndex]] = [this.currentColors[this.correctIndex], this.currentColors[0]];
        this.correctIndex = 0;

        for (let i = this.currentColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentColors[i], this.currentColors[j]] = [this.currentColors[j], this.currentColors[i]];

            if (i === this.correctIndex) this.correctIndex = j;
            else if (j === this.correctIndex) this.correctIndex = i;
        }
    }

    updateDisplay() {
        const correctColor = this.currentColors[this.correctIndex];

        document.getElementById('targetColor').style.backgroundColor =
            this.colorToRgb(correctColor);

        const showHex = Math.random() > 0.5;
        document.getElementById('colorCode').textContent =
            showHex ? this.colorToHex(correctColor) : this.colorToRgb(correctColor);

        const options = document.querySelectorAll('.color-option');
        options.forEach((option, index) => {
            option.style.backgroundColor = this.colorToRgb(this.currentColors[index]);
            option.className = 'color-option';
            option.disabled = false;
        });

        document.getElementById('score').textContent = this.score;
        document.getElementById('round').textContent = this.round;
        document.getElementById('streak').textContent = this.streak;

        document.getElementById('feedback').textContent = '';
        document.getElementById('feedback').className = 'feedback';
        document.getElementById('nextButton').disabled = true;
    }

    selectColor(index) {
        if (this.gameEnded) return;

        const options = document.querySelectorAll('.color-option');
        const feedback = document.getElementById('feedback');

        options.forEach(option => option.disabled = true);

        if (index === this.correctIndex) {
            this.score++;
            this.streak++;
            options[index].classList.add('correct');
            feedback.textContent = '🎉 Correct!';
            feedback.className = 'feedback correct';
        } else {
            this.streak = 0;
            options[index].classList.add('incorrect');
            options[this.correctIndex].classList.add('correct');
            feedback.textContent = '❌ Wrong! The correct answer was highlighted.';
            feedback.className = 'feedback incorrect';
        }


        document.getElementById('nextButton').disabled = false;
    }

    nextRound() {
        if (this.round >= this.maxRounds) {
            this.endGame();
            return;
        }

        this.round++;
        this.generateRound();
        this.updateDisplay();
    }

    endGame() {
        this.gameEnded = true;
        document.getElementById('game-area').style.display = 'none';
        document.getElementById('gameOver').style.display = 'block';

        const finalScore = document.getElementById('finalScore');
        const performanceMessage = document.getElementById('performanceMessage');

        finalScore.textContent = `${this.score}/${this.maxRounds}`;

        let message = '';
        const percentage = (this.score / this.maxRounds) * 100;

        if (percentage === 100) {
            message = '🏆 Perfect! You\'re a true Color Master!';
        } else if (percentage >= 80) {
            message = '🌟 Excellent! You have a great eye for colors!';
        } else if (percentage >= 60) {
            message = '👍 Good job! Keep practicing to improve!';
        } else if (percentage >= 40) {
            message = '🎯 Not bad! Colors can be tricky!';
        } else {
            message = '🎨 Keep trying! Practice makes perfect!';
        }

        performanceMessage.textContent = message;
    }

    restart() {
        this.score = 0;
        this.round = 1;
        this.streak = 0;
        this.gameEnded = false;

        document.getElementById('game-area').style.display = 'block';
        document.getElementById('gameOver').style.display = 'none';

        this.generateRound();
        this.updateDisplay();
    }
}

let game;

function selectColor(index) {
    game.selectColor(index);
}

function nextRound() {
    game.nextRound();
}

function restartGame() {
    game.restart();
}

window.addEventListener('load', () => {
    game = new ColorGuessingGame();
});

document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        selectColor(index);
    } else if (e.key === 'Enter' || e.key === ' ') {
        const nextButton = document.getElementById('nextButton');
        if (!nextButton.disabled) {
            nextRound();
        }
    }
});
