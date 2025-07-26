// Check if it's Christmas
function checkChristmas() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
    const currentDay = today.getDate();

    const answerText = document.getElementById('answerText');
    const answerEmoji = document.getElementById('answerEmoji');

    if (currentMonth === 12 && currentDay === 25) {
        answerText.textContent = "YES! 🎉";
        answerEmoji.textContent = "🎅";
        document.body.style.background = "linear-gradient(135deg, #e74c3c 0%, #27ae60 50%, #f39c12 100%)";
        createFireworks();
    } else {
        answerText.textContent = "Not yet... 😢";
        answerEmoji.textContent = "⏰";
    }
}

// Countdown to Christmas
function updateCountdown() {
    const today = new Date();
    const currentYear = today.getFullYear();
    let christmas = new Date(currentYear, 11, 25); // December 25th

    // If Christmas has passed this year, count to next year's Christmas
    if (today > christmas) {
        christmas = new Date(currentYear + 1, 11, 25);
    }

    const timeDiff = christmas - today;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    document.getElementById('countdownTimer').textContent = days + " days";
}

// Create falling snow
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.innerHTML = ['❄', '❅', '❆'][Math.floor(Math.random() * 3)];
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';

    document.body.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 5000);
}

// Tree shake animation
function shakeTree() {
    const tree = document.querySelector('.christmas-tree');
    tree.style.animation = 'none';
    tree.offsetHeight; // Trigger reflow
    tree.style.animation = 'bounce 0.5s ease-in-out';

    // Create some falling leaves effect
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createMagicSparkle();
        }, i * 100);
    }
}

// Create magic sparkles
function createMagicSparkle() {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.left = Math.random() * 100 + 'vw';
    sparkle.style.top = Math.random() * 100 + 'vh';
    sparkle.style.fontSize = '2rem';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'fall 2s linear forwards';

    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 2000);
}

// Open present animation
function openPresent(present) {
    const surprises = ['🎁', '🧸', '🍪', '🎮', '📚', '🎨', '🧩', '🎵'];
    const surprise = surprises[Math.floor(Math.random() * surprises.length)];

    present.innerHTML = surprise;
    present.style.transform = 'scale(1.5) rotate(360deg)';
    present.style.background = '#ffd700';

    setTimeout(() => {
        present.innerHTML = '';
        present.style.transform = '';
        present.style.background = '';
    }, 2000);
}

// Create fireworks for Christmas day
function createFireworks() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.innerHTML = '🎆';
            firework.style.position = 'absolute';
            firework.style.left = Math.random() * 100 + 'vw';
            firework.style.top = Math.random() * 50 + 'vh';
            firework.style.fontSize = '3rem';
            firework.style.pointerEvents = 'none';
            firework.style.animation = 'spin 1s linear infinite';

            document.body.appendChild(firework);

            setTimeout(() => {
                firework.remove();
            }, 3000);
        }, i * 500);
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    checkChristmas();
    updateCountdown();

    // Update countdown every hour
    setInterval(updateCountdown, 3600000);

    // Create snowflakes periodically
    setInterval(createSnowflake, 300);

    // Add click event to the main question for fun
    document.querySelector('.question').addEventListener('click', function() {
        this.style.animation = 'none';
        this.offsetHeight; // Trigger reflow
        this.style.animation = 'bounce 1s ease-in-out';
        createMagicSparkle();
    });
});

// Add some keyboard interactions
document.addEventListener('keydown', function(e) {
    if (e.key === ' ') {
        createMagicSparkle();
    }
    if (e.key === 'Enter') {
        shakeTree();
    }
});
