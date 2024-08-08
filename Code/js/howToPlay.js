const howToPlayLink = document.getElementById('howToPlayLink');
const howToPlayPopup = document.getElementById('howToPlayPopup');
const howToPlayClose = howToPlayPopup.querySelector('.close');

howToPlayLink.addEventListener('click', () => {
    howToPlayPopup.style.display = 'block';
});

howToPlayClose.addEventListener('click', () => {
    howToPlayPopup.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === howToPlayPopup) {
        howToPlayPopup.style.display = 'none';
    }
});
