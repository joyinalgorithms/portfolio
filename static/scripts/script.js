document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.advanced-btn').addEventListener('click', (event) => {
        event.preventDefault();
        const allWords = document.getElementById('allwords').value
        const exactword = document.getElementById('exactword').value
        const anyword = document.getElementById('anyword').value
        const nonewords = document.getElementById('nonewords').value

        let query = '';
        if (allWords) query += allWords;
        if (exactword) query += ` "${exactword}"`;
        if (anyword) query += ` ${anyword.split(' ').join('|')}`;
        if (nonewords) query += ` ${nonewords.split(' ').map(word => `-${word}`).join(' ')}`;

        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    });
});

function feelingLucky() {
    const query = document.querySelector('input[name="q"]').value;
    window.location.href = `https://www.google.com/search?q=${query}&btnI=I`;
}
