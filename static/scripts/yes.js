// Create animated stars
function createStars() {
    const starsContainer = document.querySelector('.stars');
    const numberOfStars = 100;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

// Initialize stars
createStars();

// No button evasion logic
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
let isEvading = false;

function moveNoButton(mouseX, mouseY) {
    if (isEvading) return;

    const btnRect = noBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const distance = Math.sqrt(
        Math.pow(mouseX - btnCenterX, 2) + Math.pow(mouseY - btnCenterY, 2)
    );

    const threshold = 150;

    if (distance < threshold) {
        isEvading = true;

        // Calculate escape direction
        const angle = Math.atan2(btnCenterY - mouseY, btnCenterX - mouseX);
        const escapeDistance = 200;

        let newX = btnCenterX + Math.cos(angle) * escapeDistance;
        let newY = btnCenterY + Math.sin(angle) * escapeDistance;

        // Keep button within viewport bounds
        const margin = 100;
        newX = Math.max(margin, Math.min(window.innerWidth - margin, newX));
        newY = Math.max(margin, Math.min(window.innerHeight - margin, newY));

        // Apply position
        noBtn.style.left = (newX - btnRect.width / 2) + 'px';
        noBtn.style.top = (newY - btnRect.height / 2) + 'px';

        // Add some random movement for unpredictability
        setTimeout(() => {
            const randomX = newX + (Math.random() - 0.5) * 100;
            const randomY = newY + (Math.random() - 0.5) * 100;

            noBtn.style.left = Math.max(margin, Math.min(window.innerWidth - margin, randomX - btnRect.width / 2)) + 'px';
            noBtn.style.top = Math.max(margin, Math.min(window.innerHeight - margin, randomY - btnRect.height / 2)) + 'px';
        }, 100);

        setTimeout(() => {
            isEvading = false;
        }, 500);
    }
}

// Mouse tracking for no button evasion
document.addEventListener('mousemove', (e) => {
    moveNoButton(e.clientX, e.clientY);
});

// Touch support for mobile
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        moveNoButton(e.touches[0].clientX, e.touches[0].clientY);
    }
});

// Confetti creation
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 20);
    }
}

// Success message
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = 'Awesome! Let\'s connect! 🎉';
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Yes button click handler
yesBtn.addEventListener('click', () => {
    createConfetti();
    showSuccessMessage();

    // Redirect after animation
    setTimeout(() => {
        // Replace with your actual contact link
        window.open('mailto:your.email@example.com?subject=Let\'s%20Talk%20About%20Opportunities!', '_blank');
        // Or redirect to your portfolio/contact page:
        // window.location.href = 'https://your-portfolio.com/contact';
    }, 2000);
});

// No button click handler (just for fun)
noBtn.addEventListener('click', () => {
    alert('The button ran away! Maybe reconsider? 😉');
});

// Prevent context menu on buttons
noBtn.addEventListener('contextmenu', (e) => e.preventDefault());
yesBtn.addEventListener('contextmenu', (e) => e.preventDefault());
