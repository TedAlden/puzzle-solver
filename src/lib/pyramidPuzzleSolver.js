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
    const cacheKey = coords.map((coord) => coord.join(",")).join("|");
    if (orientationsCache.has(cacheKey)) return orientationsCache.get(cacheKey);

    const orientations = new Set();
    let current = [...coords];

    // Try each axis rotation and reflection
    const rotateX = (coords) => coords.map(([x, y, z]) => [-y, x, z]);
    const rotateY = (coords) => coords.map(([x, y, z]) => [z, y, -x]);
    const rotateZ = (coords) => coords.map(([x, y, z]) => [x, -z, y]);

    const flipX = (coords) => coords.map(([x, y, z]) => [-x, y, z]);
    const flipY = (coords) => coords.map(([x, y, z]) => [x, -y, z]);
    const flipZ = (coords) => coords.map(([x, y, z]) => [x, y, -z]);

    // Try all possibilities for flipping X, Y, Z and rotating around X, Y, Z
    for (let fx = 0; fx < 2; fx++) {
      for (let fy = 0; fy < 2; fy++) {
        for (let fz = 0; fz < 2; fz++) {
          for (let rx = 0; rx < 4; rx++) {
            for (let ry = 0; ry < 4; ry++) {
              for (let rz = 0; rz < 4; rz++) {
                orientations.add(coordsToString(current));
                current = rotateZ(current);
              }
              current = rotateY(current);
            }
            current = rotateX(current);
          }
          current = flipZ(current);
        }
        current = flipY(current);
      }
      current = flipX(current);
    }

    const result = Array.from(orientations).map((str) =>
      str.split("|").map((coord) => coord.split(",").map(Number))
    );
    orientationsCache.set(cacheKey, result);
    return result;
  };

  /**
   * Find the next empty position on the board.
   *
   * @param {string[][]} board The polysphere board.
   * @returns {Array<number>|null} The [row, col] of the next empty position,
   *  or null if the board is full.
   */
  const findEmptyPosition = (board) => {
    for (let layer = 0; layer < board.length; layer++) {
      const layerSize = board.length - layer;
      for (let row = 0; row < layerSize; row++) {
        for (let col = 0; col < layerSize; col++) {
          if (board[layer][row][col] === "") {
            //console.log(`Empty position found at [Layer: ${layer}, Row: ${row}, Col: ${col}]`);
            return [layer, row, col];
          }
        }
      }
    }
    console.log("No empty position found.");
    return null;
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
  const canPlacePiece = (board, coords, startLayer, startRow, startCol) =>
    coords.every(([l, r, c]) => {
      const targetLayer = startLayer + l;
      const targetRow = startRow + r;
      const targetCol = startCol + c;

      if (targetLayer < 0 || targetLayer >= board.length) return false;

      const layerSize = board.length - targetLayer;
      return (
        targetRow >= 0 &&
        targetRow < layerSize &&
        targetCol >= 0 &&
        targetCol < layerSize &&
        board[targetLayer][targetRow][targetCol] === ""
      );
    });
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
    coords.forEach(([l, r, c]) => {
      newBoard[startLayer + l][startRow + r][startCol + c] = piece.symbol;
    });
    return newBoard;
  };

  const findAnchorPoints = (startCoords) => {
    const points = [];
    const coords = normalize(startCoords);
    coords.forEach(([x, y, z]) => {
      points.push(coords.map(([cx, cy, cz]) => [cx - x, cy - y, cz - z]));
    });
    return points;
  };

  /**
   * Recursively attempts to solve the pyramid puzzle.
   *
   * @param {string[][][]} board The pyramid board.
   * @param {Array<Object>} unusedPieces Remaining pieces to place.
   * @param {Array<string[][][]>} solutions Array to store solutions.
   */

  const solveRecursive = (board, unusedPieces, solutions) => {
    if (unusedPieces.length === 0) {
      const solution = board.map((layer) => layer.map((row) => [...row]));
      solutions.push(solution);
      onSolution(solution);
      return;
    }

    const emptyPos = findEmptyPosition(board);
    if (!emptyPos) return;
    const [startLayer, startRow, startCol] = emptyPos;

    for (let i = 0; i < unusedPieces.length; i++) {
      const piece = unusedPieces[i];
      const orientations = getAllOrientations(piece.coords);

      for (const orientation of orientations) {
        findAnchorPoints(orientation).forEach((anchor) => {
          if (canPlacePiece(board, anchor, startLayer, startRow, startCol)) {
            const newBoard = placePiece(
              board,
              piece,
              anchor,
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
        });
      }
    }
  };

  solveRecursive(board, unusedPieces, []);
}
