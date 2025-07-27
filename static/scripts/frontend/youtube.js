// YouTube clone functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');

    if (hamburgerMenu && sidebar) {
        hamburgerMenu.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');

            // Add animation to hamburger menu
            this.style.transform = sidebar.classList.contains('mobile-open')
                ? 'rotate(90deg)' : 'rotate(0deg)';
        });
    }

    // Search functionality
    const searchBar = document.querySelector('.search-bar');
    const searchButton = document.querySelector('.search-button');

    function performSearch() {
        const query = searchBar.value.trim();
        if (query) {
            console.log('Searching for:', query);
            // Add search animation
            searchButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                searchButton.style.transform = 'scale(1)';
            }, 150);

            // Here you would typically redirect to search results
            // window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
    }

    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    if (searchBar) {
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Search suggestions (placeholder)
        searchBar.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                // Here you would show search suggestions
                console.log('Show suggestions for:', query);
            }
        });
    }

    // Video preview interactions
    const videoPreviewsElements = document.querySelectorAll('.video-preview');

    videoPreviewsElements.forEach(preview => {
        const thumbnail = preview.querySelector('.thumbnail');
        const videoLink = preview.querySelector('.video-link');

        // Add hover effects
        preview.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            if (thumbnail) {
                thumbnail.style.borderRadius = '8px';
            }
        });

        preview.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            if (thumbnail) {
                thumbnail.style.borderRadius = '12px';
            }
        });

        // Handle video clicks
        if (videoLink) {
            videoLink.addEventListener('click', function(e) {
                // Add click animation
                preview.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    preview.style.transform = 'scale(1)';
                }, 100);
            });
        }
    });

    // Channel tooltip interactions
    const profileContainers = document.querySelectorAll('.profile-picture-container');

    profileContainers.forEach(container => {
        const tooltip = container.querySelector('.channel-tooltip');
        let tooltipTimeout;

        container.addEventListener('mouseenter', function() {
            if (tooltip) {
                clearTimeout(tooltipTimeout);
                tooltipTimeout = setTimeout(() => {
                    tooltip.style.opacity = '1';
                    tooltip.style.visibility = 'visible';
                }, 500); // Delay tooltip appearance
            }
        });

        container.addEventListener('mouseleave', function() {
            if (tooltip) {
                clearTimeout(tooltipTimeout);
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            }
        });
    });

    // Sidebar link interactions
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Voice search functionality
    const voiceSearchButton = document.querySelector('.voice-search-button');

    if (voiceSearchButton) {
        voiceSearchButton.addEventListener('click', function() {
            // Add pulse animation
            this.style.animation = 'pulse 0.6s ease-in-out';

            // Check if browser supports speech recognition
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();

                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onstart = function() {
                    console.log('Voice recognition started');
                    voiceSearchButton.style.backgroundColor = '#ff4444';
                };

                recognition.onresult = function(event) {
                    const transcript = event.results[0][0].transcript;
                    searchBar.value = transcript;
                    performSearch();
                };

                recognition.onend = function() {
                    voiceSearchButton.style.backgroundColor = '';
                    voiceSearchButton.style.animation = '';
                };

                recognition.onerror = function(event) {
                    console.error('Speech recognition error:', event.error);
                    voiceSearchButton.style.backgroundColor = '';
                    voiceSearchButton.style.animation = '';
                };

                recognition.start();
            } else {
                alert('Speech recognition not supported in this browser');
                this.style.animation = '';
            }
        });
    }

    // Notification interactions
    const notificationContainer = document.querySelector('.notifications-icon-container');

    if (notificationContainer) {
        notificationContainer.addEventListener('click', function() {
            const count = this.querySelector('.notifications-count');
            if (count) {
                // Animate notification count
                count.style.animation = 'bounce 0.5s ease-in-out';
                setTimeout(() => {
                    count.style.animation = '';
                }, 500);

                // Simulate clearing notifications
                setTimeout(() => {
                    count.textContent = '0';
                    count.style.display = 'none';
                }, 1000);
            }
        });
    }

    // Profile menu functionality
    const profileButton = document.querySelector('.profile-button');

    if (profileButton) {
        profileButton.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            // Here you would show profile menu
            console.log('Profile menu clicked');
        });
    }

    // Lazy loading for thumbnails (performance optimization)
    const thumbnails = document.querySelectorAll('.thumbnail');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const originalSrc = img.src;

                    // Add loading effect
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';

                    // Simulate loading effect
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);

                    observer.unobserve(img);
                }
            });
        });

        thumbnails.forEach(img => imageObserver.observe(img));
    }

    // Video duration hover effects
    const videoTimes = document.querySelectorAll('.video-time');

    videoTimes.forEach(timeElement => {
        const parentPreview = timeElement.closest('.video-preview');

        if (parentPreview) {
            parentPreview.addEventListener('mouseenter', function() {
                timeElement.style.transform = 'scale(1.05)';
                timeElement.style.backgroundColor = 'rgba(0,0,0,0.9)';
            });

            parentPreview.addEventListener('mouseleave', function() {
                timeElement.style.transform = 'scale(1)';
                timeElement.style.backgroundColor = 'rgba(0,0,0,0.8)';
            });
        }
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Press '/' to focus search bar
        if (e.key === '/' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            if (searchBar) {
                searchBar.focus();
                searchBar.select();
            }
        }

        // Press 'Escape' to close mobile sidebar or clear search
        if (e.key === 'Escape') {
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                if (hamburgerMenu) {
                    hamburgerMenu.style.transform = 'rotate(0deg)';
                }
            } else if (document.activeElement === searchBar) {
                searchBar.blur();
                searchBar.value = '';
            }
        }

        // Press 'Enter' on video previews to navigate
        if (e.key === 'Enter' && e.target.closest('.video-preview')) {
            const videoLink = e.target.closest('.video-preview').querySelector('.video-link');
            if (videoLink) {
                videoLink.click();
            }
        }
    });

    // Handle window resize for responsive behavior
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile sidebar on desktop resize
            if (window.innerWidth > 768 && sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                if (hamburgerMenu) {
                    hamburgerMenu.style.transform = 'rotate(0deg)';
                }
            }

            // Recalculate tooltip positions if needed
            const tooltips = document.querySelectorAll('.channel-tooltip');
            tooltips.forEach(tooltip => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
        }, 250);
    });

    // Close mobile sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (sidebar && sidebar.classList.contains('mobile-open')) {
            if (!event.target.closest('.sidebar') && !event.target.closest('.hamburger-menu')) {
                sidebar.classList.remove('mobile-open');
                if (hamburgerMenu) {
                    hamburgerMenu.style.transform = 'rotate(0deg)';
                }
            }
        }
    });

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

    // Video grid infinite scroll simulation
    let isLoading = false;

    function loadMoreVideos() {
        if (isLoading) return;

        isLoading = true;
        console.log('Loading more videos...');

        // Simulate loading delay
        setTimeout(() => {
            // Here you would typically fetch more videos from your API
            console.log('More videos loaded');
            isLoading = false;
        }, 1000);
    }

    // Check if user scrolled near bottom
    window.addEventListener('scroll', function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
            loadMoreVideos();
        }
    });

    // Initialize tooltips with proper positioning
    function initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');

        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = tooltipText;
                document.body.appendChild(tooltip);

                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.bottom + 8 + 'px';

                setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 10);
            });

            element.addEventListener('mouseleave', function() {
                const tooltip = document.querySelector('.custom-tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    // Initialize custom tooltips
    initializeTooltips();

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
});

// Add CSS animations and styles
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }

    @keyframes bounce {
        0%, 20%, 60%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        80% { transform: translateY(-5px); }
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .sidebar-link.active {
        background-color: #f0f0f0;
        border-right: 3px solid #cc0000;
    }

    .sidebar-link.active div {
        color: #cc0000;
        font-weight: 500;
    }

    .custom-tooltip {
        position: absolute;
        background-color: rgba(0,0,0,0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
        z-index: 1001;
    }

    .video-preview {
        animation: fadeIn 0.3s ease-out;
    }

    .search-bar:focus {
        box-shadow: 0 0 0 2px #1976d2;
    }

    .hamburger-menu {
        transition: transform 0.3s ease;
    }

    @media (prefers-reduced-motion: reduce) {
        .hamburger-menu,
        .video-preview,
        .thumbnail,
        .video-time {
            transition: none !important;
            animation: none !important;
        }
    }
`;
document.head.appendChild(style);
