// Spotify clone functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    let sidebarOpen = false;

    // Create mobile menu button if it doesn't exist
    if (!hamburgerMenu && window.innerWidth <= 768) {
        createMobileMenuButton();
    }

    function createMobileMenuButton() {
        const header = document.querySelector('.top-header');
        const navigation = document.querySelector('.header-navigation');

        if (header && navigation) {
            const menuButton = document.createElement('button');
            menuButton.className = 'nav-button mobile-menu-button';
            menuButton.innerHTML = '<i class="ri-menu-line"></i>';
            menuButton.setAttribute('aria-label', 'Toggle navigation menu');

            navigation.insertBefore(menuButton, navigation.firstChild);

            menuButton.addEventListener('click', toggleSidebar);
        }
    }

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
        if (sidebar) {
            sidebar.classList.toggle('mobile-open', sidebarOpen);
        }

        // Update button icon
        const menuButton = document.querySelector('.mobile-menu-button i');
        if (menuButton) {
            menuButton.className = sidebarOpen ? 'ri-close-line' : 'ri-menu-line';
        }
    }

    // Navigation interactions
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            // Close mobile sidebar after navigation
            if (window.innerWidth <= 768 && sidebarOpen) {
                toggleSidebar();
            }
        });

        // Keyboard support
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Library item interactions
    const libraryItems = document.querySelectorAll('.library-item');

    libraryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            console.log('Library item clicked:', this.querySelector('.library-title').textContent);
        });

        // Keyboard support
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Content filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            console.log('Filter changed to:', this.textContent);
        });
    });

    // Content card interactions
    const contentCards = document.querySelectorAll('.content-card');

    contentCards.forEach(card => {
        const playButton = card.querySelector('.play-button');

        // Card hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px)';
        });

        // Card click handler
        card.addEventListener('click', function(e) {
            // Don't trigger if play button was clicked
            if (e.target.closest('.play-button')) return;

            const title = this.querySelector('.card-title').textContent;
            console.log('Content card clicked:', title);

            // Add click animation
            this.style.transform = 'scale(0.98) translateY(-4px)';
            setTimeout(() => {
                this.style.transform = 'translateY(-4px)';
            }, 150);
        });

        // Play button handler
        if (playButton) {
            playButton.addEventListener('click', function(e) {
                e.stopPropagation();

                const title = card.querySelector('.card-title').textContent;
                console.log('Play button clicked for:', title);

                // Toggle play/pause icon
                const icon = this.querySelector('i');
                if (icon.classList.contains('ri-play-fill')) {
                    icon.classList.remove('ri-play-fill');
                    icon.classList.add('ri-pause-fill');
                    this.style.background = '#1ed760';
                } else {
                    icon.classList.remove('ri-pause-fill');
                    icon.classList.add('ri-play-fill');
                    this.style.background = '#1db954';
                }

                // Add click animation
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        }

        // Keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Media player controls
    const controlButtons = document.querySelectorAll('.control-button');
    let isPlaying = false;

    controlButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');

            // Handle play/pause button
            if (icon && (icon.classList.contains('ri-pause-circle-fill') || icon.classList.contains('ri-play-circle-fill'))) {
                isPlaying = !isPlaying;

                if (isPlaying) {
                    icon.classList.remove('ri-pause-circle-fill');
                    icon.classList.add('ri-play-circle-fill');
                    this.setAttribute('aria-label', 'Play');
                } else {
                    icon.classList.remove('ri-play-circle-fill');
                    icon.classList.add('ri-pause-circle-fill');
                    this.setAttribute('aria-label', 'Pause');
                }
            }

            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            console.log('Media control clicked:', this.getAttribute('aria-label'));
        });
    });

    // Progress bar interaction
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');

    if (progressBar && progressFill && progressHandle) {
        let isDragging = false;

        progressBar.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            updateProgress(percent);
        });

        progressBar.addEventListener('mousedown', function(e) {
            isDragging = true;
            const rect = this.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            updateProgress(percent);
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            const rect = progressBar.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            updateProgress(percent);
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        function updateProgress(percent) {
            const percentage = Math.max(0, Math.min(100, percent * 100));
            progressFill.style.width = percentage + '%';
            progressHandle.style.left = percentage + '%';
        }
    }

    // Volume bar interaction
    const volumeBar = document.querySelector('.volume-bar');
    const volumeFill = document.querySelector('.volume-fill');
    const volumeHandle = document.querySelector('.volume-handle');

    if (volumeBar && volumeFill && volumeHandle) {
        let isVolumeDragging = false;

        volumeBar.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            updateVolume(percent);
        });

        volumeBar.addEventListener('mousedown', function(e) {
            isVolumeDragging = true;
            const rect = this.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            updateVolume(percent);
        });

        document.addEventListener('mousemove', function(e) {
            if (!isVolumeDragging) return;

            const rect = volumeBar.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            updateVolume(percent);
        });

        document.addEventListener('mouseup', function() {
            isVolumeDragging = false;
        });

        function updateVolume(percent) {
            const percentage = Math.max(0, Math.min(100, percent * 100));
            volumeFill.style.width = percentage + '%';
            volumeHandle.style.left = percentage + '%';
        }
    }

    // Header button interactions
    const headerButtons = document.querySelectorAll('.premium-button, .action-button, .profile-button');

    headerButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            console.log('Header button clicked:', this.textContent || this.getAttribute('aria-label'));
        });
    });

    // Show all button interactions
    const showAllButtons = document.querySelectorAll('.show-all-button');

    showAllButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.content-section');
            const sectionTitle = section.querySelector('.section-title-main').textContent;

            console.log('Show all clicked for:', sectionTitle);

            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Space bar to play/pause
        if (e.code === 'Space' && !e.target.matches('input, textarea, [contenteditable]')) {
            e.preventDefault();
            const playButton = document.querySelector('.control-button.primary');
            if (playButton) {
                playButton.click();
            }
        }

        // Escape to close mobile sidebar
        if (e.key === 'Escape' && sidebarOpen) {
            toggleSidebar();
        }

        // Arrow keys for volume control
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if (e.target.closest('.volume-controls')) {
                e.preventDefault();
                const currentVolume = parseFloat(volumeFill.style.width) || 70;
                const newVolume = e.key === 'ArrowUp'
                    ? Math.min(100, currentVolume + 5)
                    : Math.max(0, currentVolume - 5);
                updateVolume(newVolume / 100);
            }
        }
    });

    // Close mobile sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (sidebarOpen && !e.target.closest('.sidebar') && !e.target.closest('.mobile-menu-button')) {
            toggleSidebar();
        }
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile sidebar on desktop resize
            if (window.innerWidth > 768 && sidebarOpen) {
                toggleSidebar();
            }

            // Create or remove mobile menu button based on screen size
            const existingButton = document.querySelector('.mobile-menu-button');
            if (window.innerWidth <= 768 && !existingButton) {
                createMobileMenuButton();
            } else if (window.innerWidth > 768 && existingButton) {
                existingButton.remove();
            }
        }, 250);
    });

    // Simulate progress update (for demo purposes)
    let currentTime = 0;
    const totalTime = 180; // 3 minutes

    function simulateProgress() {
        if (isPlaying && currentTime < totalTime) {
            currentTime += 1;
            const percent = currentTime / totalTime;

            if (progressFill && progressHandle) {
                progressFill.style.width = (percent * 100) + '%';
                progressHandle.style.left = (percent * 100) + '%';
            }

            // Update time display
            const timeDisplays = document.querySelectorAll('.time-display');
            if (timeDisplays.length >= 2) {
                timeDisplays[0].textContent = formatTime(currentTime);
                timeDisplays[1].textContent = '-' + formatTime(totalTime - currentTime);
            }
        }
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Update progress every second
    setInterval(simulateProgress, 1000);

    // Initialize time display
    const timeDisplays = document.querySelectorAll('.time-display');
    if (timeDisplays.length >= 2) {
        timeDisplays[0].textContent = '0:00';
        timeDisplays[1].textContent = '-3:00';
    }

    console.log('Spotify clone initialized successfully!');
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    .content-card {
        animation: fadeIn 0.5s ease-out;
    }

    .sidebar.mobile-open {
        animation: slideIn 0.3s ease-out;
    }

    .play-button:active {
        animation: pulse 0.2s ease-in-out;
    }

    .mobile-menu-button {
        display: none;
    }

    @media (max-width: 768px) {
        .mobile-menu-button {
            display: flex;
        }
    }
`;
document.head.appendChild(style);
