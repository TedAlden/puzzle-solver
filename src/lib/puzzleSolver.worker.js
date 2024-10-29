/* eslint-disable no-restricted-globals */

// Cache for piece orientations - saves the algorithm needing to re-
// compute these every time it can't place a piece and has to try again
const orientationsCache = new Map();

const getAllOrientations = (coords) => {
  const cacheKey = coords.map(coord => coord.join(',')).join('|');

  if (orientationsCache.has(cacheKey)) {
    return orientationsCache.get(cacheKey);
  }

  const orientations = new Set();
  const normalize = (coords) => {
    const minRow = Math.min(...coords.map(([r]) => r));
    const minCol = Math.min(...coords.map(([, c]) => c));
    return coords.map(([r, c]) => [r - minRow, c - minCol]);
  };

  const coordsToString = (coords) => normalize(coords)
    .sort(([r1, c1], [r2, c2]) => r1 - r2 || c1 - c2)
    .map(coord => coord.join(','))
    .join('|');

  let current = [...coords];
  for (let flip = 0; flip < 2; flip++) {
    for (let rot = 0; rot < 4; rot++) {
      orientations.add(coordsToString(current));
      current = current.map(([r, c]) => [-c, r]);
    }
    current = current.map(([r, c]) => [r, -c]);
  }

  const result = Array.from(orientations).map(str =>
    str.split('|').map(coord => coord.split(',').map(Number))
  );

  orientationsCache.set(cacheKey, result);
  return result;
};

// Check if two boards are equal
const areBoardsEqual = (board1, board2) => {
  return board1.every((row, i) =>
    row.every((cell, j) => cell === board2[i][j])
  );
};

// Check if a solution is unique
const isUniqueSolution = (newSolution, existingSolutions) => {
  return !existingSolutions.some(solution =>
    areBoardsEqual(newSolution, solution)
  );
};

// Check if piece can be placed
const canPlacePiece = (board, coords, startRow, startCol) => {
  const boardHeight = board.length;
  const boardWidth = board[0].length;

  for (const [row, col] of coords) {
    const newRow = startRow + row;
    const newCol = startCol + col;

    if (newRow < 0 || newRow >= boardHeight ||
      newCol < 0 || newCol >= boardWidth ||
      board[newRow][newCol] !== "") {
      return false;
    }
  }
  return true;
};

// Place piece on board
const placePiece = (board, piece, coords, startRow, startCol) => {
  const newBoard = board.map(row => [...row]);
  coords.forEach(([row, col]) => {
    newBoard[startRow + row][startCol + col] = piece.symbol;
  });
  return newBoard;
};

// Find next empty position
const findEmptyPosition = (board) => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (board[row][col] === "") {
        return [row, col];
      }
    }
  }
  return null;
};

// Count empty cells
const countEmptyCells = (board) => {
  return board.reduce((count, row) =>
    count + row.filter(cell => cell === "").length, 0
  );
};

// Verify if the current board state can lead to a solution
const isValidPartialSolution = (board, unusedPieces) => {
  const emptyCells = countEmptyCells(board);
  const remainingCells = unusedPieces.reduce((sum, piece) =>
    sum + piece.coords.length, 0
  );
  return emptyCells === remainingCells;
};

let solutionsFound = 0;

const solveBoard = (board, unusedPieces, solutions, maxSolutions = 50) => {
  // Check if we've found enough solutions
  if (solutionsFound >= maxSolutions) {
    return true;
  }

  // Base case: all pieces placed successfully
  if (unusedPieces.length === 0) {
    const newSolution = board.map(row => [...row]);
    if (isUniqueSolution(newSolution, solutions)) {
      solutions.push(newSolution);
      solutionsFound++;
      // Send progress update with current solution
      self.postMessage({
        type: 'progress',
        progress: (solutionsFound / maxSolutions) * 100,
        currentSolutions: solutions.length
      });
    }
    return false; // searching for more solutions
  }

  // Quick validation of partial solution
  if (!isValidPartialSolution(board, unusedPieces)) {
    return false;
  }

  const emptyPos = findEmptyPosition(board);
  if (!emptyPos) return false;

  const [startRow, startCol] = emptyPos;

  // Each piece in each orientation
  for (let i = 0; i < unusedPieces.length; i++) {
    const currentPiece = unusedPieces[i];
    const orientations = getAllOrientations(currentPiece.coords);

    for (const orientation of orientations) {
      if (canPlacePiece(board, orientation, startRow, startCol)) {
        const newBoard = placePiece(board, currentPiece, orientation, startRow, startCol);
        const remainingPieces = [
          ...unusedPieces.slice(0, i),
          ...unusedPieces.slice(i + 1)
        ];

        solveBoard(newBoard, remainingPieces, solutions, maxSolutions);

        if (solutionsFound >= maxSolutions) {
          return true;
        }
      }
    }
  }

  return false;
};

const findSolutions = (board, pieces) => {
  // Reset solution counter
  solutionsFound = 0;

  // Get pieces that haven't been placed yet
  const unusedPieces = pieces.filter(piece =>
    !board.some(row => row.includes(piece.symbol))
  );

  // Initialize 
  const solutions = [];

  // Start solving
  solveBoard(board, unusedPieces, solutions);

  return solutions;
};

// Web Worker message handler
self.addEventListener('message', (e) => {
  const { board, pieces } = e.data;
  try {
    const solutions = findSolutions(board, pieces);
    if (solutions.length > 0) {
      self.postMessage({
        success: true,
        solutions,
        message: `Found ${solutions.length} solutions!`
      });
    } else {
      self.postMessage({
        success: false,
        error: "No solutions found!"
      });
    }
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message || "An error occurred while solving the puzzle."
    });
  }
});
