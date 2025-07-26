document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.button-1').addEventListener('click', () => {
        let result = document.querySelector('.js-result');
        result.innerHTML = 'Correct Answer!';
        document.querySelector('.button-1').classList.add('green-button');
    });

    document.querySelector('.button-2').addEventListener('click', () => {
        wrongAnswer('.button-2');

    });
    document.querySelector('.button-3').addEventListener('click', () => {
        wrongAnswer('.button-3');


    });
    document.querySelector('.button-4').addEventListener('click', () => {
        wrongAnswer('.button-4');


    });

    function wrongAnswer(className) {
        if (document.querySelector(className).classList.contains('red-button')) {
            document.querySelector(className).classList.remove('red-button');
        } else {
            check();
            let result = document.querySelector('.js-result');
            result.innerHTML = 'Wrong Answer!';
            document.querySelector(className).classList.add('red-button');
        }

    };

    function check() {
        if (document.querySelector('.red-button')) {
            document.querySelector('.red-button').classList.remove('red-button');
        } else if (document.querySelector('.green-button')) {
            document.querySelector('.green-button').classList.remove('green-button');
        }
    }


    document.querySelector('.js-submit').addEventListener('click', () => {
        checkAnswer();
    })

    function checkAnswer() {
        let input = document.querySelector('.js-input');
        let answer = input.value.toLowerCase();
        if (answer === 'arpanet') {
            document.querySelector('.js-result2').innerHTML = 'Correct Answer!';
            document.querySelector('.js-input').classList.remove('red-button');
            document.querySelector('.js-input').classList.add('green-button');
        } else {
            document.querySelector('.js-result2').innerHTML = 'Wrong Answer!';
            document.querySelector('.js-input').classList.remove('green-button');
            document.querySelector('.js-input').classList.add('red-button');
        }
    };


});
