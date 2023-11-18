function updatePopupStyle(popupDiv) {
    if (document.documentElement.classList.contains('light-mode')) {
        popupDiv.style.border = '1px solid #666';
        popupDiv.style.background = 'white';
        popupDiv.style.color = 'black';
    } else {
        popupDiv.style.border = '1px solid #ccc';
        popupDiv.style.background = 'black';
        popupDiv.style.color = 'white';
    }
    popupDiv.style.padding = '10px';
    popupDiv.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
    popupDiv.style.zIndex = '1000';
    popupDiv.style.maxWidth = '200px';
    popupDiv.style.wordWrap = 'break-word';
    popupDiv.style.position = 'absolute';
    popupDiv.style.display = 'none'; 
}

document.addEventListener('DOMContentLoaded', function() {
    var previewDiv = document.createElement('div');
    previewDiv.id = 'link-preview';
    updatePopupStyle(previewDiv); 
    document.body.appendChild(previewDiv);

    document.getElementById('theme-toggle').addEventListener('click', () => {
        updatePopupStyle(previewDiv);
    });

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseover', function(e) {
            var url = new URL(link.getAttribute('href'), window.location.href).href;

            if (url.startsWith(window.location.origin)) {
                if (url.includes('#')) { 
                    var anchorId = url.split('#')[1];
                    var section = document.getElementById(anchorId);
                    var infoText = section.getAttribute('data-popup-info') || 'No additional information available';
                    updatePreviewDiv(infoText, e.pageX, e.pageY);
                } else {
                    fetch(url).then(response => {
                        if (response.ok) return response.text();
                        else throw new Error('Network response was not ok.');
                    }).then(html => {
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(html, 'text/html');
                        var customInfo = doc.querySelector('.popup-info');
                        var infoText = customInfo ? customInfo.textContent : 'No additional information available';
                        updatePreviewDiv('<strong>URL:</strong><br>' + url + '<br><br><strong>Tag:</strong><br>' + infoText, e.pageX, e.pageY);
                    }).catch(error => {
                        updatePreviewDiv('<strong>URL:</strong><br>' + url + '<br><br>Preview not available', e.pageX, e.pageY);
                    });
                }
            } else {
                updatePreviewDiv('<strong>URL:</strong><br>' + url + '<br><br>Preview not available for external links', e.pageX, e.pageY);
            }
        });

        link.addEventListener('mouseout', function() {
            previewDiv.style.display = 'none';
        });
    });

    function updatePreviewDiv(content, x, y) {
        previewDiv.innerHTML = content;
        previewDiv.style.display = 'block';
        previewDiv.style.left = (x + 10) + 'px';
        previewDiv.style.top = (y + 10) + 'px';
    }
});