let candidates = [];
let preferences = [];
let currentStep = 1;
let voterCount = 0;
let currentVoter = 1;
let currentRanking = [];
let currentRound = 1;
let roundResults = [];

class Candidate {
    constructor(name) {
        this.name = name;
        this.votes = 0;
        this.eliminated = false;
    }
}

const candidateInput = document.getElementById('candidateInput');
const candidateValidation = document.getElementById('candidateValidation');
const candidateList = document.getElementById('candidateList');
const nextToVotersBtn = document.getElementById('nextToVotersBtn');
const voterCountInput = document.getElementById('voterCountInput');
const voterValidation = document.getElementById('voterValidation');
const startRankingBtn = document.getElementById('startRankingBtn');
const currentVoterNumber = document.getElementById('currentVoterNumber');
const rankingList = document.getElementById('rankingList');
const rankingValidation = document.getElementById('rankingValidation');
const submitRankingBtn = document.getElementById('submitRankingBtn');
const roundsContainer = document.getElementById('roundsContainer');
const nextRoundBtn = document.getElementById('nextRoundBtn');
const showFinalResultsBtn = document.getElementById('showFinalResultsBtn');
const finalResultsContainer = document.getElementById('finalResultsContainer');
const progressFill = document.getElementById('progressFill');

function showValidation(element, message, isError = true) {
    element.textContent = message;
    element.className = `validation-message show ${isError ? 'error' : 'success'}`;
}

function hideValidation(element) {
    element.className = 'validation-message';
}

function addCandidate() {
    const name = candidateInput.value.trim();

    if (!name) {
        showValidation(candidateValidation, 'Please enter a candidate name');
        return;
    }

    if (candidates.length >= 9) {
        showValidation(candidateValidation, 'Maximum 9 candidates allowed');
        return;
    }

    if (candidates.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        showValidation(candidateValidation, 'Candidate already exists');
        return;
    }

    candidates.push(new Candidate(name));
    candidateInput.value = '';
    hideValidation(candidateValidation);
    updateCandidateList();
    updateNextButton();
}

function removeCandidate(index) {
    candidates.splice(index, 1);
    updateCandidateList();
    updateNextButton();
}

function updateCandidateList() {
    candidateList.innerHTML = '';

    candidates.forEach((candidate, index) => {
        const item = document.createElement('div');
        item.className = 'candidate-item';
        item.innerHTML = `
            <span class="candidate-name">${candidate.name}</span>
            <button class="remove-btn" onclick="removeCandidate(${index})">Remove</button>
        `;
        candidateList.appendChild(item);
    });
}


function updateNextButton() {
    nextToVotersBtn.disabled = candidates.length < 2;
}


function updateProgress() {
    const progress = (currentStep - 1) * 20;
    progressFill.style.width = `${progress}%`;
}


function updateStepIndicator() {
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById(`step${i}`);
        step.classList.remove('active', 'completed');

        if (i < currentStep) {
            step.classList.add('completed');
        } else if (i === currentStep) {
            step.classList.add('active');
        }
    }
}


function showSection(sectionNumber) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`section${sectionNumber}`).classList.add('active');
}


function nextStep() {
    if (currentStep < 5) {
        currentStep++;
        updateProgress();
        updateStepIndicator();
        showSection(currentStep);
    }
}


function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateProgress();
        updateStepIndicator();
        showSection(currentStep);
    }
}


function startRanking() {
    const count = parseInt(voterCountInput.value);

    if (!count || count < 1 || count > 100) {
        showValidation(voterValidation, 'Please enter a valid number of voters (1-100)');
        return;
    }

    voterCount = count;
    currentVoter = 1;
    preferences = Array(voterCount).fill().map(() => Array(candidates.length).fill(-1));
    setupRankingInterface();
    nextStep();
}


function setupRankingInterface() {
    currentVoterNumber.textContent = currentVoter;
    currentRanking = [...candidates.map((_, index) => index)];
    updateRankingDisplay();
    hideValidation(rankingValidation);
}


function updateRankingDisplay() {
    rankingList.innerHTML = '';

    currentRanking.forEach((candidateIndex, rank) => {
        const item = document.createElement('div');
        item.className = 'ranking-item';
        item.draggable = true;
        item.dataset.candidateIndex = candidateIndex;
        item.innerHTML = `
            <div class="rank-number">${rank + 1}</div>
            <div class="candidate-name-rank">${candidates[candidateIndex].name}</div>
            <div class="drag-handle">⋮⋮</div>
        `;

        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);

        rankingList.appendChild(item);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    if (draggedElement !== this) {
        const draggedIndex = parseInt(draggedElement.dataset.candidateIndex);
        const targetIndex = parseInt(this.dataset.candidateIndex);

        const draggedRank = currentRanking.indexOf(draggedIndex);
        const targetRank = currentRanking.indexOf(targetIndex);


        [currentRanking[draggedRank], currentRanking[targetRank]] = [currentRanking[targetRank], currentRanking[draggedRank]];

        updateRankingDisplay();
    }
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.ranking-item').forEach(item => {
        item.classList.remove('drag-over');
    });
    draggedElement = null;
}


function submitRanking() {
    for (let rank = 0; rank < candidates.length; rank++) {
        preferences[currentVoter - 1][rank] = currentRanking[rank];
    }

    if (currentVoter < voterCount) {
        currentVoter++;
        setupRankingInterface();
        showValidation(rankingValidation, `Ranking recorded! Voter ${currentVoter - 1} complete.`, false);

        setTimeout(() => {
            hideValidation(rankingValidation);
        }, 2000);
    } else {
        showValidation(rankingValidation, 'All rankings complete! Starting runoff...', false);
        setTimeout(() => {
            startRunoff();
            nextStep();
        }, 2000);
    }
}


