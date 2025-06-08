const threatData = [{
        name: "Ransomware Attack",
        severity: "High",
        description: "A new variant of ransomware encrypts critical files and demands a hefty ransom."
    },
    {
        name: "Phishing Campaign",
        severity: "Medium",
        description: "A targeted phishing campaign is tricking users into providing personal information via fraudulent emails."
    },
    {
        name: "DDoS Attack",
        severity: "Low",
        description: "A Distributed Denial of Service (DDoS) attack is overwhelming a government website with traffic."
    },
];


const alertData = [{
        title: "Critical Patch Available",
        description: "A security vulnerability has been found in the Apache server software, and a patch has been released."
    },
    {
        title: "Suspicious Activity Detected",
        description: "Multiple failed login attempts have been detected from a foreign IP address."
    },
    {
        title: "Malware Detected",
        description: "A new strain of malware has been identified spreading through fake software updates."
    },
];


const threatList = document.getElementById('threat-list');
threatData.forEach(threat => {
    const threatItem = document.createElement('div');
    threatItem.classList.add('threat-item');
    threatItem.innerHTML = `
        <h4>${threat.name} - Severity: ${threat.severity}</h4>
        <p>${threat.description}</p>
    `;
    threatList.appendChild(threatItem);
});

const alertList = document.getElementById('alert-list');
alertData.forEach(alert => {
    const alertItem = document.createElement('li');
    alertItem.classList.add('alert-item');
    alertItem.innerHTML = `
        <h5>${alert.title}</h5>
        <p>${alert.description}</p>
    `;
    alertList.appendChild(alertItem);
});
