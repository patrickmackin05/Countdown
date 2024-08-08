document.querySelectorAll('.blur').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default link behavior
        const target = this.getAttribute('href');
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = target;
        }, 500); // Match the duration of the fade-out animation
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('fade-in');
});