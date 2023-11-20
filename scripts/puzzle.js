import { CAVE, NURIKABE, KUROTTO, TAPA, CANALVIEW, SIMPLELOOP } from '../scripts/const/puzzles_raw.js'

const GENRES = [CAVE, NURIKABE, KUROTTO, TAPA, CANALVIEW, SIMPLELOOP]

function isAdjacent(cell1, cell2) {
    const row1 = parseInt(cell1.getAttribute('data-row'), 10);
    const col1 = parseInt(cell1.getAttribute('data-col'), 10);
    const row2 = parseInt(cell2.getAttribute('data-row'), 10);
    const col2 = parseInt(cell2.getAttribute('data-col'), 10);

    return (Math.abs(row1 - row2) === 1 && col1 === col2) || 
           (Math.abs(col1 - col2) === 1 && row1 === row2);
}

function checkForEmptyCells(currentState) {
    for (let i = 0; i < currentState.length; i++) {
        for (let j = 0; j < currentState[i].length; j++) {
            if (currentState[i][j] === 'empty') {
                return false;
            }
        }
    }
    return true;
}

function dfs(row, col, visited, grid, cellType) {
    if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length 
        || visited[row][col] 
        || (cellType === 'unshaded' && !(grid[row][col] === 'unshaded' 
        || !isNaN(grid[row][col]))) 
        || (cellType === 'shaded' && grid[row][col] !== 'shaded')) {
        return 0;
    }

    visited[row][col] = true;
    let count = 1;

    const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dx, dy] of offsets) {
        count += dfs(row + dx, col + dy, visited, grid, cellType);
    }

    return count;
}

function checkVisibility(row, col, grid, countShaded, includeSelf) {
    let visibleCount = includeSelf ? 1 : 0; 
    const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    for (const [dx, dy] of offsets) {
        visibleCount += countVisible(row, col, dx, dy, grid, countShaded);
    }

    return visibleCount === grid[row][col];
}

function countVisible(row, col, dx, dy, grid, countShaded) {
    let count = 0;
    row += dx;
    col += dy;
    while (row >= 0 && col >= 0 && row < grid.length && col < grid[0].length) {
        if (countShaded && grid[row][col] === 'shaded') {
            count++;
        } else if (!countShaded && grid[row][col] !== 'shaded') {
            count++;
        } else {
            break;
        }
        row += dx;
        col += dy;
    }
    return count;
}

function twoByTwoShaded(currentState) {
    for (let i = 0; i < currentState.length - 1; i++) {
        for (let j = 0; j < currentState[0].length - 1; j++) {
            if (currentState[i][j] === 'shaded' &&
                currentState[i + 1][j] === 'shaded' &&
                currentState[i][j + 1] === 'shaded' &&
                currentState[i + 1][j + 1] === 'shaded') {
                return false;
            }
        }
    }
    return true;
}

function getTotalShadedCells(currentState) {
    let shadedCellsCount = 0;
    for (let i = 0; i < currentState.length; i++) {
        for (let j = 0; j < currentState[0].length; j++) {
            if (currentState[i][j] === 'shaded') {
                shadedCellsCount++;
            }
        }
    }
    return shadedCellsCount;
}

function dfsIslands(row, col, visited, grid) {
    if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length 
        || visited[row][col] 
        || grid[row][col] === 'shaded') {
        return { count: 0, numbers: 0, firstNumber: null };
    }

    visited[row][col] = true;
    let count = 1;
    let numbers = 0;
    let firstNumber = null;

    if (!isNaN(grid[row][col])) {
        numbers = 1;
        firstNumber = grid[row][col];
    }

    const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dx, dy] of offsets) {
        const result = dfsIslands(row + dx, col + dy, visited, grid);
        count += result.count;
        numbers += result.numbers;
        firstNumber = firstNumber === null ? result.firstNumber : firstNumber;
    }

    return { count, numbers, firstNumber };
}

function validateTapaNumbers(row, col, grid) {
    let cellValue = grid[row][col];
    if (typeof cellValue === 'string') {
        cellValue = JSON.parse(cellValue);
    }

    const clueNumbers = Array.isArray(cellValue) ? cellValue : [cellValue];
    const offsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, 1], 
        [1, 1], [1, 0], [1, -1], 
        [0, -1]
    ];

    let pattern = '';
    for (const [dx, dy] of offsets) {
        const newX = row + dx;
        const newY = col + dy;
        if (newX >= 0 && newY >= 0 && newX < grid.length && newY < grid[0].length) {
            pattern += (grid[newX][newY] === 'shaded') ? '1' : '0';
        } else {
            pattern += '0';
        }
    }
        
    return matchPatternToTapaClue(pattern, clueNumbers);
}


