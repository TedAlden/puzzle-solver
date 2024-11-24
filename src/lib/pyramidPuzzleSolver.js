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
      .map((coord) => coord.join(","))
      .join("|");
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
    const result = Array.from(orientations).map((str) =>
      str.split("|").map((coord) => coord.split(",").map(Number))
    );

    orientationsCache.set(cacheKey, result);
    return result;
  }

  /*
   * Print the current state of the board to the console
   */
  function printBoard(board) {
    board.forEach((layer, y) => {
      layer.forEach((row) => {
        console.log(row.map((val) => (val ? val : "-")).join(" "));
      });
    });
  }

  /**
   * Check if a piece can be placed at the specified position
   */
  function canPlacePiece(board, symbol, coords, startX, startY, startZ) {
    // Map the 2D shape into 3D coords based on start position
    const coords3D = coords.map(([x, z]) => [startX + x, startY, startZ + z]);
    // Check the piece falls inside the pyramid's bounds
    const isInBounds = coords3D.every(([x, y, z]) => {
      if (y < 0 || y >= board.length) return false;
      if (z < 0 || z >= board[y].length) return false;
      if (x < 0 || x >= board[y][z].length) return false;
      return true;
    });
    // Return false early if piece is out of bounds, to prevent index out of
    // range errors in the later checks
    if (!isInBounds) return false;
    // Check the piece doesn't overlap with existing pieces; space must be empty
    const isEmptySpace = coords3D.every(([x, y, z]) => {
      // Check if space is empty
      if (board[y][z][x] !== "") return false;
      return true;
    });
    // Check the piece is supported unless it is on the bottom layer
    const isSupported = coords3D.every(([x, y, z]) => {
      if (y > 0 && board[y - 1][z][x] === "") return false;
      return true;
    });
    // Check if this is the first piece being placed
    const isFirstPiece = placedPieces.size === 0;
    // Check the piece is connected to existing pieces
    const isConnected = coords3D.some(([x, y, z]) => {
      const neighbors = [
        [-1, 0, 0],
        [1, 0, 0],
        [0, 0, -1],
        [0, 0, 1],
        [0, -1, 0],
        [0, 1, 0],
      ];
      return neighbors.some(([nx, ny, nz]) => {
        const checkX = x + nx;
        const checkY = y + ny;
        const checkZ = z + nz;

        if (checkY < 0 || checkY >= board.length) return false;
        if (checkZ < 0 || checkZ >= board[checkY].length) return false;
        if (checkX < 0 || checkX >= board[checkY][checkZ].length) return false;

        const cell = board[checkY][checkZ][checkX];
        return cell !== "" && cell !== symbol;
      });
    });
    // Determine if the piece can be placed. If this is the first piece being
    // placed, it does not need to be connected to existing pieces
    return (
      isInBounds && isEmptySpace && isSupported && (isConnected || isFirstPiece)
    );
  }

  /**
   * Place a piece on the board
   */
  function placePiece(board, symbol, coords, startX, startY, startZ) {
    // Deep copy the board
    const newBoard = board.map((layer) =>
      layer.map((row) => row.map((cell) => cell))
    );
    // Map the 2D shape into 3D coords based on start position
    const coords3D = coords.map(([x, z]) => [x, startY, z]);
    // Place the shape onto the pyramid board
    coords3D.forEach(([dx, dy, dz]) => {
      newBoard[dy][startZ + dz][startX + dx] = symbol;
    });
    return newBoard;
  }

  /**
   * Recursive solver function that finds all solutions
   */
  function solveRecursive(board, remainingPieces, solutions = []) {
    if (remainingPieces.length === 0) {
      console.log("Found solution!", solutions.length + 1);
      const solution = board.map((layer) => layer.map((row) => [...row]));
      solutions.push(solution);
      onSolution(solution);
      return;
    }

    for (let i = 0; i < remainingPieces.length; i++) {
      const piece = remainingPieces[i];
      const symbol = piece.symbol;
      const orientations = getAllOrientations(piece);

      for (const orientation of orientations) {
        for (let y = 0; y < board.length; y++) {
          for (let z = 0; z < board[y].length; z++) {
            for (let x = 0; x < board[y][z].length; x++) {
              if (canPlacePiece(board, symbol, orientation, x, y, z)) {
                // Place piece on the board
                const newBoard = placePiece(
                  board,
                  symbol,
                  orientation,
                  x,
                  y,
                  z
                );
                printBoard(newBoard);
                // Remove the placed piece from our remaining pieces
                const newPieces = [
                  ...remainingPieces.slice(0, i),
                  ...remainingPieces.slice(i + 1),
                ];
                // Continue solving recursively
                solveRecursive(newBoard, newPieces, solutions);
              }
            }
          }
        }
      }
    }
    return solutions;
  }

  //
  // Startup code
  //

  console.log("=== Pyramid Solver Starting ===");

  // Find all pieces that have already been placed
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
  console.log("Found pieces:", Array.from(placedPieces).join(", "));

  // Get remaining pieces and start solving
  const remainingPieces = unusedPieces.filter(
    (piece) => !placedPieces.has(piece.symbol)
  );
  console.log(
    "Remaining pieces:",
    remainingPieces.map((p) => p.symbol).join(", ")
  );

  // Start solver
  const solutions = solveRecursive(board, remainingPieces);

  // Output solutions when finished
  if (solutions.length === 0) {
    console.log("No solutions found!");
  } else {
    console.log(`Found ${solutions.length} solutions!`);
  }
}
