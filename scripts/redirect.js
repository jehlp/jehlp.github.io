var url = window.location.href;
var hasExtension = url.endsWith('.html') || url.endsWith('.htm');

if (!hasExtension) {
    var newUrl = url + '.html';
    window.location.href = newUrl;
}