function matchPatternToTapaClue(pattern, clueNumbers) {
    clueNumbers.sort((a, b) => a - b);

    if (pattern.startsWith('1') && pattern.endsWith('1')) {
        let splitIndex = pattern.indexOf('0');
        if (splitIndex !== -1) {
            pattern = pattern.slice(splitIndex) + pattern.slice(0, splitIndex);
        }
    }
    
    const shadedBlocks = pattern.split('0').filter(block => block !== '');

    if (shadedBlocks.length !== clueNumbers.length) {
        return false;
    }

    shadedBlocks.sort((a, b) => a.length - b.length);

    for (let i = 0; i < shadedBlocks.length; i++) {
        if (shadedBlocks[i].length !== clueNumbers[i]) {
            return false;
        }
    }

    return true;
}

function countConnections(horizontalConnections, verticalConnections, row, col) {
    let count = 0;

    if (col > 0 && horizontalConnections[row][col - 1]) count++;
    if (col < horizontalConnections[row].length && horizontalConnections[row][col]) count++;

    if (row > 0 && verticalConnections[row - 1][col]) count++;
    if (row < verticalConnections.length && verticalConnections[row][col]) count++;

    return count;
}

function isBlockedCell(row, col) {
    let cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    return cell && cell.classList.contains('blocked');
}

