export default function solvePolyspheres (board, unusedPieces, onSolution) {
  // Cache for piece orientations - saves the algorithm needing to re-
  // compute these every time it can't place a piece and has to try
  // placing the same piece again
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

  // Check if piece can be placed
  const canPlacePiece = (board, coords, startRow, startCol) => (
    coords.every(([row, col]) => (
      startRow + row >= 0 &&
      startRow + row < board.length &&
      startCol + col >= 0 &&
      startCol + col < board[0].length &&
      board[startRow + row][startCol + col] === ""
    ))
  );

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

  // Verify if the current board state can lead to a solution
  // const isValidPartialSolution = (board, unusedPieces) => {
  //   // Empty cells on board
  //   const emptyCells = board.reduce((count, row) =>
  //     count + row.filter(cell => cell === "").length, 0
  //   );
  //   // How many cells the remaining pieces would occupy
  //   const remainingCells = unusedPieces.reduce((sum, piece) =>
  //     sum + piece.coords.length, 0
  //   );
  //   return emptyCells === remainingCells;
  // };

  const solveRecursive = (board, unusedPieces, solutions) => {
    // Recursive base case: no unused pieces means board is complete
    if (unusedPieces.length === 0) {
      solutions.push(board.map(row => [...row]));
      // Callback with the solution - used in the front end to display
      // each solution as it is found, as this algorithm takes minutes
      // to complete
      onSolution(board.map(row => [...row]));
      return;
    }

    // Find the next empty position in the board to try placing a piece
    const emptyPos = findEmptyPosition(board);
    if (!emptyPos) return;
    const [startRow, startCol] = emptyPos;

    // For each unused piece...
    for (let i = 0; i < unusedPieces.length; i++) {
      const piece = unusedPieces[i];
      const orientations = getAllOrientations(piece.coords);
      // ...For each orientation (rotation or flip) of this piece...
      for (const orientation of orientations) {
        if (canPlacePiece(board, orientation, startRow, startCol)) {
          // ...Place the piece
          const newBoard = placePiece(board, piece, orientation, startRow, startCol);
          const remainingPieces = [
            ...unusedPieces.slice(0, i),
            ...unusedPieces.slice(i + 1)
          ];
          // ...Attempt to solve the board with this piece placed
          solveRecursive(newBoard, remainingPieces, solutions);
        }
      }
    }
  };
  solveRecursive(board, unusedPieces, []);
};
