const leaderboardLink = document.getElementById('leaderboardLink');
const leaderboardPopup = document.getElementById('leaderboardPopup');
const leaderboardClose = leaderboardPopup.querySelector('.close');
const leaderboardList = document.getElementById('leaderboardList');

leaderboardLink.addEventListener('click', async () => {
    leaderboardPopup.style.display = 'block';
    const response = await fetch('./json/leaderboard.json');
    const data = await response.json();
    leaderboardList.innerHTML = data.map(entry => `<div>${entry.name}: ${entry.score} points</div>`).join('');
});

leaderboardClose.addEventListener('click', () => {
    leaderboardPopup.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === leaderboardPopup) {
        leaderboardPopup.style.display = 'none';
    }
});