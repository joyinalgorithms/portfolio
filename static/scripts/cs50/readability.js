class ReadabilityAnalyzer {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.letterCount = document.getElementById('letterCount');
        this.wordCount = document.getElementById('wordCount');
        this.sentenceCount = document.getElementById('sentenceCount');
        this.avgLetters = document.getElementById('avgLetters');
        this.avgSentences = document.getElementById('avgSentences');
        this.lettersProgress = document.getElementById('lettersProgress');
        this.sentencesProgress = document.getElementById('sentencesProgress');
        this.gradeValue = document.getElementById('gradeValue');
        this.gradeDescription = document.getElementById('gradeDescription');
        this.gradeSection = document.getElementById('gradeSection');
        this.loading = document.getElementById('loading');

        this.init();
    }

    init() {
        this.textInput.addEventListener('input', () => this.handleTextInput());
        this.analyzeBtn.addEventListener('click', () => this.analyzeText());

        this.textInput.addEventListener('input', () => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.performAnalysis();
            }, 500);
        });
    }

    handleTextInput() {
        const text = this.textInput.value.trim();
        this.analyzeBtn.disabled = !text;

        if (!text) {
            this.resetStats();
        }
    }

    async analyzeText() {
        const text = this.textInput.value.trim();

        if (!text) {
            alert('Please enter some text to analyze!');
            return;
        }

        this.showLoading(true);
        this.analyzeBtn.disabled = true;

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text
                })
            });

            const data = await response.json();

            await new Promise(resolve => setTimeout(resolve, 1000));

            this.displayResults(data);

        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const results = this.performClientSideAnalysis(text);
            this.displayResults(results);
        } finally {
            this.showLoading(false);
            this.analyzeBtn.disabled = false;
        }
    }

    performAnalysis() {
        const text = this.textInput.value.trim();
        if (!text) return;

        const results = this.performClientSideAnalysis(text);
        this.displayResults(results, false);
    }

    performClientSideAnalysis(text) {
        const letters = this.countLetters(text);
        const words = this.countWords(text);
        const sentences = this.countSentences(text);

        const avgLetters = words > 0 ? (letters / words) * 100 : 0;
        const avgSentences = words > 0 ? (sentences / words) * 100 : 0;
        const index = Math.round(0.0588 * avgLetters - 0.296 * avgSentences - 15.8);

        let grade, description;
        if (index > 16) {
            grade = "16+";
            description = "Graduate level reading";
        } else if (index < 1) {
            grade = "Before Grade 1";
            description = "Kindergarten level reading";
        } else {
            grade = `Grade ${index}`;
            description = this.getGradeDescription(index);
        }

        return {
            letters,
            words,
            sentences,
            avgLetters: Math.round(avgLetters * 10) / 10,
            avgSentences: Math.round(avgSentences * 10) / 10,
            grade,
            description,
            index
        };
    }

    countLetters(text) {
        let letters = 0;
        for (let char of text) {
            if (char.match(/[a-zA-Z]/)) {
                letters++;
            }
        }
        return letters;
    }

    countWords(text) {
        if (!text.trim()) return 0;

        let words = 1;
        for (let i = 0; i < text.length - 1; i++) {
            if (text[i] === ' ' && text[i + 1] !== ' ') {
                words++;
            }
        }
        return words;
    }

    countSentences(text) {
        let sentences = 0;
        for (let char of text) {
            if (char.match(/[.!?]/)) {
                sentences++;
            }
        }
        return sentences;
    }

    getGradeDescription(index) {
        if (index <= 5) return "Elementary school level";
        if (index <= 8) return "Middle school level";
        if (index <= 12) return "High school level";
        return "College level reading";
    }

    displayResults(results, animate = true) {
        if (animate) {
            this.animateCounter(this.letterCount, results.letters);
            this.animateCounter(this.wordCount, results.words);
            this.animateCounter(this.sentenceCount, results.sentences);
        } else {
            this.letterCount.textContent = results.letters;
            this.wordCount.textContent = results.words;
            this.sentenceCount.textContent = results.sentences;
        }

        this.avgLetters.textContent = results.avgLetters;
        this.avgSentences.textContent = results.avgSentences;

        this.lettersProgress.style.width = Math.min(results.avgLetters, 100) + '%';
        this.sentencesProgress.style.width = Math.min(results.avgSentences * 10, 100) + '%';

        this.gradeValue.textContent = results.grade;
        this.gradeDescription.textContent = results.description;

        this.updateGradeIndicators(results.index);

        this.updateGradeSectionColor(results.index);
    }

    animateCounter(element, target) {
        element.classList.add('updating');
        const current = parseInt(element.textContent) || 0;
        const increment = Math.ceil((target - current) / 20);

        const updateCounter = () => {
            const currentValue = parseInt(element.textContent) || 0;
            if (currentValue < target) {
                element.textContent = Math.min(currentValue + increment, target);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
                element.classList.remove('updating');
            }
        };

        updateCounter();
    }

    updateGradeIndicators(index) {
        const indicators = document.querySelectorAll('.grade-indicator');
        indicators.forEach(indicator => indicator.classList.remove('active'));

        if (index <= 5) {
            document.querySelector('.grade-elementary').classList.add('active');
        } else if (index <= 8) {
            document.querySelector('.grade-middle').classList.add('active');
        } else if (index <= 12) {
            document.querySelector('.grade-high').classList.add('active');
        } else {
            document.querySelector('.grade-college').classList.add('active');
        }
    }

    updateGradeSectionColor(index) {
        const section = this.gradeSection;
        section.style.background = this.getGradientForLevel(index);
    }

    getGradientForLevel(index) {
        if (index <= 5) return 'linear-gradient(135deg, #48bb78, #38a169)';
        if (index <= 8) return 'linear-gradient(135deg, #ed8936, #dd6b20)';
        if (index <= 12) return 'linear-gradient(135deg, #e53e3e, #c53030)';
        return 'linear-gradient(135deg, #9f7aea, #805ad5)';
    }

    resetStats() {
        this.letterCount.textContent = '0';
        this.wordCount.textContent = '0';
        this.sentenceCount.textContent = '0';
        this.avgLetters.textContent = '0';
        this.avgSentences.textContent = '0';
        this.lettersProgress.style.width = '0%';
        this.sentencesProgress.style.width = '0%';
        this.gradeValue.textContent = '-';
        this.gradeDescription.textContent = 'Enter text to analyze';

        const indicators = document.querySelectorAll('.grade-indicator');
        indicators.forEach(indicator => indicator.classList.remove('active'));

        this.gradeSection.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }

    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ReadabilityAnalyzer();
});
