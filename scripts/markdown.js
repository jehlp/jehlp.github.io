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

function colorCodeBlocks(htmlElement) {
    const codeBlocks = htmlElement.getElementsByTagName('code');
    for (let code of codeBlocks) {
        const words = code.textContent.trim().split(/\s+/);
        const firstWord = words[0];

        switch (firstWord) {
            case 'javascript':
                code.textContent = code.textContent.replace(firstWord, '').trim();
                colorCodeBlocksJS(code);
                break;
            default:
                break;
        }
    }
}

function colorCodeBlocksJS(codeBlock) {
    const js_keywords = [
        'var', 
        'let', 
        'const', 
        'function', 
        'return', 
        'if', 
        'else', 
        'replace', 
        'substring', 
        'continue',
        'startsWith',
        'RegExp',
        'split',
        'length',
        'break',
        'trim',
        'for',
        'join',
        'switch',
        'case',
        'default',
        'new'
    ];

    let codeText = codeBlock.textContent; 

    codeText = codeText
        .replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>');

    const segments = codeText.split(/(<span class="string">.*?<\/span>)/);
    const segment_regex = new RegExp(`\\b(${js_keywords.join('|')})\\b`, 'g');

    for (let i = 0; i < segments.length; i++) {
        if (!segments[i].startsWith('<span class="string">')) {
            segments[i] = segments[i]
                .replace(segment_regex, '<span class="keyword">$1</span>');
        }
    }

    codeText = segments.join('');

    codeText = codeText
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="constant">$1</span>')
        .replace(/\d+/g, '<span class="constant">$&</span>');

    codeBlock.innerHTML = codeText;
}

document.addEventListener('DOMContentLoaded', () => {
    const contentElements = document.querySelectorAll('#markdown-content');
    contentElements.forEach((contentElement) => {
        parseCodeBlocks(contentElement);
        colorCodeBlocks(contentElement);
    });
});