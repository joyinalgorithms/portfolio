const csvDropdown = document.getElementById('csvDropdown');
const dnaDropdown = document.getElementById('dnaDropdown');
const csvFileNameDisplay = document.getElementById('csvFileName');
const dnaFileNameDisplay = document.getElementById('dnaFileName');

const availableFiles = {
    csv: [{
            name: 'Large CSV',
            filename: 'large.csv',
            path: '/static/data/large.csv'
        },
        {
            name: 'Small CSV',
            filename: 'small.csv',
            path: '/static/data/small.csv'
        }
    ],
    dna: [{
            name: 'DNA Sequence 1',
            filename: '1.txt',
            path: '/static/data/1.txt'
        },
        {
            name: 'DNA Sequence 2',
            filename: '2.txt',
            path: '/static/data/2.txt'
        },
        {
            name: 'DNA Sequence 3',
            filename: '3.txt',
            path: '/static/data/3.txt'
        },
        {
            name: 'DNA Sequence 4',
            filename: '4.txt',
            path: '/static/data/4.txt'
        },
        {
            name: 'DNA Sequence 5',
            filename: '5.txt',
            path: '/static/data/5.txt'
        },
        {
            name: 'DNA Sequence 6',
            filename: '6.txt',
            path: '/static/data/6.txt'
        },
        {
            name: 'DNA Sequence 7',
            filename: '7.txt',
            path: '/static/data/7.txt'
        },
        {
            name: 'DNA Sequence 8',
            filename: '8.txt',
            path: '/static/data/8.txt'
        },
        {
            name: 'DNA Sequence 9',
            filename: '9.txt',
            path: '/static/data/9.txt'
        },
        {
            name: 'DNA Sequence 10',
            filename: '10.txt',
            path: '/static/data/10.txt'
        },
        {
            name: 'DNA Sequence 11',
            filename: '11.txt',
            path: '/static/data/11.txt'
        },
        {
            name: 'DNA Sequence 12',
            filename: '12.txt',
            path: '/static/data/12.txt'
        },
        {
            name: 'DNA Sequence 13',
            filename: '13.txt',
            path: '/static/data/13.txt'
        },
        {
            name: 'DNA Sequence 14',
            filename: '14.txt',
            path: '/static/data/14.txt'
        },
        {
            name: 'DNA Sequence 15',
            filename: '15.txt',
            path: '/static/data/15.txt'
        },
        {
            name: 'DNA Sequence 16',
            filename: '16.txt',
            path: '/static/data/16.txt'
        },
        {
            name: 'DNA Sequence 17',
            filename: '17.txt',
            path: '/static/data/17.txt'
        },
        {
            name: 'DNA Sequence 18',
            filename: '18.txt',
            path: '/static/data/18.txt'
        },
        {
            name: 'DNA Sequence 19',
            filename: '19.txt',
            path: '/static/data/19.txt'
        },
        {
            name: 'DNA Sequence 20',
            filename: '20.txt',
            path: '/static/data/20.txt'
        },
    ]
};

function initFileDropdown(dropdown, files, displayElement) {
    dropdown.innerHTML = '<option value="" disabled selected>Select a file...</option>';
    files.forEach(file => {
        const option = document.createElement('option');
        option.value = file.path;
        option.textContent = `${file.name} (${file.filename})`;
        dropdown.appendChild(option);
    });

    dropdown.addEventListener('change', () => {
        const selected = dropdown.value;
        if (selected) {
            displayElement.textContent = selected.split('/').pop();
        } else {
            displayElement.textContent = '';
        }
    });
}


let csvSelected = false;
let dnaSelected = false;

function checkEnableAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.disabled = !(csvSelected && dnaSelected);
}

function initFileDropdown(dropdown, files, displayElement, type) {
    dropdown.innerHTML = '<option value="">Select a file...</option>';
    files.forEach(file => {
        const option = document.createElement('option');
        option.value = file.path;
        option.textContent = `${file.name} (${file.filename})`;
        dropdown.appendChild(option);
    });

    dropdown.addEventListener('change', () => {
        const selected = dropdown.value;
        if (selected) {
            displayElement.textContent = selected.split('/').pop();
            if (type === 'csv') csvSelected = true;
            if (type === 'dna') dnaSelected = true;
        } else {
            displayElement.textContent = '';
            if (type === 'csv') csvSelected = false;
            if (type === 'dna') dnaSelected = false;
        }
        checkEnableAnalyzeButton();
    });
}

function longestMatch(sequence, subsequence) {
    let longest = 0;
    let subLen = subsequence.length;
    let seqLen = sequence.length;

    for (let i = 0; i < seqLen; i++) {
        let count = 0;
        while (sequence.slice(i + count * subLen, i + (count + 1) * subLen) === subsequence) {
            count++;
        }
        longest = Math.max(longest, count);
    }
    return longest;
}

document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const csvPath = document.getElementById('csvDropdown').value;
    const dnaPath = document.getElementById('dnaDropdown').value;

    if (!csvPath || !dnaPath) return;

    document.getElementById('loadingSpinner').style.display = 'block';

    try {
        const [csvRes, dnaRes] = await Promise.all([
            fetch(csvPath),
            fetch(dnaPath)
        ]);
        const csvText = await csvRes.text();
        const dnaText = (await dnaRes.text()).trim();

        const lines = csvText.split('\n').filter(Boolean);
        const headers = lines[0].split(',').slice(1);

        const people = lines.slice(1).map(line => {
            const values = line.split(',');
            const name = values[0];
            const profile = {};
            headers.forEach((str, i) => {
                profile[str] = parseInt(values[i + 1]);
            });
            return {
                name,
                profile
            };
        });

        const strCounts = {};
        headers.forEach(str => {
            strCounts[str] = longestMatch(dnaText, str);
        });

        let matchFound = false;
        for (const person of people) {
            let isMatch = headers.every(str => person.profile[str] === strCounts[str]);
            if (isMatch) {
                matchFound = true;
                document.getElementById('matchStatus').textContent = '✅ Match Found';
                document.getElementById('matchName').textContent = person.name;
                break;
            }
        }

        if (!matchFound) {
            document.getElementById('matchStatus').textContent = '❌ No Match';
            document.getElementById('matchName').textContent = '';
        }

        const analysisDiv = document.getElementById('strAnalysis');
        analysisDiv.innerHTML = '';
        for (const str in strCounts) {
            const p = document.createElement('p');
            p.textContent = `${str}: ${strCounts[str]}`;
            analysisDiv.appendChild(p);
        }

        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
    } catch (err) {
        console.error('Analysis error:', err);
        document.getElementById('loadingSpinner').style.display = 'none';
        alert('Failed to analyze DNA. Check console for details.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initFileDropdown(csvDropdown, availableFiles.csv, csvFileNameDisplay, 'csv');
    initFileDropdown(dnaDropdown, availableFiles.dna, dnaFileNameDisplay, 'dna');
});
