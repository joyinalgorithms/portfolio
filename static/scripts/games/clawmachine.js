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
        this.volumeControl = document.getElementById('volumeControl');

        this.clawPosition = 50;
        this.isGrabbing = false;
        this.score = 0;
        this.coins = 10;
        this.items = [];
        this.prizes = [];
        this.soundEnabled = true;

        this.moveSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg4ODg4P//////////////////AAAAOkxhdmM1OC4xMzAAAAAAAAAAAAAAAAD/4zLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAANmAKIWUEQACCwgOIbRpc3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        this.grabSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAeAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg4ODg4P//////////////////AAAAOkxhdmM1OC4xMzAAAAAAAAAAAAAAAAD/4zLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAASiAJ4eUEQABAwqCoKgpjQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==');
        this.successSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAABAAAAeAAICAgICAgICAgICAgQEBAQEBAQEBAQEBAYGBgYGBgYGBgYGBgYICAgICAgICAgICAgKCgoKCgoKCgoKCgoMDAwMDAwMDAwMDAwODg4ODg4ODg4ODg4P//////////////////AAAAOkxhdmM1OC4xMzAAAAAAAAAAAAAAAAD/4zLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAASAAKoeUEQACCwgOIbRpVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==');
        this.failSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAABAAAAeAAICAgICAgICAgICAgQEBAQEBAQEBAQEBAYGBgYGBgYGBgYGBgYICAgICAgICAgICAgKCgoKCgoKCgoKCgoMDAwMDAwMDAwMDAwODg4ODg4ODg4ODg4P//////////////////AAAAOkxhdmM1OC4xMzAAAAAAAAAAAAAAAAD/4zLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAASiAJ4eUEQABAwqCoKgpjQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==');

        this.initializeItems();
        this.bindEvents();
        this.showStatus('Ready to play!');
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

        const gridCells = 10;
        const cellWidth = (this.itemsContainer.offsetWidth - 20) / gridCells;
        const columnHeights = Array(gridCells).fill(0);

        for (let i = 0; i < 15; i++) {
            const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            const item = document.createElement('div');
            item.className = `item ${itemType.class}`;
            item.textContent = itemType.emoji;
            item.dataset.points = itemType.points;

            const col = Math.floor(Math.random() * gridCells);

            const x = col * cellWidth + 10 + (Math.random() * 10 - 5);
            const y = columnHeights[col];

            item.style.left = x + 'px';
            item.style.bottom = y + 'px';

            columnHeights[col] += 52;

            this.itemsContainer.appendChild(item);
            this.items.push(item);
        }
    }

    bindEvents() {
        document.getElementById('moveLeft').addEventListener('click', () => this.moveClaw(-1));
        document.getElementById('moveRight').addEventListener('click', () => this.moveClaw(1));
        document.getElementById('grabBtn').addEventListener('click', () => this.grab());
        this.volumeControl.addEventListener('click', () => this.toggleSound());

        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.moveClaw(-1);
                    break;
                case 'ArrowRight':
                    this.moveClaw(1);
                    break;
                case ' ':
                    e.preventDefault();
                    this.grab();
                    break;
            }
        });
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.volumeControl.textContent = this.soundEnabled ? '🔊' : '🔇';
    }

    playSound(sound) {
        if (this.soundEnabled) {
            sound.currentTime = 0;
            sound.play();
        }
    }

    moveClaw(direction) {
        if (this.isGrabbing) return;

        this.clawPosition += direction * 5;
        this.clawPosition = Math.max(10, Math.min(90, this.clawPosition));

        this.clawContainer.style.left = this.clawPosition + '%';
        this.playSound(this.moveSound);
    }

    async grab() {
        if (this.isGrabbing || this.coins <= 0) return;

        this.coins--;
        this.updateDisplay();
        this.isGrabbing = true;

        this.showStatus('Grabbing...');
        this.playSound(this.grabSound);

        this.clawArm.style.height = '280px';
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
            const containerRect = this.itemsContainer.getBoundingClientRect();

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

            const success = Math.random() < 0.7;

            if (success) {
                this.score += parseInt(grabbedItem.dataset.points);
                this.showStatus(`Success! +${grabbedItem.dataset.points} points!`);
                this.playSound(this.successSound);

                this.addPrize(grabbedItem.textContent, grabbedItem.className);

                this.createConfetti();

                grabbedItem.classList.add('celebrate');

                await this.delay(1500);

                grabbedItem.remove();
                this.items = this.items.filter(item => item !== grabbedItem);

            } else {
                this.showStatus('Oh no! The item slipped!');
                this.playSound(this.failSound);
                grabbedItem.style.position = 'absolute';

                const gridCells = 8;
                const cellWidth = this.itemsContainer.offsetWidth / gridCells;
                const col = Math.floor(Math.random() * gridCells);
                const x = col * cellWidth + (Math.random() * 10 - 5);
                const y = Math.random() * 20;

                grabbedItem.style.left = x + 'px';
                grabbedItem.style.bottom = y + 'px';
                grabbedItem.style.zIndex = '1';
                grabbedItem.classList.remove('grabbed');
                grabbedItem.classList.add('falling');

                await this.delay(1000);
                grabbedItem.classList.remove('falling');
            }
        } else {
            this.showStatus('Missed! Try again.');
            await this.delay(1000);
            this.clawArm.style.height = '60px';
        }

        this.claw.classList.remove('grabbing');
        this.claw.classList.remove('holding');
        this.isGrabbing = false;
        this.updateDisplay();

        if (this.coins <= 0 && this.items.length > 0) {
            this.showStatus('Game Over! Refresh to play again.');
        } else if (this.items.length === 0) {
            this.showStatus('Congratulations! You got everything!');
            this.createConfetti();
        }
    }

    checkCollision() {
        const clawRect = this.claw.getBoundingClientRect();
        const clawCenterX = clawRect.left + clawRect.width / 2;
        const clawBottom = clawRect.bottom;

        const containerRect = this.itemsContainer.getBoundingClientRect();

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

            if (horizontalDistance < 30 && verticalDistance < 40) {
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
        this.prizesList.appendChild(prizeItem);
        this.prizes.push(prizeItem);
    }

    createConfetti() {
        const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#277da1'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 600 + 'px';
            confetti.style.top = -10 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.opacity = '1';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            document.querySelector('.game-container').appendChild(confetti);

            const animationDuration = Math.random() * 2 + 1;
            const animationDelay = Math.random() * 0.5;

            confetti.style.animation = `confettiFall ${animationDuration}s ease-in ${animationDelay}s forwards`;

            setTimeout(() => {
                confetti.remove();
            }, (animationDuration + animationDelay) * 1000);
        }
    }

    showStatus(message) {
        this.status.textContent = message;
        this.status.classList.add('show');
        setTimeout(() => {
            this.status.classList.remove('show');
        }, 2000);
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.coinsElement.textContent = this.coins;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.addEventListener('load', () => {
    new ClawMachine();
});
