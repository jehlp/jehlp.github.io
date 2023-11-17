function applyTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'light') {
        document.documentElement.classList.add('light-mode');
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.textContent = 'Dark Mode';
    }
}

function toggleTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('light-mode');
            const theme = document.documentElement.classList
                .contains('light-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        });
    }
}

applyTheme();

document.addEventListener('DOMContentLoaded', () => {
    toggleTheme();
});
