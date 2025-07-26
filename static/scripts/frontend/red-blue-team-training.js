document.addEventListener("DOMContentLoaded", function() {
    const attackAlert = document.getElementById("attack-alert");
    const attackDescription = document.getElementById("attack-description");
    const attackTimer = document.getElementById("attack-timer");
    const defendButton = document.getElementById("defend-btn");
    const logList = document.getElementById("log-list");

    const attackScenarios = [
        "Phishing Email Detected",
        "DDoS Attack Incoming",
        "Malware Execution Attempt",
        "Unauthorized Network Access",
        "SQL Injection Attack in Progress"
    ];

    function generateRandomAttack() {
        attackAlert.classList.remove("hidden");
        let randomAttack = attackScenarios[Math.floor(Math.random() * attackScenarios.length)];
        attackDescription.innerText = randomAttack;

        let countdown = 10;
        attackTimer.innerText = countdown;

        let interval = setInterval(() => {
            countdown--;
            attackTimer.innerText = countdown;
            if (countdown <= 0) {
                clearInterval(interval);
                attackAlert.classList.add("hidden");
                logList.innerHTML += `<li>⚠️ Attack succeeded: ${randomAttack}</li>`;
            }
        }, 1000);

        defendButton.onclick = function() {
            clearInterval(interval);
            attackAlert.classList.add("hidden");
            logList.innerHTML += `<li>✅ Attack prevented: ${randomAttack}</li>`;
        };
    }

    setInterval(generateRandomAttack, 15000);
});
