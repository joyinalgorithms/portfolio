const keyInput = document.getElementById('keyInput');
const plaintextInput = document.getElementById('plaintextInput');
const encryptBtn = document.getElementById('encryptBtn');
const keyValidation = document.getElementById('keyValidation');
const plaintextValidation = document.getElementById('plaintextValidation');
const keyProgress = document.getElementById('keyProgress');
const alphabetDisplay = document.getElementById('alphabetDisplay');
const resultSection = document.getElementById('resultSection');
const ciphertextOutput = document.getElementById('ciphertextOutput');
const copyBtn = document.getElementById('copyBtn');
const loading = document.getElementById('loading');
const cipherForm = document.getElementById('cipherForm');

function initializeAlphabetDisplay() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    alphabetDisplay.innerHTML = '';

    for (let i = 0; i < 26; i++) {
        const letterPair = document.createElement('div');
        letterPair.className = 'letter-pair';
        letterPair.innerHTML = `
            <span class="original-letter">${alphabet[i]}</span>
            <span class="cipher-letter">?</span>
        `;
        alphabetDisplay.appendChild(letterPair);
    }
}

function updateAlphabetDisplay(key) {
    const letterPairs = alphabetDisplay.querySelectorAll('.letter-pair');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    letterPairs.forEach((pair, index) => {
        const cipherLetter = pair.querySelector('.cipher-letter');
        if (key[index]) {
            cipherLetter.textContent = key[index].toUpperCase();
            cipherLetter.style.opacity = '1';
        } else {
            cipherLetter.textContent = '?';
            cipherLetter.style.opacity = '0.5';
        }
    });
}

function validateKey(key) {
    const errors = [];

    if (key.length !== 26) {
        errors.push(`Key must be exactly 26 characters (currently ${key.length})`);
    }

    if (!/^[a-zA-Z]+$/.test(key)) {
        errors.push('Key must contain only letters');
    }

    const upperKey = key.toUpperCase();
    const uniqueChars = new Set(upperKey);
    if (uniqueChars.size !== 26) {
        errors.push('Key must not have repeated letters');
    }

    return errors;
}

function showValidation(element, message, isError = true) {
    element.textContent = message;
    element.className = `validation-message show ${isError ? 'error' : 'success'}`;
}

function hideValidation(element) {
    element.className = 'validation-message';
}

function updateKeyProgress(length) {
    const progress = (length / 26) * 100;
    keyProgress.style.width = `${progress}%`;
}

keyInput.addEventListener('input', function() {
    const key = this.value;
    const errors = validateKey(key);

    updateKeyProgress(key.length);
    updateAlphabetDisplay(key);

    if (key.length === 0) {
        hideValidation(keyValidation);
        this.className = 'input-field key-input';
    } else if (errors.length === 0) {
        showValidation(keyValidation, '✓ Valid key!', false);
        this.className = 'input-field key-input valid';
    } else {
        showValidation(keyValidation, errors[0], true);
        this.className = 'input-field key-input invalid';
    }

    updateEncryptButton();
});

plaintextInput.addEventListener('input', function() {
    const text = this.value.trim();

    if (text.length === 0) {
        hideValidation(plaintextValidation);
        this.className = 'input-field plaintext-input';
    } else {
        showValidation(plaintextValidation, `✓ Ready to encrypt (${text.length} characters)`, false);
        this.className = 'input-field plaintext-input valid';
    }

    updateEncryptButton();
});

function updateEncryptButton() {
    const keyValid = validateKey(keyInput.value).length === 0;
    const textValid = plaintextInput.value.trim().length > 0;

    encryptBtn.disabled = !(keyValid && textValid);
}

function substitutionCipher(plaintext, key) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const keyUpper = key.toUpperCase();
    let ciphertext = '';

    for (let char of plaintext) {
        if (char.match(/[A-Z]/)) {
            const index = char.charCodeAt(0) - 'A'.charCodeAt(0);
            ciphertext += keyUpper[index];
        } else if (char.match(/[a-z]/)) {
            const index = char.charCodeAt(0) - 'a'.charCodeAt(0);
            ciphertext += keyUpper[index].toLowerCase();
        } else {
            ciphertext += char;
        }
    }

    return ciphertext;
}

cipherForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const key = keyInput.value;
    const plaintext = plaintextInput.value;

    loading.style.display = 'block';
    encryptBtn.disabled = true;
    setTimeout(() => {
        const ciphertext = substitutionCipher(plaintext, key);

        ciphertextOutput.value = ciphertext;
        resultSection.classList.add('show');
        loading.style.display = 'none';
        encryptBtn.disabled = false;


        resultSection.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }, 800);
});


copyBtn.addEventListener('click', function() {
    ciphertextOutput.select();
    document.execCommand('copy');

    const originalText = this.textContent;
    this.textContent = '✓ Copied!';
    this.style.background = 'rgba(76, 175, 80, 0.3)';

    setTimeout(() => {
        this.textContent = originalText;
        this.style.background = 'rgba(255, 255, 255, 0.2)';
    }, 2000);
});

initializeAlphabetDisplay();