document.addEventListener('DOMContentLoaded', function() {
    let isSolved = false;

    const grid = document.getElementById('puzzle-grid');
    let canvas = null; 
    let ctx = null;
    let isDragging = false;
    let startCell = null;
    let horizontalConnections = null;
    let verticalConnections = null;
    let allowShading = false;
    let allowLineDrawing = false;
    let lastInteractionTime = 0;

    const rules = document.createElement('div');
    rules.id = 'rules';
    rules.style.margin = '0 auto';
    rules.style.marginBottom = '20px';
    rules.style.maxWidth = '40%';
    rules.style.textAlign = 'center'; 
    rules.style.fontStyle = 'italic'; 
    grid.parentNode.insertBefore(rules, grid)

    const successMessage = document.createElement('div'); 
    successMessage.id = 'success-message'; 
    grid.parentNode.insertBefore(successMessage, grid.nextSibling); 

    let lastGenreIndex = localStorage.getItem('lastGenreIndex');
    if (lastGenreIndex !== null) {
        lastGenreIndex = parseInt(lastGenreIndex, 10);
    }
    
    let genreIndex;

    if (lastGenreIndex !== null && GENRES.length > 1) {
        do {
            genreIndex = Math.floor(Math.random() * GENRES.length);
        } while (genreIndex === lastGenreIndex);
    } else {
        genreIndex = Math.floor(Math.random() * GENRES.length);
    }

    let myGenre = GENRES[genreIndex];
    let myPuzzle = myGenre[Math.floor(Math.random() * myGenre.length)];

    localStorage.setItem('lastGenreIndex', genreIndex);

    switch (myGenre) {
        case NURIKABE:
            rules.textContent = 'Nurikabe: Shade some cells such that all shaded cells are connected, and no 2x2 area is entirely shaded. Moreover, every unshaded area contains exactly one number, and that number indicates the size of the unshaded area it belongs to.'
            allowShading = true; allowLineDrawing = false;
            break;
        case CAVE:
            rules.textContent = 'Cave: Shade some cells such that all unshaded cells are connected, and all groups of shaded cells are connected to an edge of the grid. A number in a cell indicates the number of unshaded cells you can see from that position, where shaded cells block the view.'
            allowShading = true; allowLineDrawing = false;
            break;
        case KUROTTO:
            rules.textContent = 'Kurotto: Shade some cells such that each number equals the total count of shaded cells in connected groups sharing an edge with that number.'
            allowShading = true; allowLineDrawing = false;
            break;
        case TAPA:
            rules.textContent = 'Tapa: Shade some cells such that all shaded cells are connected, and no 2x2 area is entirely shaded. Numbers in a cell indicate the length of consecutive shaded blocks in the surrounding (up to) 8 cells. If there is more than one number in a cell, then there must be at least one unshaded cell between the shaded cell groups.'
            allowShading = true; allowLineDrawing = false;
            break;
        case CANALVIEW:
            rules.textContent = 'Canal View: Shade some cells such that all shaded cells are connected, and no 2x2 area is entirely shaded. A number in a cell indicates the total number of shaded cells connected vertically and horizontally to that cell.'
            allowShading = true; allowLineDrawing = false;
            break;
        case SIMPLELOOP:
            rules.textContent = 'Simple Loop: Draw a loop that passes through the center of every cell exactly once.'
            allowShading = false; allowLineDrawing = true;
            break;
        default:
            break;
    }

    function initializeConnections(rows, cols) {
        horizontalConnections = Array.from({ length: rows }, () => Array(cols - 1).fill(false));
        verticalConnections = Array.from({ length: rows - 1 }, () => Array(cols).fill(false));
    }

    function toggleConnection(startRow, startCol, endRow, endCol) {
        if (startRow === endRow) {
            horizontalConnections[startRow][Math.min(startCol, endCol)] = !horizontalConnections[startRow][Math.min(startCol, endCol)];
        } else {
            verticalConnections[Math.min(startRow, endRow)][startCol] = !verticalConnections[Math.min(startRow, endRow)][startCol];
        }
        validatePuzzle()
    }

    function validateNurikabe(currentState) {
        const rows = currentState.length;
        const cols = currentState[0].length;
        
        if (!checkForEmptyCells(currentState)) {
            return false;
        }
        if (!twoByTwoShaded(currentState)) {
            return false;
        }
    
        let visitedShaded = new Array(rows).fill(0).map(() => new Array(cols).fill(false));
        let visitedUnshaded = new Array(rows).fill(0).map(() => new Array(cols).fill(false));
        let shadedCellsCount = getTotalShadedCells(currentState);
        let connectedShadedCellsCount = 0;
        let unshadedGroupValid = true;
    
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (currentState[i][j] === 'shaded' && !visitedShaded[i][j]) {
                    connectedShadedCellsCount = dfs(i, j, visitedShaded, currentState, 'shaded');
                }
    
                if ((currentState[i][j] === 'unshaded' || !isNaN(currentState[i][j])) && !visitedUnshaded[i][j]) {
                    const unshadedInfo = dfsIslands(i, j, visitedUnshaded, currentState);
                    if (unshadedInfo.numbers !== 1 || unshadedInfo.count !== unshadedInfo.firstNumber) {
                        unshadedGroupValid = false;
                        break;
                    }
                }
            }
            if (!unshadedGroupValid) break;
        }
        
        if (shadedCellsCount !== connectedShadedCellsCount || !unshadedGroupValid) {
            return false
        }

        successMessage.textContent = 'Solved!';
        isSolved = true;
        return true;
    }

    function validateCave(currentState) {
        const rows = currentState.length;
        const cols = currentState[0].length;
    
        if (!checkForEmptyCells(currentState)) {
            return false;
        }

        let visitedUnshaded = new Array(rows).fill(0).map(() => new Array(cols).fill(false));
        let visitedShaded = new Array(rows).fill(0).map(() => new Array(cols).fill(false));
        let unshadedConnected = false;
    
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if ((i === 0 || j === 0 || i === rows - 1 || j === cols - 1) && currentState[i][j] === 'shaded' && !visitedShaded[i][j]) {
                    dfs(i, j, visitedShaded, currentState, 'shaded');
                }
            }
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if ((currentState[i][j] === 'unshaded' || !isNaN(currentState[i][j])) && !visitedUnshaded[i][j]) {
                    if (!unshadedConnected) {
                        dfs(i, j, visitedUnshaded, currentState, 'unshaded');
                        unshadedConnected = true;
                    } else {
                        return false;
                    }
                }
      
                if (currentState[i][j] === 'shaded' && !visitedShaded[i][j]) {
                    return false; 
                }
    
                if (!isNaN(currentState[i][j])) {
                    if (!checkVisibility(i, j, currentState, false, true)) {
                        return false;
                    } 
                }
            }
        }
    
        successMessage.textContent = 'Solved!';
        isSolved = true
        return isSolved;
    }

    function validateKurotto(currentState) {
        const rows = currentState.length;
        const cols = currentState[0].length;

        if (!checkForEmptyCells(currentState)) {
            return false;
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (!isNaN(currentState[i][j])) {
                    const numberCell = currentState[i][j];
                    let totalShadedCount = 0;
                    let visitedShaded = new Array(rows).fill(0).map(() => new Array(cols).fill(false));
                    const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    
                    for (const [dx, dy] of offsets) {
                        const newX = i + dx;
                        const newY = j + dy;
    
                        if (newX >= 0 && newX < rows && newY >= 0 && newY < cols 
                            && currentState[newX][newY] === 'shaded' 
                            && !visitedShaded[newX][newY]) {
                            totalShadedCount += dfs(newX, newY, visitedShaded, currentState, 'shaded');
                        }
                    }
    
                    if (totalShadedCount !== numberCell) {
                        return false;
                    }
                }
            }
        }
    
        successMessage.textContent = 'Solved!';
        isSolved = true;
        return true;
    }

    function validateTapa(currentState) {
        const rows = currentState.length;
        const cols = currentState[0].length;

        if (!checkForEmptyCells(currentState)) {
            return false;
        }

        if (!twoByTwoShaded(currentState)) {
            return false;
        }

        let visitedShaded = new Array(rows).fill(0).map(() => new Array(cols).fill(false));
        let connectedShadedCellsCount = 0;
        let shadedCellsCount = getTotalShadedCells(currentState);
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (currentState[i][j] === 'shaded' && !visitedShaded[i][j]) {
                    if (connectedShadedCellsCount === 0) {
                        connectedShadedCellsCount = dfs(i, j, visitedShaded, currentState, 'shaded');
                    } else {
                        return false;
                    }
                }

                if (!isNaN(currentState[i][j]) || Array.isArray(currentState[i][j])) {
                    if (!validateTapaNumbers(i, j, currentState)) {
                        return false;
                    }
                }
            }
        }

        if (shadedCellsCount !== connectedShadedCellsCount) {
            return false;
        }

        successMessage.textContent = 'Solved!';
        isSolved = true;
        return true;
    }

    function validateCanalView(currentState) {
        const rows = currentState.length;
        const cols = currentState[0].length;

        if (!checkForEmptyCells(currentState)) {
            return false;
        }

        if (!twoByTwoShaded(currentState)) {
            return false;
        }

        let visitedShaded = new Array(rows).fill(0).map(() => new Array(cols).fill(false));
        let connectedShadedCellsCount = 0;
        let shadedCellsCount = getTotalShadedCells(currentState);
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (currentState[i][j] === 'shaded' && !visitedShaded[i][j]) {
                    if (connectedShadedCellsCount === 0) {
                        connectedShadedCellsCount = dfs(i, j, visitedShaded, currentState, 'shaded');
                    } else {
                        return false;
                    }
                }

                if (!isNaN(currentState[i][j])) {
                    if (!checkVisibility(i, j, currentState, true, false)) {
                        return false;
                    } 
                }
            }
        }

        if (shadedCellsCount !== connectedShadedCellsCount) {
            return false;
        }

        successMessage.textContent = 'Solved!';
        isSolved = true;
        return true;
    }

    function validateSimpleLoop() {
        let rows = verticalConnections.length + 1; 
        let cols = horizontalConnections[0].length + 1; 

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (!isBlockedCell(row, col)) {
                    let connectionCount = countConnections(horizontalConnections, verticalConnections, row, col);
                    if (connectionCount !== 2) {
                        return false;
                    }
                }
            }
        }
    
        successMessage.textContent = 'Solved!';
        isSolved = true;
        return true;
    }

    function setGridStyle(rows, cols) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const maxSize = Math.min(screenWidth, screenHeight) * 0.5; 
        const gridDimension = Math.min(rows, cols);
        const W = Math.floor(maxSize / gridDimension); 
        
        grid.style.gridTemplateColumns = `repeat(${cols}, ${W}px)`;
        grid.style.gridTemplateRows = `repeat(${rows}, ${W}px)`;
        
        const cells = grid.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.style.width = `${W}px`;
            cell.style.height = `${W}px`;
            cell.style.fontSize = `${W / 1.5}px`;
    
            if (cell.classList.contains('number-cell-array')) {
                cell.style.fontSize = `${W / 2.2}px`; 
            }
        });
    }

    function getCurrentGridState() {
        const state = [];
        for (const row of grid.children) {
            if (row.nodeName === 'CANVAS') {
                continue;
            }
            const rowState = [];
            for (const cell of row.children) {
                if (cell.classList.contains('number-cell-array')) {
                    const numbers = JSON.parse(cell.dataset.numbers);
                    rowState.push(numbers);
                } else if (cell.classList.contains('number-cell')) {
                    const number = parseInt(cell.textContent, 10);
                    rowState.push(number);
                } else if (cell.classList.contains('shaded')) {
                    rowState.push('shaded');
                } else if (cell.classList.contains('unshaded-cell')) {
                    rowState.push('unshaded');
                } else {
                    rowState.push('empty');
                }
            }
            state.push(rowState);
        }
        return state;
    }    
    
    function createCell(value, rowIndex, colIndex) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.setAttribute('data-row', rowIndex);
        cell.setAttribute('data-col', colIndex);
    
        if (Array.isArray(value)) {
            cell.dataset.numbers = JSON.stringify(value);
    
            cell.textContent = '';
            cell.classList.add('number-cell-array');
    
            if (value.length === 2) {
                placeNumberInCell(cell, value[0], 'top-left');
                placeNumberInCell(cell, value[1], 'bottom-right');
            } else if (value.length === 3) {
                placeNumberInCell(cell, value[0], 'top-middle');
                placeNumberInCell(cell, value[1], 'bottom-left');
                placeNumberInCell(cell, value[2], 'bottom-right');
            } else if (value.length === 4) {
                placeNumberInCell(cell, value[0], 'middle-left');
                placeNumberInCell(cell, value[1], 'middle-top');
                placeNumberInCell(cell, value[2], 'middle-right');
                placeNumberInCell(cell, value[3], 'middle-bottom');
            }
        } else if (value === 'b') {
            cell.classList.add('blocked')
        } else if (value === 'e') {
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick);
        } else {
            cell.textContent = value;
            cell.classList.add('number-cell');
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick);
        }

        cell.addEventListener('mousedown', handleMouseDown);
        cell.addEventListener('touchstart', handleMouseDown);

        function handleMouseDown(event) {
            if (!allowLineDrawing || isSolved) return;
            
            event.preventDefault();
            isDragging = true;
            startCell = cell;
        }

        cell.addEventListener('mouseenter', handleMouseEnter);
        cell.addEventListener('touchmove', handleMouseEnter);

        function handleMouseEnter(event) {
            if (!isDragging || isSolved) return;

            let targetCell = event.type === 'touchmove' ? document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY) : this;
            
            if (isAdjacent(startCell, targetCell)) {
                const startRow = parseInt(startCell.getAttribute('data-row'), 10);
                const startCol = parseInt(startCell.getAttribute('data-col'), 10);
                const endRow = parseInt(targetCell.getAttribute('data-row'), 10);
                const endCol = parseInt(targetCell.getAttribute('data-col'), 10);

                toggleConnection(startRow, startCol, endRow, endCol);
                redrawAllLines();

                startCell = targetCell; 
            }
        }

        grid.addEventListener('mouseup', handleMouseUp);
        grid.addEventListener('touchend', handleMouseUp);

        function handleMouseUp() {
            if (isSolved) return;

            isDragging = false;
            startCell = null;
        }       
    
        return cell;
    }

    function placeNumberInCell(cell, number, position) {
        const numberDiv = document.createElement('div');
        numberDiv.textContent = number;
        numberDiv.classList.add(`number-${position}`);
        cell.appendChild(numberDiv);
    }

    function toggleCellState(cell, isRightClick = false) {
        if (!allowShading) return;
    
        if (cell.classList.contains('number-cell') || cell.classList.contains('number-cell-array')) {
            if (cell.style.backgroundColor === 'lime') {
                cell.style.backgroundColor = ''; 
            } else {
                cell.style.backgroundColor = 'lime'; 
            }
        } else {
            if (isRightClick) {
                if (cell.classList.contains('unshaded-cell')) {
                    cell.classList.remove('unshaded-cell');
                    cell.classList.add('shaded');
                } else if (cell.classList.contains('shaded')) {
                    cell.classList.remove('shaded');
                } else {
                    cell.classList.add('unshaded-cell');
                }
            } else {
                if (cell.classList.contains('shaded')) {
                    cell.classList.remove('shaded');
                    cell.classList.add('unshaded-cell');
                } else if (cell.classList.contains('unshaded-cell')) {
                    cell.classList.remove('unshaded-cell');
                } else {
                    cell.classList.add('shaded');
                }
            }
        }
    }
    
    function handleCellClick() {
        if (Date.now() - lastInteractionTime < 100) return; 
        lastInteractionTime = Date.now();
    
        if (isSolved) return;
        toggleCellState(this);
        validatePuzzle();
    }
    
    function handleCellRightClick(event) {
        event.preventDefault();
        if (Date.now() - lastInteractionTime < 100) return; 
        lastInteractionTime = Date.now();
    
        if (isSolved) return;
        toggleCellState(this, true);
        validatePuzzle();
    }
    
    function validatePuzzle() {
        const currentState = getCurrentGridState();
        switch (myGenre) {
            case NURIKABE:
                validateNurikabe(currentState);
                break;
            case CAVE:
                validateCave(currentState);
                break;
            case KUROTTO:
                validateKurotto(currentState);
                break;
            case TAPA:
                validateTapa(currentState);
                break;
            case CANALVIEW:
                validateCanalView(currentState);
                break;
            case SIMPLELOOP:
                validateSimpleLoop();
                break;
            default:
                break;
        }
        if (isSolved) {
            cleanUp();
        }
    }

    function cleanUp() {
        const numberCells = document.querySelectorAll('.number-cell, .number-cell-array');
        const allCells = document.querySelectorAll('.grid-cell');

        numberCells.forEach(cell => {
            cell.style.backgroundColor = 'lime';
        });
        allCells.forEach(cell => {
            cell.style.border = '0px';
        });
    }

    function createCanvas(rows, cols) {
        canvas = document.createElement('canvas');
        canvas.id = 'line-canvas';
        canvas.style.zIndex = '10'; 
        canvas.style.position = 'absolute'; 
        canvas.style.pointerEvents = 'none';
        grid.appendChild(canvas);
        ctx = canvas.getContext('2d');

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const maxSize = Math.min(screenWidth, screenHeight) * 0.5; 
        const gridDimension = Math.min(rows, cols);
        const W = Math.floor(maxSize / gridDimension); 
    
        canvas.width = cols * W;
        canvas.height = rows * W; 

        updateCanvasSize(rows, cols);
    } 

    function updateCanvasSize(rows, cols) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const maxSize = Math.min(screenWidth, screenHeight) * 0.5;
        const gridDimension = Math.min(rows, cols);
        const W = Math.floor(maxSize / gridDimension);
    
        canvas.width = cols * W;
        canvas.height = rows * W;
    
        redrawAllLines();
    }

    function drawSingleLine(startCell, endCell) {
        if (startCell.classList.contains('blocked') || endCell.classList.contains('blocked')) {
            return;
        }
    
        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
    
        const startX = startRect.left - canvasRect.left + startRect.width / 2;
        const startY = startRect.top - canvasRect.top + startRect.height / 2;
        const endX = endRect.left - canvasRect.left + endRect.width / 2;
        const endY = endRect.top - canvasRect.top + endRect.height / 2;
    
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#006400'; 
        ctx.lineWidth = 4;
        ctx.stroke();
    }    

    function redrawAllLines() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        for (let i = 0; i < horizontalConnections.length; i++) {
            for (let j = 0; j < horizontalConnections[i].length; j++) {
                if (horizontalConnections[i][j]) {
                    const startCell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                    const endCell = document.querySelector(`[data-row="${i}"][data-col="${j + 1}"]`);
                    drawSingleLine(startCell, endCell);
                }
            }
        }
    
        for (let i = 0; i < verticalConnections.length; i++) {
            for (let j = 0; j < verticalConnections[i].length; j++) {
                if (verticalConnections[i][j]) {
                    const startCell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                    const endCell = document.querySelector(`[data-row="${i + 1}"][data-col="${j}"]`);
                    drawSingleLine(startCell, endCell);
                }
            }
        }
    }    

    function createGrid(puzzle) {
        const rows = puzzle.length;
        const cols = puzzle[0].length;
        grid.innerHTML = '';

        initializeConnections(rows, cols);
        createCanvas(rows, cols);
    
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.classList.add('grid-row');
    
            for (let j = 0; j < cols; j++) {
                const cell = createCell(puzzle[i][j], i, j);
                row.appendChild(cell);
            }
    
            grid.appendChild(row);
        }
        setGridStyle(rows, cols);
    } 

    createGrid(myPuzzle);

    grid.addEventListener('contextmenu', event => event.preventDefault());

    window.addEventListener('resize', () => {
        const rows = myPuzzle.length;
        const cols = myPuzzle[0].length;
        setGridStyle(rows, cols);
        updateCanvasSize(rows, cols);
    });
});