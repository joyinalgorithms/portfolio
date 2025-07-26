function createStars() {
    const starsContainer = document.querySelector('.stars');
    const numberOfStars = 50;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }
}

function createFirework(x, y) {
    const colors = ['#ff6b6b', '#ffd93d', '#4ecdc4', '#ff9ff3', '#95e1d3'];
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = x + 'px';
    firework.style.top = y + 'px';

    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        const angle = (i * 30) * Math.PI / 180;
        const distance = 50 + Math.random() * 50;
        particle.style.left = Math.cos(angle) * distance + 'px';
        particle.style.top = Math.sin(angle) * distance + 'px';

        firework.appendChild(particle);
    }

    document.body.appendChild(firework);

    setTimeout(() => {
        firework.remove();
    }, 1000);
}

function createConfetti() {
    const colors = ['#ff6b6b', '#ffd93d', '#4ecdc4', '#ff9ff3', '#95e1d3'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

function checkNewYear() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const newYear = new Date(currentYear + 1, 0, 1);
    const lastNewYear = new Date(currentYear, 0, 1);

    const resultDiv = document.getElementById('result');
    const countdownDiv = document.getElementById('countdown');

    const isNewYearDay = now.getMonth() === 0 && now.getDate() === 1;

    if (isNewYearDay) {
        resultDiv.innerHTML = "🎉 YES! It's New Year's Day! 🎉";
        resultDiv.className = 'result show yes-result';

        createConfetti();
        setTimeout(() => createFirework(Math.random() * window.innerWidth, Math.random() * window.innerHeight), 200);
        setTimeout(() => createFirework(Math.random() * window.innerWidth, Math.random() * window.innerHeight), 400);
        setTimeout(() => createFirework(Math.random() * window.innerWidth, Math.random() * window.innerHeight), 600);

        countdownDiv.classList.remove('show');
    } else {
        resultDiv.innerHTML = "✨ Not yet, but soon! ✨";
        resultDiv.className = 'result show no-result';

        updateCountdown();
        countdownDiv.classList.add('show');

        setInterval(updateCountdown, 1000);
    }
}

function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const newYear = new Date(currentYear + 1, 0, 1);
    const timeDiff = newYear - now;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

createStars();

document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') {
        createFirework(e.clientX, e.clientY);
    }
});
