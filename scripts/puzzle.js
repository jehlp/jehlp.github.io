const puzzles = [
    [
        [0,  0,  0,  0,  0,  0], 
        [0,  6,  0,  6,  0,  0],
        [0,  0,  0,  0,  0,  0], 
        [0,  2,  0,  0,  0,  0], 
        [0,  0,  0,  0,  0,  0], 
        [0,  0,  0,  3,  0,  0]
    ],
    [
        [0,  7,  0,  0,  0,  0,  0],
        [0,  0,  0,  0,  0,  0,  0],
        [0,  0,  0,  0,  0,  0,  0],
        [0,  0,  0,  0,  0,  0,  1],
        [0,  0,  0,  0,  0,  0,  0],
        [0,  10, 0,  3,  0,  0,  0],
        [0,  0,  1,  0,  0,  0,  0]
    ],
    [
        [0,  0,  1,  0,  0,  2,  0],
        [3,  0,  0,  0,  0,  0,  0],
        [0,  0,  0,  0,  0,  0,  0],
        [0,  0,  11, 0,  0,  0,  1],
        [0,  2,  0,  0,  0,  0,  0],
        [0,  0,  0,  0,  0,  0,  0],
        [0,  0,  0,  0,  0,  0,  2]
    ],
    [
        [4,  0,  0,  3,  0,  3,  0,  0,  4,  0],
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  3],
        [0,  0,  0,  0,  0,  0,  2,  0,  0,  0],
        [0,  0,  2,  0,  0,  0,  0,  0,  0,  0],
        [3,  0,  0,  0,  0,  0,  0,  0,  2,  0],
        [0,  0,  4,  0,  0,  0,  0,  0,  0,  0],
        [0,  0,  0,  0,  4,  0,  2,  0,  0,  0],
        [3,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [0,  0,  0,  0,  4,  0,  0,  0,  6,  0],
    ],
    [
        [0,  0,  0,  0,  0,  0,  0,  0,  6,  0],
        [0,  1,  0,  0,  0,  0,  0,  0,  0,  0],
        [0,  0,  0,  0,  4,  0,  0,  0,  0,  2],
        [0,  0,  0,  3,  0,  0,  0,  2,  0,  0],
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [0,  0,  0,  0,  0,  0,  0,  2,  0,  0],
        [4,  0,  0,  4,  0,  6,  0,  0,  0,  0],
        [0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [7,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [0,  0,  0,  0,  4,  0,  0,  0,  0,  0],
    ]
];

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('puzzle-grid');
    const successMessage = document.createElement('div'); 
    successMessage.id = 'success-message'; 
    grid.parentNode.insertBefore(successMessage, grid.nextSibling); 

    let mypuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    let isSolved = false;

    function setGridStyle(rows, cols) {
        grid.style.gridTemplateColumns = `repeat(${cols}, 50px)`;
        grid.style.gridTemplateRows = `repeat(${rows}, 50px)`;
    }

    function getCurrentGridState() {
        const state = [];
        for (const row of grid.children) {
            const rowState = [];
            for (const cell of row.children) {
                if (cell.classList.contains('number-cell')) {
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

    function validatePuzzle(currentState) {
        const rows = currentState.length;
        const cols = currentState[0].length;
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (currentState[i][j] === 'empty') {
                    return false; 
                }
            }
        }

        for (let i = 0; i < rows - 1; i++) {
            for (let j = 0; j < cols - 1; j++) {
                if (currentState[i][j] === 'shaded' &&
                    currentState[i + 1][j] === 'shaded' &&
                    currentState[i][j + 1] === 'shaded' &&
                    currentState[i + 1][j + 1] === 'shaded') {
                    return false;
                }
            }
        }
    
        let visited = new Array(rows).fill(0).map(() => new Array(cols).fill(false));
        let shadedCellsCount = 0;
        let connectedShadedCellsCount = 0;
    
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (currentState[i][j] === 'shaded') {
                    shadedCellsCount++;
                }
            }
        }
    
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (currentState[i][j] === 'shaded') {
                    connectedShadedCellsCount = dfs(i, j, visited, currentState);
                    break;
                }
            }
            if (connectedShadedCellsCount > 0) break;
        }
    
        function dfs(row, col, visited, grid) {
            if (row < 0 || col < 0 || row >= rows || col >= cols || visited[row][col] || grid[row][col] !== 'shaded') {
                return 0;
            }
    
            visited[row][col] = true;
            let count = 1; 
    
            count += dfs(row + 1, col, visited, grid);
            count += dfs(row - 1, col, visited, grid);
            count += dfs(row, col + 1, visited, grid);
            count += dfs(row, col - 1, visited, grid);
    
            return count;
        }

        let visitedUnshaded = new Array(rows).fill(0).map(() => new Array(cols).fill(false));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if ((currentState[i][j] === 'unshaded' || !isNaN(currentState[i][j])) && !visitedUnshaded[i][j]) {
                    const unshadedInfo = dfsUnshaded(i, j, visitedUnshaded, currentState);
                    if (unshadedInfo.numbers !== 1 || unshadedInfo.count !== unshadedInfo.firstNumber) {
                        return false;
                    }
                }
            }
        }

        function dfsUnshaded(row, col, visited, grid) {
            if (row < 0 || col < 0 || row >= rows || col >= cols || visited[row][col] || grid[row][col] === 'shaded') {
                return { count: 0, numbers: 0, firstNumber: null };
            }
        
            visited[row][col] = true;
            let count = 1;
            let numbers = 0;
            let firstNumber = null;
        
            if (!isNaN(grid[row][col])) {
                numbers = 1;
                firstNumber = parseInt(grid[row][col], 10);
            }
        
            const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (const [dx, dy] of offsets) {
                const result = dfsUnshaded(row + dx, col + dy, visited, grid);
                count += result.count;
                numbers += result.numbers;
                firstNumber = firstNumber === null ? result.firstNumber : firstNumber;
            }
        
            return { count, numbers, firstNumber };
        }
        
        if (shadedCellsCount === connectedShadedCellsCount) {
            successMessage.textContent = 'Solved!';
            isSolved = true;
        }
        return shadedCellsCount === connectedShadedCellsCount;
    }
    
    function createGrid(puzzle) {
        const rows = puzzle.length;
        const cols = puzzle[0].length;
    
        setGridStyle(rows, cols);
    
        grid.innerHTML = ''; 
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.classList.add('grid-row');
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                if (puzzle[i][j] !== 0) {
                    cell.textContent = puzzle[i][j];
                    cell.classList.add('number-cell');
                } else {
                    cell.addEventListener('click', function() {
                        if (!isSolved) { 
                            if (cell.classList.contains('shaded')) {
                                cell.classList.remove('shaded');
                                cell.classList.add('unshaded-cell');
                            } else if (cell.classList.contains('unshaded-cell')) {
                                cell.classList.remove('unshaded-cell');
                            } else {
                                cell.classList.add('shaded');
                            }
                            validatePuzzle(getCurrentGridState())
                        }
                    });
    
                    cell.addEventListener('contextmenu', function(e) {
                        e.preventDefault(); 
                        if (!isSolved) { 
                            if (cell.classList.contains('unshaded-cell')) {
                                cell.classList.remove('unshaded-cell');
                            } else {
                                cell.classList.add('unshaded-cell');
                            }
                            validatePuzzle(getCurrentGridState())
                        }
                    });
                }
                row.appendChild(cell);
            }
            grid.appendChild(row);
        }
    }    
    
    createGrid(mypuzzle);
});