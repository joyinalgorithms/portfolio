class CreditCardValidator {
    constructor() {
        this.cardNumber = document.getElementById('cardNumber');
        this.cardDisplay = document.getElementById('cardDisplay');
        this.cardBrand = document.getElementById('cardBrand');
        this.cardInner = document.getElementById('cardInner');
        this.form = document.getElementById('validatorForm');
        this.validateBtn = document.getElementById('validateBtn');
        this.result = document.getElementById('result');
        this.loading = document.getElementById('loading');

        this.init();
    }

    init() {
        this.cardNumber.addEventListener('input', (e) => this.handleInput(e));
        this.cardNumber.addEventListener('focus', () => this.flipCard(false));
        this.cardNumber.addEventListener('blur', () => {
            setTimeout(() => this.flipCard(true), 100);
        });
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleInput(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = this.formatCardNumber(value);

        e.target.value = formattedValue;
        this.updateCardDisplay(value);
        this.detectCardType(value);
        this.clearResult();
    }

    formatCardNumber(value) {
        value = value.replace(/\D/g, '');

        return value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    updateCardDisplay(value) {
        if (value.length === 0) {
            this.cardDisplay.textContent = '•••• •••• •••• ••••';
            return;
        }

        let formatted = '';
        for (let i = 0; i < 16; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += value[i] || '•';
        }

        this.cardDisplay.textContent = formatted;
    }

    detectCardType(value) {
        const cardFace = document.querySelector('.card-face.front');

        cardFace.classList.remove('card-visa', 'card-mastercard', 'card-amex', 'card-unknown');

        if (value.length === 0) {
            this.cardBrand.textContent = 'UNKNOWN';
            cardFace.classList.add('card-unknown');
            return;
        }

        if (value.startsWith('4')) {
            this.cardBrand.textContent = 'VISA';
            cardFace.classList.add('card-visa');
        } else if (value.startsWith('34') || value.startsWith('37')) {
            this.cardBrand.textContent = 'AMEX';
            cardFace.classList.add('card-amex');
        } else if (/^5[1-5]/.test(value)) {
            this.cardBrand.textContent = 'MASTERCARD';
            cardFace.classList.add('card-mastercard');
        } else {
            this.cardBrand.textContent = 'UNKNOWN';
            cardFace.classList.add('card-unknown');
        }
    }

    flipCard(toBack) {
        if (toBack) {
            this.cardInner.style.transform = 'rotateY(180deg)';
        } else {
            this.cardInner.style.transform = 'rotateY(0deg)';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const cardNumber = this.cardNumber.value.replace(/\s/g, '');

        if (!cardNumber) {
            this.showResult('Please enter a card number', false);
            return;
        }

        this.showLoading(true);
        this.validateBtn.disabled = true;

        try {
            const response = await fetch('/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    number: cardNumber
                })
            });

            const data = await response.json();

            await new Promise(resolve => setTimeout(resolve, 1000));

            this.showResult(data.result, data.valid);

        } catch (error) {
            const result = this.validateClientSide(cardNumber);
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showResult(result.message, result.valid);
        } finally {
            this.showLoading(false);
            this.validateBtn.disabled = false;
        }
    }

    validateClientSide(cardNumber) {
        let checksum = 0;
        let position = 0;
        let number = parseInt(cardNumber);
        const originalNumber = number;

        while (number > 0) {
            let digit = number % 10;
            number = Math.floor(number / 10);
            position++;

            if (position % 2 === 0) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            checksum += digit;
        }

        const valid = checksum % 10 === 0;

        if (!valid) {
            return {
                message: 'INVALID',
                valid: false
            };
        }

        if (position === 15) {
            const prefix = Math.floor(originalNumber / Math.pow(10, 13));
            if (prefix === 34 || prefix === 37) {
                return {
                    message: 'AMEX',
                    valid: true
                };
            }
        } else if (position === 13) {
            const prefix = Math.floor(originalNumber / Math.pow(10, 12));
            if (prefix === 4) {
                return {
                    message: 'VISA',
                    valid: true
                };
            }
        } else if (position === 16) {
            const prefix2 = Math.floor(originalNumber / Math.pow(10, 14));
            const prefix1 = Math.floor(originalNumber / Math.pow(10, 15));

            if (prefix2 >= 51 && prefix2 <= 55) {
                return {
                    message: 'MASTERCARD',
                    valid: true
                };
            } else if (prefix1 === 4) {
                return {
                    message: 'VISA',
                    valid: true
                };
            }
        }

        return {
            message: 'INVALID',
            valid: false
        };
    }

    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
    }

    showResult(message, isValid) {
        this.result.textContent = message;
        this.result.className = `result ${isValid ? 'valid' : 'invalid'} show`;

        this.cardNumber.className = `input-field ${isValid ? 'valid' : 'invalid'}`;
    }

    clearResult() {
        this.result.classList.remove('show');
        this.cardNumber.classList.remove('valid', 'invalid');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new CreditCardValidator();
});
