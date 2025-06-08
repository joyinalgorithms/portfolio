class CaesarCipher {
    constructor() {
        this.plaintextInput = document.getElementById('plaintextInput');
        this.ciphertextOutput = document.getElementById('ciphertextOutput');
        this.keyInput = document.getElementById('keyInput');
        this.decreaseKeyBtn = document.getElementById('decreaseKey');
        this.increaseKeyBtn = document.getElementById('increaseKey');
        this.encryptBtn = document.getElementById('encryptBtn');
        this.decryptBtn = document.getElementById('decryptBtn');
        this.wheelOuter = document.getElementById('wheelOuter');
        this.wheelInner = document.getElementById('wheelInner');
        this.wheelKeyDisplay = document.getElementById('wheelKeyDisplay');
        this.animationContainer = document.getElementById('animationContainer');
        this.loading = document.getElementById('loading');

        this.init();
    }

    init() {
        this.createCipherWheel();

        this.keyInput.addEventListener('input', () => this.updateKey());
        this.decreaseKeyBtn.addEventListener('click', () => this.changeKey(-1));
        this.increaseKeyBtn.addEventListener('click', () => this.changeKey(1));
        this.encryptBtn.addEventListener('click', () => this.processText('encrypt'));
        this.decryptBtn.addEventListener('click', () => this.processText('decrypt'));

        this.plaintextInput.addEventListener('input', () => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.processText('encrypt', false);
            }, 300);
        });

        this.addWheelInteractivity();
    }

    createCipherWheel() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        this.wheelOuter.innerHTML = '';
        for (let i = 0; i < 26; i++) {
            const letter = alphabet[i];
            const angle = (i * 360 / 26) - 90;
            const radius = 160;

            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);

            const letterElement = document.createElement('div');
            letterElement.className = 'wheel-letter outer-letter';
            letterElement.textContent = letter;
            letterElement.style.transform = `translate(${x}px, ${y}px)`;
            letterElement.dataset.letter = letter;
            letterElement.dataset.index = i;

            this.wheelOuter.appendChild(letterElement);
        }
        this.updateInnerWheel();
    }

    updateInnerWheel() {
        this.wheelInner.innerHTML = '';

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const key = parseInt(this.keyInput.value) % 26;

        this.wheelKeyDisplay.textContent = key;

        this.wheelInner.style.transform = `translate(-50%, -50%) rotate(${key * (360 / 26)}deg)`;

        for (let i = 0; i < 26; i++) {
            const letterIndex = (i + key) % 26;
            const letter = alphabet[letterIndex];
            const angle = (i * 360 / 26) - 90;
            const radius = 110;

            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);

            const letterElement = document.createElement('div');
            letterElement.className = 'wheel-letter inner-letter';
            letterElement.textContent = letter;
            letterElement.style.transform = `translate(${x}px, ${y}px) rotate(${-key * (360 / 26)}deg)`;
            letterElement.dataset.letter = letter;
            letterElement.dataset.originalIndex = i;

            this.wheelInner.appendChild(letterElement);
        }

        this.highlightWheelLetters();
    }

    addWheelInteractivity() {
        let isDragging = false;
        let startAngle = 0;
        let currentRotation = 0;

        const getAngle = (e, center) => {
            const rect = this.wheelInner.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            return Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
        };

        this.wheelInner.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = this.wheelInner.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            startAngle = getAngle(e, {
                x: centerX,
                y: centerY
            });
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const rect = this.wheelInner.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const currentAngle = getAngle(e, {
                x: centerX,
                y: centerY
            });

            let deltaAngle = currentAngle - startAngle;

            const keyChange = Math.round(deltaAngle / (360 / 26));

            if (Math.abs(keyChange) >= 1) {
                let newKey = (parseInt(this.keyInput.value) + keyChange) % 26;
                if (newKey < 0) newKey += 26;

                this.keyInput.value = newKey;
                this.updateInnerWheel();
                this.processText('encrypt', false);

                startAngle = currentAngle;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        this.wheelInner.addEventListener('touchstart', (e) => {
            isDragging = true;
            const touch = e.touches[0];
            const rect = this.wheelInner.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const touch = e.touches[0];
            const rect = this.wheelInner.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const currentAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;

            let deltaAngle = currentAngle - startAngle;
            const keyChange = Math.round(deltaAngle / (360 / 26));

            if (Math.abs(keyChange) >= 1) {
                let newKey = (parseInt(this.keyInput.value) + keyChange) % 26;
                if (newKey < 0) newKey += 26;

                this.keyInput.value = newKey;
                this.updateInnerWheel();
                this.processText('encrypt', false);

                startAngle = currentAngle;
            }
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    highlightWheelLetters() {
        document.querySelectorAll('.wheel-letter').forEach(letter => {
            letter.style.background = letter.classList.contains('outer-letter') ?
                'rgba(212,175,55,0.8)' : 'rgba(255,215,0,0.8)';
            letter.style.transform = letter.style.transform.replace('scale(1.2)', '');
        });

        const text = this.plaintextInput.value.toUpperCase();
        if (!text) return;

        for (let char of text) {
            if (char.match(/[A-Z]/)) {
                const outerLetter = document.querySelector(`.outer-letter[data-letter="${char}"]`);
                const key = parseInt(this.keyInput.value) % 26;
                const encryptedChar = String.fromCharCode(((char.charCodeAt(0) - 65 + key) % 26) + 65);
                const innerLetter = document.querySelector(`.inner-letter[data-letter="${encryptedChar}"]`);

                if (outerLetter) {
                    outerLetter.style.background = '#ff6b6b';
                    outerLetter.style.transform += ' scale(1.2)';
                }
                if (innerLetter) {
                    innerLetter.style.background = '#4ecdc4';
                    innerLetter.style.transform += ' scale(1.2)';
                }
            }
        }
    }

    updateKey() {
        let key = parseInt(this.keyInput.value);

        if (isNaN(key) || key < 0) {
            key = 0;
        } else if (key > 25) {
            key = 25;
        }

        this.keyInput.value = key;
        this.updateInnerWheel();

        if (this.plaintextInput.value) {
            this.processText('encrypt', false);
        }
    }

    changeKey(delta) {
        let key = parseInt(this.keyInput.value) + delta;
        if (key < 0) key = 25;
        if (key > 25) key = 0;

        this.keyInput.value = key;
        this.updateInnerWheel();

        if (this.plaintextInput.value) {
            this.processText('encrypt', false);
        }
    }

    async processText(mode, animate = true) {
        const text = this.plaintextInput.value;
        if (!text) {
            this.ciphertextOutput.value = '';
            return;
        }

        const key = parseInt(this.keyInput.value) % 26;

        if (animate) {
            this.showLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const result = mode === 'encrypt' ?
            this.encryptText(text, key) :
            this.decryptText(text, key);

        if (animate) {
            this.animateEncryption(text, result, mode);
        }

        this.ciphertextOutput.value = result;
        this.highlightWheelLetters();

        if (animate) {
            this.showLoading(false);
        }
    }

    encryptText(text, key) {
        return this.shiftText(text, key);
    }

    decryptText(text, key) {
        return this.shiftText(text, 26 - key);
    }

    shiftText(text, key) {
        let result = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (char.match(/[a-z]/i)) {
                const code = text.charCodeAt(i);

                if (code >= 65 && code <= 90) {
                    result += String.fromCharCode(((code - 65 + key) % 26) + 65);
                } else if (code >= 97 && code <= 122) {
                    result += String.fromCharCode(((code - 97 + key) % 26) + 97);
                }
            } else {
                result += char;
            }
        }

        return result;
    }

    animateEncryption(original, encrypted, mode) {
        this.animationContainer.innerHTML = '';

        const maxChars = 15;
        const textToAnimate = original.length > maxChars ?
            original.substring(0, maxChars) + '...' : original;
        const encryptedToAnimate = encrypted.length > maxChars ?
            encrypted.substring(0, maxChars) + '...' : encrypted;

        for (let i = 0; i < Math.min(textToAnimate.length, maxChars); i++) {
            const char = textToAnimate[i];
            const encryptedChar = encryptedToAnimate[i] || ' ';

            if (char === '.' && textToAnimate.endsWith('...')) continue;

            const letterDiv = document.createElement('div');
            letterDiv.className = 'letter-animation';

            const originalSpan = document.createElement('div');
            originalSpan.className = 'letter-original';
            originalSpan.textContent = char;

            const encryptedSpan = document.createElement('div');
            encryptedSpan.className = 'letter-encrypted';
            encryptedSpan.textContent = encryptedChar;

            letterDiv.appendChild(originalSpan);
            letterDiv.appendChild(encryptedSpan);
            this.animationContainer.appendChild(letterDiv);

            setTimeout(() => {
                letterDiv.classList.add('animating');
            }, i * 100);
        }
    }

    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CaesarCipher();
});
