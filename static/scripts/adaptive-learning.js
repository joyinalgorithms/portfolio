let progress = 0;
let currentLevel = "Beginner";

function startSimulation() {
    alert("Phishing Attack Simulation started. Analyze the emails and identify the threat.");
    updateProgress();
}

function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progressStatus = document.getElementById('progress-status');
    const nextLevelDescription = document.getElementById('next-level-description');

    let interval = setInterval(() => {
        progress += 10;
        progressBar.value = progress;
        progressStatus.innerText = `Current challenge completion: ${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            progressStatus.innerText = "Challenge Completed!";
            updateLevel();
        }
    }, 1000);
}

function updateLevel() {
    if (currentLevel === "Beginner") {
        currentLevel = "Intermediate";
        document.getElementById('current-level').innerText = `Your current level: Intermediate`;
        document.getElementById('next-level-description').innerText = "Next challenge will test your skills in malware analysis.";
    } else if (currentLevel === "Intermediate") {
        currentLevel = "Advanced";
        document.getElementById('current-level').innerText = `Your current level: Advanced`;
        document.getElementById('next-level-description').innerText = "Next challenge will test your skills in penetration testing.";
    } else {
        alert("You have reached the highest level! Keep up the great work.");
    }
}
