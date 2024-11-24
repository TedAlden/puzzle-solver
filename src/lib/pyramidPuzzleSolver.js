/**
 * Solves the pyramid puzzle by attempting to place unused pieces onto the
 * board recursively until all possible solutions are found.
 *
 * @param {string[][][]} board The 3D pyramid board to be solved
 * @param {Array<Object>} unusedPieces Pieces that haven't been placed yet
 * @param {Function} onSolution Callback function called when a solution is found
 * @returns {void} Solutions provided via onSolution callback
 */
export default function pyramidPuzzleSolver(board, unusedPieces, onSolution) {
  console.log("=== Pyramid Solver Starting ===");
  
  // Cache for piece orientations
  const orientationsCache = new Map();

  /**
   * Normalize 2D coordinates to top-left origin
   * @param {Array<Array<number>>} coords 2D coordinates to normalize
   * @returns {Array<Array<number>>} Normalized coordinates
   */
  function normalize(coords) {
    const minX = Math.min(...coords.map(([x]) => x));
    const minZ = Math.min(...coords.map(([, z]) => z));
    return coords.map(([x, z]) => [x - minX, z - minZ]);
  }

  /**
   * Convert coordinates to a consistent string representation
   * @param {Array<Array<number>>} coords Coordinates to convert
   * @returns {string} String representation of normalized coordinates
   */
  function coordsToString(coords) {
    return normalize(coords)
      .sort(([x1, z1], [x2, z2]) => x1 - x2 || z1 - z2)
      .map(coord => coord.join(","))
      .join("|");
  }

  /**
   * Track placed pieces on the board
   */
  const placedPieces = new Set();
  board.forEach((layer, y) => {
    layer.forEach((row, z) => {
      row.forEach((cell) => {
        if (cell !== "") {
          placedPieces.add(cell);
        }
      });
    });
  });

  console.log("Found placed pieces:", Array.from(placedPieces));

  /**
   * Convert 2D piece coordinates to 3D coordinates for the specified layer
   * @param {Object} piece Piece to convert
   * @param {number} layerY Target layer
   * @returns {Array<Array<number>>} 3D coordinates
   */
  function get3DCoords(piece, layerY) {
    return piece.coords.map(([x, z]) => [x, layerY, z]);
  }

  /**
   * Get all possible orientations for a piece, using cache if available
   * @param {Object} piece Piece to get orientations for
   * @returns {Array<Array<Array<number>>>} Array of possible orientations
   */
  function getAllOrientations(piece) {
    const cacheKey = coordsToString(piece.coords);
    if (orientationsCache.has(cacheKey)) {
      return orientationsCache.get(cacheKey);
    }

    const orientations = new Set();
    let current = [...piece.coords];

    // Rotations (90 degree increments)
    for (let rot = 0; rot < 4; rot++) {
      orientations.add(coordsToString(current));
      current = current.map(([x, z]) => [-z, x]); // 90-degree rotation
    }

    // Convert back to coordinate arrays
    const result = Array.from(orientations).map(str =>
      str.split("|").map(coord => coord.split(",").map(Number))
    );

    orientationsCache.set(cacheKey, result);
    return result;
  }

  /**
   * Check if a piece can be placed at the specified position
   */
  function canPlacePiece(board, piece, startX, layerY, startZ) {
    const coords3D = get3DCoords(piece, layerY);
    
    return coords3D.every(([dx, dy, dz]) => {
      const x = startX + dx;
      const y = dy;
      const z = startZ + dz;

      // Check bounds
      if (y < 0 || y >= board.length) return false;
      if (z < 0 || z >= board[y].length) return false;
      if (x < 0 || x >= board[y][z].length) return false;

      // Check if space is empty
      if (board[y][z][x] !== "") return false;

      // Check for support (except bottom layer)
      if (y > 0 && board[y - 1][z][x] === "") return false;

      return true;
    });
  }

  /**
   * Check if a piece placement is connected to existing pieces
   */
  function isConnected(board, piece, startX, layerY, startZ) {
    if (placedPieces.size === 0) return true;

    const coords3D = get3DCoords(piece, layerY);
    
    return coords3D.some(([dx, dy, dz]) => {
      const x = startX + dx;
      const y = dy;
      const z = startZ + dz;

      const neighbors = [
        [-1, 0, 0], [1, 0, 0],
        [0, 0, -1], [0, 0, 1],
        [0, -1, 0], [0, 1, 0]
      ];

      return neighbors.some(([nx, ny, nz]) => {
        const checkX = x + nx;
        const checkY = y + ny;
        const checkZ = z + nz;

        if (checkY < 0 || checkY >= board.length) return false;
        if (checkZ < 0 || checkZ >= board[checkY].length) return false;
        if (checkX < 0 || checkX >= board[checkY][checkZ].length) return false;

        const cell = board[checkY][checkZ][checkX];
        return cell !== "" && cell !== piece.symbol;
      });
    });
  }

  /**
   * Place a piece on the board
   */
  function placePiece(board, piece, startX, layerY, startZ) {
    const newBoard = board.map(layer => 
      layer.map(row => row.map(cell => cell))
    );

    const coords3D = get3DCoords(piece, layerY);
    coords3D.forEach(([dx, dy, dz]) => {
      newBoard[dy][startZ + dz][startX + dx] = piece.symbol;
    });

    return newBoard;
  }

  /**
   * Recursive solver function that finds all solutions
   */
  function solveRecursive(currentBoard, remainingPieces, solutions = []) {
    if (remainingPieces.length === 0) {
      console.log("Found solution!", solutions.length + 1);
      const solution = currentBoard.map(layer => layer.map(row => [...row]));
      solutions.push(solution);
      onSolution(solution);
      return;
    }

    for (let i = 0; i < remainingPieces.length; i++) {
      const piece = remainingPieces[i];
      const orientations = getAllOrientations(piece);

      for (const orientation of orientations) {
        for (let y = 0; y < currentBoard.length; y++) {
          for (let z = 0; z < currentBoard[y].length; z++) {
            for (let x = 0; x < currentBoard[y][z].length; x++) {
              if (canPlacePiece(currentBoard, {
                ...piece,
                coords: orientation
              }, x, y, z) && 
                  isConnected(currentBoard, piece, x, y, z)) {
                const newBoard = placePiece(currentBoard, piece, x, y, z);
                const newPieces = [
                  ...remainingPieces.slice(0, i),
                  ...remainingPieces.slice(i + 1)
                ];
                solveRecursive(newBoard, newPieces, solutions);
              }
            }
          }
        }
      }
    }

    return solutions;
  }

  // Get remaining pieces and start solving
  const remainingPieces = unusedPieces.filter(piece => 
    !placedPieces.has(piece.symbol)
  );

  console.log("Starting solve with remaining pieces:", 
    remainingPieces.map(p => p.symbol));
    
  const solutions = solveRecursive(board, remainingPieces);
  
  if (solutions.length === 0) {
    console.log("No solutions found!");
  } else {
    console.log(`Found ${solutions.length} solutions!`);
  }
}