// DOM Elements
const dictionarySelector = document.getElementById('dictionarySelector');
const loadDictionaryBtn = document.getElementById('loadDictionaryBtn');
const wordCount = document.getElementById('wordCount');
const loadTime = document.getElementById('loadTime');
const unloadBtn = document.getElementById('unloadBtn');
const wordInput = document.getElementById('wordInput');
const checkWordBtn = document.getElementById('checkWordBtn');
const wordResult = document.getElementById('wordResult');
const textInput = document.getElementById('textInput');
const spellCheckArea = document.getElementById('spellCheckArea');
const checkTextBtn = document.getElementById('checkTextBtn');
const clearTextBtn = document.getElementById('clearTextBtn');
const highlightBtn = document.getElementById('highlightBtn');
const spellCheckResults = document.getElementById('spellCheckResults');
const errorCount = document.getElementById('errorCount');
const errorList = document.getElementById('errorList');
const loadingOverlay = document.getElementById('loadingOverlay');
const notification = document.getElementById('notification');

// Application State
let dictionaryLoaded = false;
let currentText = '';
let misspelledWords = [];
let highlightingEnabled = true;
let dictionaryWords = new Set();

// Available dictionaries in your local folder
const availableDictionaries = [{
        name: 'English Basic',
        filename: 'english-basic.txt',
        path: '/static/dictionaries/english-basic.txt'
    },
    {
        name: 'Programming Terms',
        filename: 'programming-terms.txt',
        path: '/static/dictionaries/programming-terms.txt'
    },
    {
        name: 'Common Words',
        filename: 'common-words.txt',
        path: '/static/dictionaries/common-words.txt'
    },
    {
        name: 'Large Dictionary',
        filename: 'large.txt',
        path: '/static/dictionaries/large.txt'
    }
];

// Initialize dictionary selector
function initDictionarySelector() {
    dictionarySelector.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a dictionary...';
    dictionarySelector.appendChild(defaultOption);

    availableDictionaries.forEach(dict => {
        const option = document.createElement('option');
        option.value = dict.path;
        option.textContent = `${dict.name} (${dict.filename})`;
        dictionarySelector.appendChild(option);
    });
}

