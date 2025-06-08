let score = JSON.parse(localStorage.getItem('score'));

if (!score) {
    score = {
        wins: 0,
        losses: 0,
        ties: 0
    }
}

function updateScore() {
    document.querySelector('.js-score').innerHTML = `Wins: ${score.wins} Losses: ${score.losses} Ties: ${score.ties}`;

}
updateScore();

function pickComputerMove() {
    const random = Math.random();
    let computerMove = '';
    if (random >= 0 && random < 1 / 3) {
        computerMove = 'Rock';
    } else if (random >= 1 / 3 && random < 2 / 3) {
        computerMove = 'Paper';
    } else if (random >= 2 / 3 && random < 3 / 3) {
        computerMove = 'Scissors';
    }

    return computerMove;
}

let isAutoPlay = false;
let id;

document.querySelector('.js-rock-btn').addEventListener('click', () => {
    result('Rock');
})
document.querySelector('.js-paper-btn').addEventListener('click', () => {
    result('Paper');
})
document.querySelector('.js-scissors-btn').addEventListener('click', () => {
    result('Scissors');
})

function autoplay() {
    if (!isAutoPlay) {
        id = setInterval(() => {
            const move = pickComputerMove();
            result(move);
        }, 1000);
        isAutoPlay = true;
    } else {
        clearInterval(id);
        isAutoPlay = false;
    }

}


document.body.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
        result('Rock');
    } else if (event.key === 'p') {
        result('Paper');
    } else if (event.key === 's') {
        result('Scissors');
    }
})

function result(move) {
    const computerMove = pickComputerMove();
    let result = '';
    if (move === 'Rock') {
        if (computerMove === 'Rock') {
            result = 'Tie';
        } else if (computerMove === 'Scissors') {
            result = 'You win';
        } else if (computerMove === 'Paper') {
            result = 'You lose';
        }
    } else if (move === 'Paper') {
        if (computerMove === 'Rock') {
            result = 'You win';
        } else if (computerMove === 'Scissors') {
            result = 'You lose';
        } else if (computerMove === 'Paper') {
            result = 'Tie';
        }
    } else {
        if (computerMove === 'Rock') {
            result = 'You lose';
        } else if (computerMove === 'Scissors') {
            result = 'Tie';
        } else if (computerMove === 'Paper') {
            result = 'You win';
        }
    }

    if (result === 'You win') {
        score.wins++;
    } else if (result === 'You lose') {
        score.losses++;
    } else if (result === 'Tie') {
        score.ties++;
    }

    document.querySelector('.js-result').innerHTML = result
    localStorage.setItem('score', JSON.stringify(score));

    updateScore();

    document.querySelector('.js-moves').innerHTML = `You
<img class = "move-icon" src="/static/images/minigames/${move}-emoji.jpg" alt="">
<img class = "move-icon" src="/static/images/minigames/${computerMove}-emoji.jpg" alt="">
Computer`
}
