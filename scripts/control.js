function openUrl(url) {
    window.open(url, '_blank').focus();
}

const anilistBtn = document.getElementById('anilist-btn');
if (anilistBtn) {
    anilistBtn.addEventListener('click', function() {
        openUrl('https://www.anilist.co');
    });
}

const xBtn = document.getElementById('x-btn');
if (xBtn) {
    xBtn.addEventListener('click', function() {
        openUrl('https://x.com/i_am_in_mensa');
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


