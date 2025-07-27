// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const rightSection = document.querySelector('.right-section');

    // Toggle mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
            rightSection.classList.toggle('mobile-open');

            // Animate hamburger menu
            this.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.sidebar') &&
            !event.target.closest('.mobile-menu-toggle') &&
            !event.target.closest('.right-section')) {
            sidebar.classList.remove('mobile-open');
            rightSection.classList.remove('mobile-open');
            mobileMenuToggle.classList.remove('active');
        }
    });

    // Handle job card interactions
    const jobContainers = document.querySelectorAll('.job-container');
    jobContainers.forEach(container => {
        // Add click handler for job titles
        const title = container.querySelector('.title');
        if (title) {
            title.addEventListener('click', function() {
                // Add subtle animation feedback
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            });
        }

        // Handle remove job functionality
        const removeBtn = container.querySelector('.exit');
        if (removeBtn) {
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();

                // Add fade out animation
                container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                container.style.opacity = '0';
                container.style.transform = 'translateX(-20px)';

                // Remove element after animation
                setTimeout(() => {
                    container.remove();
                }, 300);
            });
        }
    });

    // Handle suggested search tags
    const suggestedTags = document.querySelectorAll('.suggested');
    suggestedTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            // Here you would typically trigger a search
            console.log('Searching for:', this.textContent.replace('🔍', '').trim());
        });
    });

    // Handle search input
    const searchInput = document.querySelector('.input-search');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        searchInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });

        // Handle search submission
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('Searching for:', this.value);
                // Add search functionality here
            }
        });
    }

    // Add smooth scrolling for better UX
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
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

    // Handle notification count animation
    const notifCount = document.querySelector('.notif-count');
    if (notifCount) {
        // Add pulse animation for new notifications
        setInterval(() => {
            notifCount.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                notifCount.style.animation = '';
            }, 500);
        }, 10000); // Pulse every 10 seconds
    }
});

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }

    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);
