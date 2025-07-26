let candidates = [];
let currentStep = 1;
let voterCount = 0;
let currentVoter = 1;
let selectedCandidate = null;

const candidateInput = document.getElementById('candidateInput');
const candidateValidation = document.getElementById('candidateValidation');
const candidateList = document.getElementById('candidateList');
const nextToVotersBtn = document.getElementById('nextToVotersBtn');
const voterCountInput = document.getElementById('voterCountInput');
const voterValidation = document.getElementById('voterValidation');
const startVotingBtn = document.getElementById('startVotingBtn');
const currentVoterNumber = document.getElementById('currentVoterNumber');
const votingOptions = document.getElementById('votingOptions');
const voteValidation = document.getElementById('voteValidation');
const submitVoteBtn = document.getElementById('submitVoteBtn');
const resultsGrid = document.getElementById('resultsGrid');
const progressFill = document.getElementById('progressFill');

class Candidate {
    constructor(name) {
        this.name = name;
        this.votes = 0;
    }
}

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
            <div>
                <span class="candidate-votes">${candidate.votes} votes</span>
                <button class="remove-btn" onclick="removeCandidate(${index})">Remove</button>
            </div>
        `;
        candidateList.appendChild(item);
    });
}

function updateNextButton() {
    nextToVotersBtn.disabled = candidates.length < 2;
}

function updateProgress() {
    const progress = (currentStep - 1) * 25;
    progressFill.style.width = `${progress}%`;
}

function updateStepIndicator() {
    for (let i = 1; i <= 4; i++) {
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
    if (currentStep < 4) {
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

function startVoting() {
    const count = parseInt(voterCountInput.value);

    if (!count || count < 1) {
        showValidation(voterValidation, 'Please enter a valid number of voters');
        return;
    }

    voterCount = count;
    currentVoter = 1;
    setupVotingInterface();
    nextStep();
}

function setupVotingInterface() {
    currentVoterNumber.textContent = currentVoter;

    votingOptions.innerHTML = '';
    candidates.forEach((candidate, index) => {
        const option = document.createElement('div');
        option.className = 'vote-option';
        option.textContent = candidate.name;
        option.onclick = () => selectCandidate(index);
        votingOptions.appendChild(option);
    });

    selectedCandidate = null;
    submitVoteBtn.disabled = true;
    hideValidation(voteValidation);
}

function selectCandidate(index) {
    document.querySelectorAll('.vote-option').forEach(option => {
        option.classList.remove('selected');
    });

    document.querySelectorAll('.vote-option')[index].classList.add('selected');
    selectedCandidate = index;
    submitVoteBtn.disabled = false;
    hideValidation(voteValidation);
}

function submitVote() {
    if (selectedCandidate === null) {
        showValidation(voteValidation, 'Please select a candidate');
        return;
    }

    candidates[selectedCandidate].votes++;
    updateCandidateList();

    if (currentVoter < voterCount) {
        currentVoter++;
        setupVotingInterface();
        showValidation(voteValidation, 'Vote recorded successfully!', false);

        setTimeout(() => {
            hideValidation(voteValidation);
        }, 2000);
    } else {

        showResults();
        nextStep();
    }
}

function showResults() {
    const maxVotes = Math.max(...candidates.map(c => c.votes));
    const winners = candidates.filter(c => c.votes === maxVotes);

    resultsGrid.innerHTML = '';

    const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

    sortedCandidates.forEach(candidate => {
        const item = document.createElement('div');
        item.className = 'result-item';

        if (candidate.votes === maxVotes) {
            item.classList.add('winner');
        }

        item.innerHTML = `
            <span class="result-name">
                ${candidate.name}
                ${candidate.votes === maxVotes ? '<span class="winner-crown">👑</span>' : ''}
            </span>
            <span class="result-votes">${candidate.votes} votes</span>
        `;

        resultsGrid.appendChild(item);
    });
}

function resetElection() {
    candidates = [];
    currentStep = 1;
    voterCount = 0;
    currentVoter = 1;
    selectedCandidate = null;

    candidateInput.value = '';
    voterCountInput.value = '';

    hideValidation(candidateValidation);
    hideValidation(voterValidation);
    hideValidation(voteValidation);

    updateCandidateList();
    updateNextButton();
    updateProgress();
    updateStepIndicator();
    showSection(1);

    startVotingBtn.disabled = true;
}

candidateInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addCandidate();
    }
});

voterCountInput.addEventListener('input', function() {
    const count = parseInt(this.value);
    startVotingBtn.disabled = !count || count < 1;

    if (count && count >= 1) {
        showValidation(voterValidation, `Ready for ${count} voters`, false);
    } else {
        hideValidation(voterValidation);
    }
});

updateProgress();
updateStepIndicator();
