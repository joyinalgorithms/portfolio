function createBinaryDigit() {
    const digit = document.createElement('div');
    digit.className = 'binary-digit';
    digit.textContent = Math.random() > 0.5 ? '1' : '0';
    digit.style.left = Math.random() * 100 + '%';
    digit.style.animationDelay = Math.random() * 5 + 's';

    return digit;
}

function initBinaryBackground() {
    const binaryBg = document.getElementById('binaryBg');

    for (let i = 0; i < 45; i++) {
        binaryBg.appendChild(createBinaryDigit());
    }

    setInterval(() => {
        if (binaryBg.children.length < 60) {
            binaryBg.appendChild(createBinaryDigit());
        }

        const oldDigits = Array.from(binaryBg.children).filter(child => {
            const rect = child.getBoundingClientRect();
            return rect.top < -100;
        });

        oldDigits.forEach(digit => digit.remove());
    }, 1500);
}

document.addEventListener('DOMContentLoaded', function() {
    initBinaryBackground();

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('binary-digit')) {
            e.target.style.animation = 'none';
            e.target.style.transform = 'scale(3) rotate(720deg)';
            e.target.style.color = 'rgba(74, 158, 255, 1)';

            setTimeout(() => {
                e.target.remove();
            }, 300);
        }
    });
});
let mouseX = 0;
let mouseY = 0;
let trailCount = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (trailCount % 3 === 0) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = (mouseX - 3) + 'px';
        trail.style.top = (mouseY - 3) + 'px';
        document.body.appendChild(trail);

        setTimeout(() => trail.remove(), 800);
    }

    trailCount++;
});

document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = (e.clientX - 5) + 'px';
    ripple.style.top = (e.clientY - 5) + 'px';
    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
});

function downloadResume() {
    alert('Resume download started!');
}

function viewResume() {
    alert('Opening resume in PDF viewer!');
}

function enlargeImage(element) {
    element.style.transform = 'scale(1.1)';
    element.style.zIndex = '1000';

    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.zIndex = 'auto';
    }, 2000);
}

function toggleImageEffect(element) {
    element.style.transform = 'scale(1.1) rotate(5deg)';
    element.style.filter = 'hue-rotate(90deg)';

    setTimeout(() => {
        element.style.transform = 'scale(1) rotate(0deg)';
        element.style.filter = 'hue-rotate(0deg)';
    }, 1000);
}

function animateSkill(element) {
    element.style.transform = 'scale(1.2) rotate(360deg)';
    element.style.background = 'rgba(74, 158, 255, 0.3)';

    setTimeout(() => {
        element.style.transform = 'scale(1) rotate(0deg)';
        element.style.background = 'rgba(255, 255, 255, 0.05)';
    }, 800);
}

function animateTech(element) {
    element.style.transform = 'translateY(-20px) scale(1.1) rotate(5deg)';
    element.style.background = 'rgba(74, 158, 255, 0.2)';

    setTimeout(() => {
        element.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        element.style.background = 'rgba(255, 255, 255, 0.05)';
    }, 800);
}

document.addEventListener('DOMContentLoaded', function() {
    initBinaryBackground();

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('binary-digit')) {
            e.target.style.animation = 'none';
            e.target.style.transform = 'scale(3) rotate(720deg)';
            e.target.style.color = 'rgba(74, 158, 255, 1)';

            setTimeout(() => {
                e.target.remove();
            }, 300);
        }
    });
});
// Add smooth scrolling to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add IDs to category sections for anchor linking
document.addEventListener('DOMContentLoaded', function() {
    const categories = document.querySelectorAll('.category');
    const categoryIds = [
        'frontend',
        'web-applications',
        'ml',
        'games',
        'cs50x',
        'cs50w',
        'applications'
    ];

    categories.forEach((category, index) => {
        if (categoryIds[index]) {
            category.id = categoryIds[index];
        }
    });
});
// Scroll to Top Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (!scrollToTopBtn) return; // Exit if button doesn't exist

    let isScrolling = false;
    let scrollTimeout;

    // Show/hide button based on scroll position
    function toggleScrollButton() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldShow = scrollTop > 300; // Show after scrolling 300px

        if (shouldShow) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }

    // Smooth scroll to top function
    function scrollToTop() {
        if (isScrolling) return; // Prevent multiple clicks

        isScrolling = true;
        scrollToTopBtn.style.pointerEvents = 'none'; // Disable button during scroll

        // Add a little bounce effect
        scrollToTopBtn.style.transform = 'translateY(0) scale(0.9)';

        setTimeout(() => {
            scrollToTopBtn.style.transform = '';
        }, 150);

        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Re-enable button after scroll completes
        setTimeout(() => {
            isScrolling = false;
            scrollToTopBtn.style.pointerEvents = 'auto';
        }, 1000);
    }

    // Throttled scroll event listener for better performance
    function throttledScrollHandler() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(toggleScrollButton, 10);
    }

    // Event listeners
    window.addEventListener('scroll', throttledScrollHandler, {
        passive: true
    });
    scrollToTopBtn.addEventListener('click', scrollToTop);

    // Initial check
    toggleScrollButton();

    // Optional: Add keyboard support
    scrollToTopBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
        }
    });

    // Optional: Hide button when reaching top
    window.addEventListener('scroll', function() {
        if (window.pageYOffset === 0) {
            scrollToTopBtn.classList.remove('show');
        }
    }, {
        passive: true
    });
});

// Optional: Add progress indicator
function addScrollProgress() {
    const progressRing = document.createElement('div');
    progressRing.className = 'scroll-progress-ring';
    progressRing.innerHTML = `
        <svg class="progress-ring" width="54" height="54">
            <circle class="progress-ring-circle" stroke="#667eea" stroke-width="2" fill="transparent" r="25" cx="27" cy="27"/>
        </svg>
    `;

    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        scrollBtn.appendChild(progressRing);

        const circle = progressRing.querySelector('.progress-ring-circle');
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;

        function updateProgress() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;
            const offset = circumference - (scrollPercent * circumference);
            circle.style.strokeDashoffset = offset;
        }

        window.addEventListener('scroll', updateProgress, {
            passive: true
        });
    }
}

// Uncomment the line below to add scroll progress indicator
addScrollProgress();
