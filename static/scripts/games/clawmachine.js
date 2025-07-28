class ClawMachine {
    constructor() {
        this.clawContainer = document.getElementById('clawContainer');
        this.clawArm = document.getElementById('clawArm');
        this.claw = document.getElementById('claw');
        this.itemsContainer = document.getElementById('itemsContainer');
        this.status = document.getElementById('status');
        this.scoreElement = document.getElementById('score');
        this.coinsElement = document.getElementById('coins');
        this.prizesList = document.getElementById('prizesList');
        this.prizesCount = document.getElementById('prizesCount');
        this.volumeControl = document.getElementById('volumeControl');

        this.clawPosition = 50;
        this.isGrabbing = false;
        this.score = 0;
        this.coins = 10;
        this.items = [];
        this.prizes = [];
        this.soundEnabled = true;
        this.isMobile = this.detectMobile();

        this.initializeSounds();
        this.initializeItems();
        this.bindEvents();
        this.showStatus('Ready to play!');
        this.updateDisplay();

        if (this.isMobile) {
            this.setupTouchControls();
        }
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0);
    }

    initializeSounds() {
        this.sounds = {
            move: this.createBeepSound(200, 0.1),
            grab: this.createBeepSound(150, 0.2),
            success: this.createSuccessSound(),
            fail: this.createFailSound()
        };
    }

    createBeepSound(frequency, duration) {
        return () => {
            if (!this.soundEnabled) return;
            const audioContext = new(window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'square';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    createSuccessSound() {
        return () => {
            if (!this.soundEnabled) return;
            const audioContext = new(window.AudioContext || window.webkitAudioContext)();
            const frequencies = [523, 659, 784, 1047];

            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                const startTime = audioContext.currentTime + index * 0.1;
                gainNode.gain.setValueAtTime(0.2, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

                oscillator.start(startTime);
                oscillator.stop(startTime + 0.2);
            });
        };
    }

    createFailSound() {
        return () => {
            if (!this.soundEnabled) return;
            const audioContext = new(window.AudioContext || window.webkitAudioContext)();
            const frequencies = [200, 150, 100];

            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sawtooth';

                const startTime = audioContext.currentTime + index * 0.15;
                gainNode.gain.setValueAtTime(0.2, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

                oscillator.start(startTime);
                oscillator.stop(startTime + 0.3);
            });
        };
    }

    initializeItems() {
        const itemTypes = [{
                emoji: '💻',
                class: 'laptop',
                points: 100
            },
            {
                emoji: '📱',
                class: 'phone',
                points: 80
            },
            {
                emoji: '⌨️',
                class: 'keyboard',
                points: 60
            },
            {
                emoji: '🖱️',
                class: 'mouse',
                points: 40
            },
            {
                emoji: '🎧',
                class: 'headphones',
                points: 70
            },
            {
                emoji: '📱',
                class: 'tablet',
                points: 90
            },
            {
                emoji: '⌚',
                class: 'smartwatch',
                points: 85
            },
            {
                emoji: '📶',
                class: 'router',
                points: 65
            },
            {
                emoji: '🔊',
                class: 'speaker',
                points: 75
            },
            {
                emoji: '🎮',
                class: 'gamepad',
                points: 95
            }
        ];

        const containerWidth = this.itemsContainer.offsetWidth - 20;
        const containerHeight = this.itemsContainer.offsetHeight - 20;
        const itemSize = this.isMobile ? 45 : 50;
        const gridCols = Math.floor(containerWidth / (itemSize + 5));
        const gridRows = Math.floor(containerHeight / (itemSize + 5));
        const columnHeights = Array(gridCols).fill(0);

        const itemCount = Math.min(15, gridCols * 3);

        for (let i = 0; i < itemCount; i++) {
            const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            const item = document.createElement('div');
            item.className = `item ${itemType.class}`;
            item.textContent = itemType.emoji;
            item.dataset.points = itemType.points;
            item.setAttribute('role', 'listitem');
            item.setAttribute('aria-label', `${itemType.class} worth ${itemType.points} points`);

            const col = Math.floor(Math.random() * gridCols);
            const x = col * (itemSize + 5) + 10 + (Math.random() * 5 - 2.5);
            const y = columnHeights[col];

            item.style.left = x + 'px';
            item.style.bottom = y + 'px';

            columnHeights[col] += itemSize + 2;

            this.itemsContainer.appendChild(item);
            this.items.push(item);
        }
    }

    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;

        this.itemsContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, {
            passive: true
        });

        this.itemsContainer.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
                if (deltaX > 0) {
                    this.moveClaw(1);
                } else {
                    this.moveClaw(-1);
                }
            } else if (Math.abs(deltaY) > 30 && deltaY < 0) {
                this.grab();
            }
        }, {
            passive: true
        });

        let longPressTimer;
        this.itemsContainer.addEventListener('touchstart', (e) => {
            longPressTimer = setTimeout(() => {
                this.grab();
            }, 500);
        }, {
            passive: true
        });

        this.itemsContainer.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        }, {
            passive: true
        });

        this.itemsContainer.addEventListener('touchmove', () => {
            clearTimeout(longPressTimer);
        }, {
            passive: true
        });
    }

    bindEvents() {
        document.getElementById('moveLeft').addEventListener('click', () => this.moveClaw(-1));
        document.getElementById('moveRight').addEventListener('click', () => this.moveClaw(1));
        document.getElementById('grabBtn').addEventListener('click', () => this.grab());
        this.volumeControl.addEventListener('click', () => this.toggleSound());

        document.addEventListener('keydown', (e) => {
            if (this.isGrabbing) return;

            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.moveClaw(-1);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.moveClaw(1);
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.grab();
                    break;
            }
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isGrabbing) {
                this.resetClaw();
            }
        });
    }

    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.isMobile = this.detectMobile();
            if (!this.isGrabbing) {
                this.clawPosition = 50;
                this.clawContainer.style.left = '50%';
            }
        }, 250);
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.volumeControl.querySelector('.volume-icon').textContent = this.soundEnabled ? '🔊' : '🔇';
        this.volumeControl.setAttribute('aria-label', this.soundEnabled ? 'Mute sound' : 'Unmute sound');
    }

    moveClaw(direction) {
        if (this.isGrabbing) return;

        const moveAmount = this.isMobile ? 4 : 5;
        this.clawPosition += direction * moveAmount;
        this.clawPosition = Math.max(10, Math.min(90, this.clawPosition));
        this.clawContainer.style.left = this.clawPosition + '%';

        this.sounds.move();

        const button = direction > 0 ? document.getElementById('moveRight') : document.getElementById('moveLeft');
        button.style.transform = 'translateY(-2px) scale(0.98)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    async grab() {
        if (this.isGrabbing || this.coins <= 0) return;

        this.coins--;
        this.updateDisplay();
        this.isGrabbing = true;

        const grabButton = document.getElementById('grabBtn');
        grabButton.style.transform = 'translateY(-2px) scale(0.98)';
        grabButton.disabled = true;

        this.showStatus('Grabbing...');
        this.sounds.grab();

        this.clawArm.style.height = this.isMobile ? '250px' : '280px';
        this.claw.classList.add('grabbing');

        await this.delay(1500);

        const grabbedItem = this.checkCollision();

        if (grabbedItem) {
            this.showStatus('Got something!');
            grabbedItem.classList.add('grabbed');
            this.claw.classList.remove('grabbing');
            this.claw.classList.add('holding');

            await this.delay(500);

            const clawRect = this.claw.getBoundingClientRect();
            grabbedItem.style.position = 'fixed';
            grabbedItem.style.left = (clawRect.left + clawRect.width / 2 - 25) + 'px';
            grabbedItem.style.top = (clawRect.bottom - 10) + 'px';
            grabbedItem.style.zIndex = '101';

            await this.delay(500);

            this.clawArm.style.height = '60px';
            await this.delay(1000);

            this.clawContainer.style.left = '50%';
            this.clawPosition = 50;
            await this.delay(1000);

            const success = Math.random() < (this.isMobile ? 0.75 : 0.7);

            if (success) {
                const points = parseInt(grabbedItem.dataset.points);
                this.score += points;
                this.showStatus(`Success! +${points} points!`);
                this.sounds.success();
                this.addPrize(grabbedItem.textContent, grabbedItem.className);
                this.createConfetti();
                grabbedItem.classList.add('celebrate');

                await this.delay(1500);
                grabbedItem.remove();
                this.items = this.items.filter(item => item !== grabbedItem);
            } else {
                this.showStatus('Oh no! The item slipped!');
                this.sounds.fail();
                this.repositionItem(grabbedItem);
                await this.delay(1000);
            }
        } else {
            this.showStatus('Missed! Try again.');
            await this.delay(1000);
            this.clawArm.style.height = '60px';
        }

        this.resetClaw();
        this.checkGameEnd();
    }

    repositionItem(item) {
        item.style.position = 'absolute';
        const containerWidth = this.itemsContainer.offsetWidth - 20;
        const itemSize = this.isMobile ? 45 : 50;
        const maxCols = Math.floor(containerWidth / (itemSize + 5));
        const col = Math.floor(Math.random() * maxCols);
        const x = col * (itemSize + 5) + 10 + (Math.random() * 5 - 2.5);
        const y = Math.random() * 30;

        item.style.left = x + 'px';
        item.style.bottom = y + 'px';
        item.style.zIndex = '1';
        item.classList.remove('grabbed');
        item.classList.add('falling');

        setTimeout(() => {
            item.classList.remove('falling');
        }, 1000);
    }

    resetClaw() {
        this.claw.classList.remove('grabbing', 'holding');
        this.isGrabbing = false;
        document.getElementById('grabBtn').disabled = false;
        document.getElementById('grabBtn').style.transform = '';
        this.updateDisplay();
    }

    checkCollision() {
        const clawRect = this.claw.getBoundingClientRect();
        const clawCenterX = clawRect.left + clawRect.width / 2;
        const clawBottom = clawRect.bottom;

        const sortedItems = [...this.items].sort((a, b) => {
            const aRect = a.getBoundingClientRect();
            const bRect = b.getBoundingClientRect();
            return bRect.bottom - aRect.bottom;
        });

        for (let item of sortedItems) {
            const itemRect = item.getBoundingClientRect();
            const itemCenterX = itemRect.left + itemRect.width / 2;
            const itemCenterY = itemRect.top + itemRect.height / 2;

            const horizontalDistance = Math.abs(clawCenterX - itemCenterX);
            const verticalDistance = Math.abs(clawBottom - itemCenterY);

            const hitboxH = this.isMobile ? 25 : 30;
            const hitboxV = this.isMobile ? 35 : 40;

            if (horizontalDistance < hitboxH && verticalDistance < hitboxV) {
                return item;
            }
        }

        return null;
    }

    addPrize(emoji, className) {
        const classes = className.split(' ');
        const itemClass = classes.find(cls => cls !== 'item' && cls !== 'grabbed' && cls !== 'celebrate');

        const prizeItem = document.createElement('div');
        prizeItem.className = `prize-item ${itemClass}`;
        prizeItem.textContent = emoji;
        prizeItem.setAttribute('role', 'listitem');
        prizeItem.setAttribute('aria-label', `Prize: ${itemClass}`);

        this.prizesList.appendChild(prizeItem);
        this.prizes.push(prizeItem);
        this.updatePrizesCount();
    }

    updatePrizesCount() {
        if (this.prizesCount) {
            this.prizesCount.textContent = this.prizes.length;
        }
    }

    createConfetti() {
        const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#277da1'];
        const confettiCount = this.isMobile ? 50 : 100;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = -10 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 8 + 4 + 'px';
            confetti.style.height = Math.random() * 8 + 4 + 'px';
            confetti.style.opacity = '1';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

            document.body.appendChild(confetti);

            const animationDuration = Math.random() * 2 + 1.5;
            const animationDelay = Math.random() * 0.5;

            confetti.style.animation = `confettiFall ${animationDuration}s ease-in ${animationDelay}s forwards`;

            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, (animationDuration + animationDelay) * 1000);
        }
    }

    checkGameEnd() {
        if (this.coins <= 0 && this.items.length > 0) {
            this.showStatus('Game Over! Refresh to play again.');
        } else if (this.items.length === 0) {
            this.showStatus('Congratulations! You got everything!');
            this.createConfetti();
        }
    }

    showStatus(message) {
        this.status.textContent = message;
        this.status.classList.add('show');

        clearTimeout(this.statusTimeout);
        this.statusTimeout = setTimeout(() => {
            this.status.classList.remove('show');
        }, 3000);
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.coinsElement.textContent = this.coins;

        const buttons = document.querySelectorAll('.control-btn');
        buttons.forEach(button => {
            button.style.opacity = this.coins <= 0 ? '0.5' : '1';
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        new ClawMachine();
    } catch (error) {
        console.error('Failed to initialize Claw Machine:', error);
        document.getElementById('status').textContent = 'Game failed to load. Please refresh.';
        document.getElementById('status').classList.add('show');
    }
});

window.addEventListener('beforeunload', () => {
    const audioContext = window.AudioContext || window.webkitAudioContext;
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
    }
});
