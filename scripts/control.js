function openUrl(url) {
    window.open(url, '_blank').focus();
}

function parseCodeBlocks(htmlElement) {
    const text = htmlElement.innerHTML;
    const replacedText = text.replace(/```([\s\S]*?)```/g, function(match, code) {
        const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<pre><code>${escapedCode}</code></pre>`;
    });
    htmlElement.innerHTML = replacedText;
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

document.addEventListener('DOMContentLoaded', (event) => {
    const contentElement = document.getElementById('markdown-content');
    parseCodeBlocks(contentElement);
});