function startRunoff() {
    currentRound = 1;
    roundResults = [];

    candidates.forEach(candidate => {
        candidate.votes = 0;
        candidate.eliminated = false;
    });

    runRound();
}


function runRound() {
    candidates.forEach(candidate => candidate.votes = 0);


    for (let voter = 0; voter < voterCount; voter++) {
        for (let rank = 0; rank < candidates.length; rank++) {
            const candidateIndex = preferences[voter][rank];
            if (!candidates[candidateIndex].eliminated) {
                candidates[candidateIndex].votes++;
                break;
            }
        }
    }

    const totalVotes = voterCount;
    let winner = null;

    for (let candidate of candidates) {
        if (!candidate.eliminated && candidate.votes > totalVotes / 2) {
            winner = candidate;
            break;
        }
    }

    const roundResult = {
        round: currentRound,
        candidates: candidates.map(c => ({
            name: c.name,
            votes: c.votes,
            eliminated: c.eliminated
        })),
        winner: winner,
        eliminated: []
    };

    if (!winner) {
        const minVotes = Math.min(...candidates.filter(c => !c.eliminated).map(c => c.votes));
        const toEliminate = candidates.filter(c => !c.eliminated && c.votes === minVotes);

        const remainingCount = candidates.filter(c => !c.eliminated).length;
        const minVoteCount = toEliminate.length;

        if (remainingCount === minVoteCount) {
            roundResult.tie = true;
        } else {
            toEliminate.forEach(candidate => {
                candidate.eliminated = true;
                roundResult.eliminated.push(candidate.name);
            });
        }
    }

    roundResults.push(roundResult);
    displayRound(roundResult);

    if (winner || roundResult.tie) {
        showFinalResultsBtn.style.display = 'inline-block';
    } else {
        nextRoundBtn.style.display = 'inline-block';
    }
}


function displayRound(roundResult) {
    const roundDiv = document.createElement('div');
    roundDiv.className = 'round-container';

    let headerText = `Round ${roundResult.round}`;
    if (roundResult.winner) {
        headerText += ` - Winner Found!`;
    } else if (roundResult.tie) {
        headerText += ` - Tie!`;
    }

    roundDiv.innerHTML = `
        <div class="round-header">${headerText}</div>
        <div class="round-results" id="round${roundResult.round}Results"></div>
    `;

    roundsContainer.appendChild(roundDiv);

    const resultsDiv = document.getElementById(`round${roundResult.round}Results`);

    const sortedCandidates = [...roundResult.candidates].sort((a, b) => b.votes - a.votes);

    sortedCandidates.forEach(candidate => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'candidate-result';

        if (roundResult.winner && candidate.name === roundResult.winner.name) {
            resultDiv.classList.add('active');
        } else if (candidate.eliminated) {
            resultDiv.classList.add('eliminated');
        } else {
            resultDiv.classList.add('remaining');
        }

        resultDiv.innerHTML = `
            <span class="result-name">${candidate.name}</span>
            <span class="result-votes">${candidate.votes} votes</span>
        `;

        resultsDiv.appendChild(resultDiv);
    });

    if (roundResult.eliminated.length > 0) {
        const eliminationDiv = document.createElement('div');
        eliminationDiv.className = 'elimination-notice';
        eliminationDiv.textContent = `Eliminated: ${roundResult.eliminated.join(', ')}`;
        resultsDiv.appendChild(eliminationDiv);
    }
}


function nextRound() {
    currentRound++;
    nextRoundBtn.style.display = 'none';
    runRound();
}


function showFinalResults() {
    const lastRound = roundResults[roundResults.length - 1];

    if (lastRound.winner) {
        finalResultsContainer.innerHTML = `
            <div class="winner-announcement">
                <div class="winner-title">🏆 Winner!</div>
                <div class="winner-name">${lastRound.winner.name}</div>
                <div class="winner-votes">${lastRound.winner.votes} votes (${((lastRound.winner.votes / voterCount) * 100).toFixed(1)}%)</div>
            </div>
        `;
    } else if (lastRound.tie) {
        const tiedCandidates = lastRound.candidates.filter(c => !c.eliminated);
        finalResultsContainer.innerHTML = `
            <div class="winner-announcement">
                <div class="winner-title">🤝 Tie!</div>
                <div class="winner-name">${tiedCandidates.map(c => c.name).join(' & ')}</div>
                <div class="winner-votes">Each with ${tiedCandidates[0].votes} votes</div>
            </div>
        `;
    }

    nextStep();
}


function resetElection() {
    candidates = [];
    preferences = [];
    currentStep = 1;
    voterCount = 0;
    currentVoter = 1;
    currentRanking = [];
    currentRound = 1;
    roundResults = [];

    candidateInput.value = '';
    voterCountInput.value = '';

    hideValidation(candidateValidation);
    hideValidation(voterValidation);
    hideValidation(rankingValidation);

    updateCandidateList();
    updateNextButton();
    updateProgress();
    updateStepIndicator();
    showSection(1);

    startRankingBtn.disabled = true;
    nextRoundBtn.style.display = 'none';
    showFinalResultsBtn.style.display = 'none';
    roundsContainer.innerHTML = '';
    finalResultsContainer.innerHTML = '';
}


candidateInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addCandidate();
    }
});

voterCountInput.addEventListener('input', function() {
    const count = parseInt(this.value);
    startRankingBtn.disabled = !count || count < 1 || count > 100;

    if (count && count >= 1 && count <= 100) {
        showValidation(voterValidation, `Ready for ${count} voters to rank candidates`, false);
    } else {
        hideValidation(voterValidation);
    }
});


updateProgress();
updateStepIndicator();
