/**
 * Recursive pyramid puzzle solver.
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
export default function pyramidPuzzleSolver(board, unusedPieces, onSolution) {
  /**
   * Normalise coords to be aligned to top left (0, 0).
   *
   * @param {Array<Array<number>>} coords The coordinates of the piece's cells.
   * @returns {Array<Array<number>>} The normalized coordinates.
   */
  const normalize = (coords) => {
    const minLayer = Math.min(...coords.map(([l]) => l));
    const minRow = Math.min(...coords.map(([, r]) => r));
    const minCol = Math.min(...coords.map(([, , c]) => c));
    return coords.map(([l, r, c]) => [l - minLayer, r - minRow, c - minCol]);
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
  const coordsToString = (coords) =>
    normalize(coords)
      .sort(([l1, r1, c1], [l2, r2, c2]) => l1 - l2 || r1 - r2 || c1 - c2)
      .map((coord) => coord.join(","))
      .join("|");

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

  // Check if orientations for this shape have alread been computed and
  // stored in the cache
  const getAllOrientations = (coords) => {
    // Cache check
    const cacheKey = coords.map((coord) => coord.join(",")).join("|");
    if (orientationsCache.has(cacheKey)) {
      return orientationsCache.get(cacheKey);
    }

    const orientations = new Set();
    let current = [...coords];

    // 24 unique 3D rotations * 2 reflections
    for (let flip = 0; flip < 2; flip++) {
      for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
          for (let z = 0; z < 4; z++) {
            orientations.add(coordsToString(current));
            // Z rotation
            current = current.map(([x, y, z]) => [x, -z, y]);
          }
          // Y rotation
          current = current.map(([x, y, z]) => [z, y, -x]);
        }
        // X rotation
        current = current.map(([x, y, z]) => [-y, x, z]);
      }
      // Reflection
      current = current.map(([x, y, z]) => [-x, y, z]);
    }

    const result = Array.from(orientations).map((str) =>
      str.split("|").map((coord) => coord.split(",").map(Number))
    );
    orientationsCache.set(cacheKey, result);
    return result;
  };

  /**
   * Checks if a piece can be placed at a specific position in the pyramid.
   *
   * @param {string[][][]} board The pyramid board.
   * @param {Array<Array<number>>} coords The coordinates of the piece's cells.
   * @param {number} startLayer Starting layer in pyramid.
   * @param {number} startRow Starting row position.
   * @param {number} startCol Starting column position.
   * @returns {boolean} Whether the piece can be placed.
   */
  const canPlacePiece = (board, coords, startLayer, startRow, startCol) => {
    return coords.every(([x, y, z]) => {
      const targetLayer = startLayer + y;
      const targetRow = startRow + x;
      const targetCol = startCol + z;

      // Check pyramid bounds
      if (targetLayer < 0 || targetLayer >= board.length) return false;

      // Check layer size constraints (pyramid shape)
      const layerSize = board.length - targetLayer;
      if (
        targetRow < 0 ||
        targetRow >= layerSize ||
        targetCol < 0 ||
        targetCol >= layerSize
      )
        return false;

      // Check if position is empty
      return board[targetLayer][targetRow][targetCol] === "";
    });
  };

  /**
   * Places a piece on the pyramid board.
   *
   * @param {string[][][]} board The pyramid board.
   * @param {Object} piece The piece to be placed.
   * @param {Array<Array<number>>} coords The coordinates of the piece's cells.
   * @param {number} startLayer Starting layer in pyramid.
   * @param {number} startRow Starting row position.
   * @param {number} startCol Starting column position.
   * @returns {string[][][]} New board with the piece placed.
   */
  const placePiece = (board, piece, coords, startLayer, startRow, startCol) => {
    const newBoard = board.map((layer) => layer.map((row) => [...row]));

    coords.forEach(([x, y, z]) => {
      const targetLayer = startLayer + y;
      const targetRow = startRow + x;
      const targetCol = startCol + z;
      newBoard[targetLayer][targetRow][targetCol] = piece.symbol;
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
    // Find first empty position in pyramid, scanning layer by layer
    for (let layer = 0; layer < board.length; layer++) {
      const layerSize = board.length - layer;
      for (let row = 0; row < layerSize; row++) {
        for (let col = 0; col < layerSize; col++) {
          if (board[layer][row][col] === "") {
            return [layer, row, col];
          }
        }
      }
    }
    return null;
  };

  /**
   * Recursively attempts to solve the pyramid puzzle.
   *
   * @param {string[][][]} board The pyramid board.
   * @param {Array<Object>} unusedPieces Remaining pieces to place.
   * @param {Array<string[][][]>} solutions Array to store solutions.
   */

  const solveRecursive = (board, unusedPieces, solutions) => {
    // Base case: no unused pieces means solution found
    if (unusedPieces.length === 0) {
      const solution = board.map((layer) => layer.map((row) => [...row]));
      solutions.push(solution);
      onSolution(solution);
      return;
    }

    const emptyPos = findEmptyPosition(board);
    if (!emptyPos) return;
    const [startLayer, startRow, startCol] = emptyPos;

    // Try each piece in each orientation
    for (let i = 0; i < unusedPieces.length; i++) {
      const piece = unusedPieces[i];
      const orientations = getAllOrientations(piece.coords);

      for (const orientation of orientations) {
        if (canPlacePiece(board, orientation, startLayer, startRow, startCol)) {
          const newBoard = placePiece(
            board,
            piece,
            orientation,
            startLayer,
            startRow,
            startCol
          );
          const remainingPieces = [
            ...unusedPieces.slice(0, i),
            ...unusedPieces.slice(i + 1),
          ];
          solveRecursive(newBoard, remainingPieces, solutions);
        }
      }
    }
  };
  solveRecursive(board, unusedPieces, []);
}
