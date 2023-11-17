function parseCodeBlocks(htmlElement) {
    let text = htmlElement.innerHTML;
    let result = '';
    let inCodeBlock = false;
    let i = 0;

    while (i < text.length) {
        if (text.substring(i, i + 4) === '\\```') {
            result += '```'; 
            i += 4; 
            continue;
        }

        if (text.substring(i, i + 3) === '```') {
            inCodeBlock = !inCodeBlock;
            result += inCodeBlock ? '<pre><code>' : '</code></pre>';
            i += 3;
            continue;
        }
            
        if (inCodeBlock) {
            if (text[i] === '<') {
                result += '&lt;';
            } else if (text[i] === '>') {
                result += '&gt;';
            } else {
                result += text[i];
            }
        } else {
            result += text[i];
        }

        i++;
    }

    htmlElement.innerHTML = result;
}

document.addEventListener('DOMContentLoaded', () => {
    const contentElement = document.getElementById('markdown-content');
    if (contentElement) {
        parseCodeBlocks(contentElement);
    }
});
