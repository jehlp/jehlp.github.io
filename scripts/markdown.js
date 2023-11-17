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
    const language_constructs = [
        'var', 'let', 'const', 'function', 'return', 'if', 'else', 
        'for', 'while', 'do', 'switch', 'case', 'default', 'break', 
        'continue', 'try', 'catch', 'finally', 'throw', 'extends', 
        'import', 'export', 'from', 'as', 'class', 'super', 'this', 
        'new', 'delete', 'typeof', 'void', 'yield', 'await', 'async', 
        'in', 'instanceof', 'with', 'debugger', 'static', 'get', 'set',
        'of', 'public', 'private', 'protected', 'enum', 'implements',
        'interface', 'package', 'protected', 'static'
    ];

    const built_in_functions = [
        'alert', 'console.log', 'setTimeout', 'setInterval', 
        'clearTimeout', 'clearInterval', 'prompt', 'confirm',
        'parseInt', 'parseFloat', 'encodeURI', 'decodeURI', 
        'encodeURIComponent', 'decodeURIComponent', 'eval', 
        'split', 'substring', 'startsWith', 'join', 'replace',
        'trim', 'toUpperCase', 'toLowerCase', 'charAt', 'charCodeAt',
        'indexOf', 'lastIndexOf', 'match', 'search', 'slice',
        'concat', 'push', 'pop', 'shift', 'unshift',
        'splice', 'sort', 'reverse', 'reduce', 'reduceRight',
        'map', 'filter', 'forEach', 'every', 'some',
        'find', 'findIndex', 'includes', 'toLocaleUpperCase', 
        'toLocaleLowerCase', 'repeat', 'substr', 'valueOf',
        'toFixed', 'toExponential', 'toPrecision', 'getDate', 
        'setDate', 'getDay', 'getFullYear', 'getHours', 
        'getMilliseconds', 'getMinutes', 'getMonth', 'getSeconds', 
        'getTime', 'getTimezoneOffset', 'getUTCDate', 'getUTCDay',
        'getUTCFullYear', 'getUTCHours', 'getUTCMinutes', 
        'getUTCMonth', 'getUTCSeconds', 'setFullYear', 
        'setHours', 'setMilliseconds', 'setMinutes', 
        'setMonth', 'setSeconds', 'setTime', 'setUTCDate', 
        'setUTCFullYear', 'setUTCHours', 'setUTCMinutes', 
        'setUTCMonth', 'setUTCSeconds', 'toDateString', 
        'toISOString', 'toJSON', 'toLocaleDateString', 
        'toLocaleString', 'toLocaleTimeString', 'toTimeString', 
        'toUTCString', 'now', 'parse', 'UTC', 'isArray', 
        'from', 'of', 'copyWithin', 'fill', 'entries', 
        'keys', 'values', 'findLast', 'findLastIndex', 'length'
    ];

    const built_in_objects = [
        'Array', 'Boolean', 'Date', 'Error', 'Function', 'JSON', 'Math', 
        'Number', 'Object', 'RegExp', 'String', 'Promise', 'Map', 'Set', 
        'WeakMap', 'WeakSet', 'Symbol', 'BigInt', 'Float32Array', 'Float64Array',
        'Int8Array', 'Int16Array', 'Int32Array', 'Uint8Array', 'Uint8ClampedArray',
        'Uint16Array', 'Uint32Array', 'ArrayBuffer', 'DataView', 'SharedArrayBuffer',
        'Atomics', 'Reflect', 'Proxy', 'Generator', 'GeneratorFunction', 'AsyncFunction',
        'WebAssembly'
    ];

    const dom_related = [
        'document', 'window', 'Element', 'Node', 'innerHTML', 'textContent', 
        'getElementById', 'getElementsByClassName', 'getElementsByTagName', 
        'querySelector', 'querySelectorAll', 'addEventListener', 'removeEventListener',
        'createEvent', 'dispatchEvent', 'NodeList', 'HTMLCollection', 'CanvasRenderingContext2D',
        'WebGLRenderingContext', 'localStorage', 'sessionStorage', 'history', 'location',
        'fetch', 'XMLHttpRequest', 'screen', 'navigator', 'URL', 'Blob', 'FileReader',
        'FormData', 'AudioContext', 'MediaQueryList', 'WebSocket', 'Worker', 'ServiceWorker'
    ];

    let codeText = codeBlock.textContent; 

    codeText = codeText
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>');

    const segments = codeText.split(/(<span class="string">.*?<\/span>)/);

    const construct_regex = new RegExp(`\\b(${language_constructs.join('|')})\\b`, 'g');
    const function_regex = new RegExp(`\\b(${built_in_functions.join('|')})\\b`, 'g');
    const object_regex = new RegExp(`\\b(${built_in_objects.join('|')})\\b`, 'g');
    const dom_regex = new RegExp(`\\b(${dom_related.join('|')})\\b`, 'g');
    const value_regex = /\b(true|false|null|undefined)\b/g;
    const number_regex = /\d+/g;

    for (let i = 0; i < segments.length; i++) {
        if (!segments[i].startsWith('<span class="string">')) {
            segments[i] = segments[i]
                .replace(construct_regex, '<span class="construct">$1</span>')
                .replace(function_regex, '<span class="function">$1</span>')
                .replace(object_regex, '<span class="object">$1</span>')
                .replace(dom_regex, '<span class="dom">$1</span>')
                .replace(value_regex, '<span class="value">$1</span>')
                .replace(number_regex, '<span class="value">$&</span>');
        }
    }

    codeText = segments.join('');

    codeBlock.innerHTML = codeText;
}

document.addEventListener('DOMContentLoaded', () => {
    const contentElements = document.querySelectorAll('#markdown-content');
    contentElements.forEach((contentElement) => {
        parseCodeBlocks(contentElement);
        colorCodeBlocks(contentElement);
    });
});