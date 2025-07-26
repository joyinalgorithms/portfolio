document.querySelectorAll('.start-challenge').forEach(button => {
    button.addEventListener('click', () => {
        let challenge = button.getAttribute('data-challenge');
        alert(`Starting Challenge ${challenge}: Get ready!`);

        updateLeaderboard(challenge);
        updateRewards(challenge);
    });
});

function updateLeaderboard(challenge) {
    let leaderboardTable = document.querySelector("#leaderboard-table tbody");

    let points = {
        "1": 100,
        "2": 150,
        "3": 200,
        "4": 250
    };

    let rows = leaderboardTable.querySelectorAll("tr");
    rows.forEach(row => {
        let name = row.cells[1].textContent;
        if (name === "Alice") {
            let currentPoints = parseInt(row.cells[2].textContent);
            row.cells[2].textContent = currentPoints + points[challenge];
        }
    });
}

function updateRewards(challenge) {
    let badges = {
        "1": {
            img: "/static/images/badge-1.png",
            name: "Phishing Defender"
        },
        "2": {
            img: "/static/images/badge-2.png",
            name: "Malware Hunter"
        },
        "3": {
            img: "/static/images/badge-3.png",
            name: "Network Intrusion Expert"
        },
        "4": {
            img: "/static/images/badge-4.png",
            name: "Ransomware Rescuer"
        }
    };

    let badgeSection = document.getElementById("reward-badges");
    let badgeData = badges[challenge];

    if (!document.querySelector(`[alt="${badgeData.name}"]`)) {
        let badgeContainer = document.createElement("div");
        badgeContainer.classList.add("badge-container");

        let img = document.createElement("img");
        img.src = badgeData.img;
        img.alt = badgeData.name;
        img.classList.add("badge");

        let text = document.createElement("p");
        text.textContent = badgeData.name;

        badgeContainer.appendChild(img);
        badgeContainer.appendChild(text);
        badgeSection.appendChild(badgeContainer);
    }
}