// Load dictionary from local file
async function loadLocalDictionary(dictionaryPath) {
    if (!dictionaryPath) return;

    showLoading();
    const startTime = Date.now();

    try {
        const response = await fetch(dictionaryPath);

        if (!response.ok) {
            throw new Error(`Failed to load dictionary: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        const words = text.split('\n')
            .map(word => word.trim().toLowerCase())
            .filter(word => word.length > 0);

        dictionaryWords = new Set(words);
        const loadTimeMs = Date.now() - startTime;

        dictionaryLoaded = true;
        updateDictionaryUI(words.length, loadTimeMs);
        enableSpellChecking();
        showNotification('Dictionary loaded successfully!');
    } catch (error) {
        console.error('Error loading dictionary:', error);
        showNotification(`Failed to load dictionary: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

// Setup event listeners
function setupEventListeners() {
    loadDictionaryBtn.addEventListener('click', () => {
        const selectedPath = dictionarySelector.value;
        if (selectedPath) {
            loadLocalDictionary(selectedPath);
        } else {
            showNotification('Please select a dictionary first', 'error');
        }
    });

    unloadBtn.addEventListener('click', unloadDictionary);
    wordInput.addEventListener('input', handleWordInput);
    wordInput.addEventListener('keypress', handleWordKeypress);
    checkWordBtn.addEventListener('click', checkSingleWord);
    textInput.addEventListener('input', handleTextInput);
    checkTextBtn.addEventListener('click', checkTextSpelling);
    clearTextBtn.addEventListener('click', clearText);
    highlightBtn.addEventListener('click', toggleHighlighting);
}

// Update dictionary UI after loading
function updateDictionaryUI(words, time) {
    wordCount.textContent = words.toLocaleString();
    loadTime.textContent = `${time}ms`;
    dictionarySelector.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
    unloadBtn.disabled = false;
}

// Unload dictionary
function unloadDictionary() {
    showLoading();

    setTimeout(() => {
        dictionaryLoaded = false;
        dictionaryWords = new Set();
        wordCount.textContent = '0';
        loadTime.textContent = '0ms';
        dictionarySelector.style.background = 'white';
        dictionarySelector.value = '';
        unloadBtn.disabled = true;
        disableSpellChecking();
        hideLoading();
        showNotification('Dictionary unloaded successfully!');
    }, 500);
}

// Enable spell checking features
function enableSpellChecking() {
    wordInput.disabled = false;
    checkWordBtn.disabled = false;
    textInput.disabled = false;
    checkTextBtn.disabled = false;
    highlightBtn.disabled = false;
    spellCheckArea.textContent = 'Dictionary loaded! Enter text above to start spell checking...';
}

// Disable spell checking features
function disableSpellChecking() {
    wordInput.disabled = true;
    checkWordBtn.disabled = true;
    textInput.disabled = true;
    checkTextBtn.disabled = true;
    highlightBtn.disabled = true;
    wordInput.value = '';
    textInput.value = '';
    spellCheckArea.textContent = 'Load a dictionary to start spell checking...';
    spellCheckResults.style.display = 'none';
    hideWordResult();
}

// Handle word input changes
function handleWordInput() {
    if (!dictionaryLoaded) return;

    const word = wordInput.value.trim();
    if (word) {
        setTimeout(() => checkSingleWord(), 300);
    } else {
        hideWordResult();
        wordInput.className = 'input-field';
    }
}

// Handle Enter key in word input
function handleWordKeypress(e) {
    if (e.key === 'Enter') {
        checkSingleWord();
    }
}

// Check single word spelling
function checkSingleWord() {
    const word = wordInput.value.trim();
    if (!word || !dictionaryLoaded) return;

    const isCorrect = dictionaryWords.has(word.toLowerCase());
    showWordResult(word, isCorrect);

    if (isCorrect) {
        wordInput.className = 'input-field correct';
    } else {
        wordInput.className = 'input-field incorrect';
    }
}

// Show word check result
function showWordResult(word, isCorrect) {
    wordResult.className = `check-result show ${isCorrect ? 'correct' : 'incorrect'}`;
    wordResult.innerHTML = isCorrect ?
        `✅ "${word}" is spelled correctly!` :
        `❌ "${word}" is not found in dictionary`;
}

// Hide word result
function hideWordResult() {
    wordResult.className = 'check-result';
}

// Handle text input changes
function handleTextInput() {
    currentText = textInput.value;
    if (highlightingEnabled && dictionaryLoaded) {
        clearTimeout(window.spellCheckTimeout);
        window.spellCheckTimeout = setTimeout(() => {
            performSpellCheck();
        }, 500);
    }
}

// Check text spelling
function checkTextSpelling() {
    if (!dictionaryLoaded || !currentText.trim()) return;

    showLoading();
    setTimeout(() => {
        performSpellCheck();
        hideLoading();
    }, 800);
}

// Perform spell check on text
function performSpellCheck() {
    if (!currentText.trim()) {
        spellCheckArea.textContent = 'Enter some text to check...';
        spellCheckResults.style.display = 'none';
        return;
    }

    const words = currentText.match(/\b[a-zA-Z]+\b/g) || [];
    misspelledWords = [];
    let highlightedText = currentText;

    words.forEach((word, index) => {
        const isCorrect = dictionaryWords.has(word.toLowerCase());

        if (!isCorrect) {
            misspelledWords.push({
                word: word,
                position: index + 1,
                suggestions: generateSuggestions(word)
            });

            if (highlightingEnabled) {
                const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi');
                highlightedText = highlightedText.replace(regex, `<span class="misspelled">${word}</span>`);
            }
        } else if (highlightingEnabled) {
            const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi');
            highlightedText = highlightedText.replace(regex, `<span class="correct-word">${word}</span>`);
        }
    });

    updateSpellCheckDisplay(highlightedText);
    updateErrorResults();
}

// Generate spelling suggestions
function generateSuggestions(word) {
    const suggestions = [];
    const wordArray = Array.from(dictionaryWords);
    const similarLength = wordArray.filter(w => Math.abs(w.length - word.length) <= 1);
    const firstLetterMatches = similarLength.filter(w => w.charAt(0) === word.charAt(0).toLowerCase());
    return firstLetterMatches.slice(0, 3);
}

// Escape regex special characters
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Update spell check display
function updateSpellCheckDisplay(highlightedText) {
    if (highlightingEnabled) {
        spellCheckArea.innerHTML = highlightedText || 'No text to check...';
    } else {
        spellCheckArea.textContent = currentText || 'No text to check...';
    }
}

// Update error results
function updateErrorResults() {
    errorCount.textContent = misspelledWords.length;
    errorCount.className = misspelledWords.length === 0 ? 'error-count zero' : 'error-count';
    errorList.innerHTML = '';

    if (misspelledWords.length > 0) {
        spellCheckResults.style.display = 'block';

        misspelledWords.forEach(error => {
            const errorItem = document.createElement('div');
            errorItem.className = 'error-item';
            errorItem.innerHTML = `
                <div>
                    <div class="error-word">${error.word}</div>
                    <div class="error-position">Position: ${error.position}</div>
                </div>
                <div class="error-suggestions">
                    ${error.suggestions.join(', ') || 'No suggestions'}
                </div>
            `;
            errorList.appendChild(errorItem);
        });
    } else {
        spellCheckResults.style.display = 'none';
    }
}

// Clear text
function clearText() {
    textInput.value = '';
    currentText = '';
    spellCheckArea.textContent = dictionaryLoaded ?
        'Enter text above to start spell checking...' :
        'Load a dictionary to start spell checking...';
    spellCheckResults.style.display = 'none';
    misspelledWords = [];
}

// Toggle highlighting
function toggleHighlighting() {
    highlightingEnabled = !highlightingEnabled;
    highlightBtn.innerHTML = highlightingEnabled ?
        '<span class="btn-icon">🎨</span> Disable Highlighting' :
        '<span class="btn-icon">🎨</span> Enable Highlighting';

    if (currentText) {
        performSpellCheck();
    }
}

// Show loading overlay
function showLoading() {
    loadingOverlay.classList.add('show');
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.classList.remove('show');
}

// Show notification
function showNotification(message, type = 'success') {
    const notificationElement = document.getElementById('notification');
    const messageElement = notificationElement.querySelector('.notification-message');
    const iconElement = notificationElement.querySelector('.notification-icon');

    messageElement.textContent = message;

    if (type === 'error') {
        notificationElement.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
        iconElement.textContent = '❌';
    } else {
        notificationElement.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
        iconElement.textContent = '✅';
    }

    notificationElement.classList.add('show');

    setTimeout(() => {
        notificationElement.classList.remove('show');
    }, 3000);
}

// Initialize application
function initApp() {
    initDictionarySelector();
    setupEventListeners();
    disableSpellChecking();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
