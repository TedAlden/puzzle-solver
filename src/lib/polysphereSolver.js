/**
 * Solves the polysphere puzzle by attempting to place unused pieces onto the
 * board recursively until a solution is found or all configurations are
 * exhausted.
 *
 * @param {string[][]} board The board to be solved, represented as a
 *  2D array. Each element is a string representing the symbol of the piece at
 *  that position, or an empty string if no piece is placed.
 * @param {Array<Object>} unusedPieces An array of piece objects that have not
 *  yet been placed on the board.
 * @param {Function} onSolution A callback function that is called when a valid
 *  solution is found.
 * @returns {void} Solutions are not returned; instead solutions are provided
 *  via the onSolution callback.
 *
 * @example
 * solvePolyspheres(board, unusedPieces, (solution) => {
 *   console.log("Found a solution:", solution);
 * });
 */
export default function solvePolyspheres(board, unusedPieces, onSolution) {
  /**
   * Normalise coords to be aligned to top left (0, 0).
   * 
   * @param {Array<Array<number>>} coords The coordinates of the piece's cells.
   * @returns {Array<Array<number>>} The normalized coordinates.
   */
  const normalize = (coords) => {
    const minRow = Math.min(...coords.map(([r]) => r));
    const minCol = Math.min(...coords.map(([, c]) => c));
    return coords.map(([r, c]) => [r - minRow, c - minCol]);
  };

  /**
   * Turn a list of coordinates into a string x,y|x,y|x,y|.., after normalising
   * and sorting them in order. Any combination of the same coordinates should
   * always return the same string.
   * 
   * @param {Array<Array<number>>} coords The coordinates of the piece's
   *  cells.
   * @returns {string} The string representation of the normalized
   *  coordinates.
   */
  const coordsToString = (coords) => (
    normalize(coords)
      .sort(([r1, c1], [r2, c2]) => r1 - r2 || c1 - c2)
      .map(coord => coord.join(','))
      .join('|')
  );

  // Cache for piece orientations - saves the algorithm needing to re-compute
  // these every time it can't place a piece and has to try placing the same
  // piece again
  const orientationsCache = new Map();

  /**
   * Compute all the unique orientations for a shape piece, including rotations
   * (90, 180, 270 degrees) and horizontal flips.
   * 
   * @param {Array<Array<number>>} coords The coordinates of the piece's cells.
   * @returns {Array<Array<Array<number>>>} An array of unique orientations,
   *  each represented as an array of [row, col] coordinate pairs.
   */
  const getAllOrientations = (coords) => {
    // Check if orientations for this shape have alread been computed and
    // stored in the cache
    const cacheKey = coords.map(coord => coord.join(',')).join('|');
    if (orientationsCache.has(cacheKey)) {
      return orientationsCache.get(cacheKey);
    }
    // Compute all orientations for this shape, use a set to avoid duplicates
    const orientations = new Set();
    let current = [...coords];
    for (let flip = 0; flip < 2; flip++) {
      for (let rot = 0; rot < 4; rot++) {
        orientations.add(coordsToString(current));
        current = current.map(([r, c]) => [-c, r]);
      }
      current = current.map(([r, c]) => [r, -c]);
    }
    // Turn the orientations, stored as a list coordinate strings, back into a
    // list of coordinates [[x, y], [x, y], ...]
    const result = Array.from(orientations).map(str =>
      str.split('|').map(coord => coord.split(',').map(Number))
    );
    // Add to cache to prevent computing this all again
    orientationsCache.set(cacheKey, result);
    return result;
  };

  /**
   * Checks if a piece can be placed at a specific starting position on the
   * board.
   *
   * @param {string[][]} board The polysphere board.
   * @param {Array<Array<number>>} coords The coordinates of the piece's cells.
   * @param {number} startRow The starting row for placement.
   * @param {number} startCol The starting column for placement.
   * @returns {boolean} Can the piece can be placed.
   */
  const canPlacePiece = (board, coords, startRow, startCol) => (
    coords.every(([row, col]) => (
      startRow + row >= 0 &&
      startRow + row < board.length &&
      startCol + col >= 0 &&
      startCol + col < board[0].length &&
      board[startRow + row][startCol + col] === ""
    ))
  );

  /**
   * Places a piece on the board and returns the new updated board.
   *
   * @param {string[][]} board The polysphere board.
   * @param {Object} piece The piece to be placed.
   * @param {Array<Array<number>>} coords The coordinates of the piece's cells.
   * @param {number} startRow The starting row for placement.
   * @param {number} startCol The starting column for placement.
   * @returns {string[][]} The new board with the piece placed.
   */
  const placePiece = (board, piece, coords, startRow, startCol) => {
    const newBoard = board.map(row => [...row]);
    coords.forEach(([row, col]) => {
      newBoard[startRow + row][startCol + col] = piece.symbol;
    });
    return newBoard;
  };

  /**
   * Find the next empty position on the board.
   *
   * @param {string[][]} board The polysphere board.
   * @returns {Array<number>|null} The [row, col] of the next empty position,
   *  or null if the board is full.
   */
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

  /**
   * Recursively attempts to solve the polysphere puzzle.
   *
   * @param {string[][]} board The polysphere board.
   * @param {Array<Object>} unusedPieces An array of remaining pieces to place.
   * @param {Array<string[][]>} solutions An array to store solutions found.
   */
  const solveRecursive = (board, unusedPieces, solutions) => {
    // Recursive base case: no unused pieces means board is complete
    if (unusedPieces.length === 0) {
      solutions.push(board.map(row => [...row]));
      // Callback with the solution - used in the front end to display each
      // solution as it is found, as this algorithm takes minutes to complete
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
          const newBoard = placePiece(
            board, piece, orientation, startRow, startCol
          );
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
