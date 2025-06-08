document.getElementById('ransomware-btn').addEventListener('click', function() {
    startSimulation('Ransomware');
});

document.getElementById('phishing-btn').addEventListener('click', function() {
    startSimulation('Phishing');
});

document.getElementById('ddos-btn').addEventListener('click', function() {
    startSimulation('DDoS');
});

document.getElementById('contain-btn').addEventListener('click', function() {
    handleResponse('contain');
});

document.getElementById('neutralize-btn').addEventListener('click', function() {
    handleResponse('neutralize');
});

function startSimulation(attackType) {
    document.getElementById('status-message').innerHTML = `Simulating ${attackType} attack...`;
    document.getElementById('attack-details').innerHTML = `A cyberattack of type <strong>${attackType}</strong> is happening. Your system is under attack.`;

    document.getElementById('response-options').style.display = 'block';
}

function handleResponse(action) {
    if (action === 'contain') {
        document.getElementById('status-message').innerHTML = "You attempted to contain the attack. Let's see if it worked.";
    } else if (action === 'neutralize') {
        document.getElementById('status-message').innerHTML = "You attempted to neutralize the attack. Let's see if it was successful.";
    }

    simulateOutcome();
}

function simulateOutcome() {
    let success = Math.random() > 0.5;

    if (success) {
        document.getElementById('status-message').innerHTML += " Success! You have mitigated the attack.";
    } else {
        document.getElementById('status-message').innerHTML += " Failure! The attack has escalated.";
    }
}
