function loadContent() {
    const headerPlaceholder = document.getElementById('navbar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    fetch('../pages/navbar.html')
        .then(response => response.text())
        .then(headerHtml => {
            headerPlaceholder.innerHTML = headerHtml;
            toggleTheme();
        });

    fetch('../pages/footer.html')
        .then(response => response.text())
        .then(footerHtml => {
            footerPlaceholder.innerHTML = footerHtml;
        });
}

document.addEventListener('DOMContentLoaded', loadContent);