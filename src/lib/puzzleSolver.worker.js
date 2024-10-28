/* eslint-disable no-restricted-globals */

// Explicitly declare worker context
const ctx = self;

// unique orientations 
const getAllOrientations = (coords) => {
    const orientations = new Set();
    
    // Get bounding box to normalize rotations
    const getBounds = (coords) => {
        const rows = coords.map(([r]) => r);
        const cols = coords.map(([, c]) => c);
        return {
            minRow: Math.min(...rows),
            maxRow: Math.max(...rows),
            minCol: Math.min(...cols),
            maxCol: Math.max(...cols)
        };
    };

    const normalize = (coords) => {
        const { minRow, minCol } = getBounds(coords);
        return coords.map(([r, c]) => [r - minRow, c - minCol]);
    };

    // coordinates to a unique string for Set storage
    const coordsToString = (coords) => {
        return normalize(coords)
            .sort(([r1, c1], [r2, c2]) => r1 - r2 || c1 - c2)
            .map(coord => coord.join(','))
            .join('|');
    };

    // Original orientation
    let current = [...coords];
    for (let flip = 0; flip < 2; flip++) {
        for (let rot = 0; rot < 4; rot++) {
            orientations.add(coordsToString(current));
            current = current.map(([r, c]) => [-c, r]); // 90-degree rotation
        }
        current = current.map(([r, c]) => [r, -c]); // Flip horizontally
    }

    // Convert orientations back to arrays
    return Array.from(orientations).map(str =>
        str.split('|').map(coord => coord.split(',').map(Number))
    );
};

// if a piece can fit on the board at the specified position
const canPlacePiece = (board, coords, startRow, startCol) => {
    const boardHeight = board.length;
    const boardWidth = board[0].length;
    
    for (const [row, col] of coords) {
        const newRow = startRow + row;
        const newCol = startCol + col;
        
        if (newRow < 0 || newRow >= boardHeight || 
            newCol < 0 || newCol >= boardWidth || 
            board[newRow][newCol] !== "") {
            return false; // Blocked or out of bounds
        }
    }
    return true;
};

// Places a piece on the board at a given position
const placePiece = (board, piece, coords, startRow, startCol) => {
    const newBoard = board.map(row => [...row]); // Copy board
    
    coords.forEach(([row, col]) => {
        newBoard[startRow + row][startCol + col] = piece.symbol;
    });
    
    return newBoard;
};

// Finds the next empty cell 
const findEmptyPosition = (board) => {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            if (board[row][col] === "") return [row, col];
        }
    }
    return null; 
};

// Recursive backtracking algorithm to find a solution
const solveBoard = (board, unusedPieces, solutions = [], maxSolutions = 1) => {
    if (unusedPieces.length === 0) {
        solutions.push(board.map(row => [...row])); // Found solution
        return solutions.length >= maxSolutions;
    }

    const emptyPos = findEmptyPosition(board);
    if (!emptyPos) return false;
    
    const [startRow, startCol] = emptyPos;

    for (let i = 0; i < unusedPieces.length; i++) {
        const piece = unusedPieces[i];
        const orientations = getAllOrientations(piece.coords);
        
        for (const orientation of orientations) {
            if (canPlacePiece(board, orientation, startRow, startCol)) {
                const newBoard = placePiece(board, piece, orientation, startRow, startCol);
                const remainingPieces = [...unusedPieces.slice(0, i), ...unusedPieces.slice(i + 1)];
                
                if (solveBoard(newBoard, remainingPieces, solutions, maxSolutions)) {
                    return true; // Solution found
                }
            }
        }
    }
    
    return false; // No solution with current arrangement
};

// Entry function for finding the solution
const findSolution = (board, pieces) => {
    const unusedPieces = pieces.filter(piece => 
        !board.some(row => row.includes(piece.symbol))
    );
    
    const solutions = [];
    solveBoard(board, unusedPieces, solutions, 1);
    return solutions[0] || null;
};

// Web Worker message handler
ctx.addEventListener('message', (e) => {
    const { board, pieces } = e.data;
    try {
        const solution = findSolution(board, pieces);
        ctx.postMessage({ success: true, solution });
    } catch (error) {
        ctx.postMessage({ success: false, error: error.message });
    }
});
