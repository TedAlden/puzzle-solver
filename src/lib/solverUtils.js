/**
 * Finds the next empty position on the board.
 */
export const findEmptyPosition = (board) => {
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
 * Gets all unique orientations of a piece (rotations and flips).
 */
export const getAllOrientations = (coords) => {
  const orientations = new Set();
  let current = [...coords];

  const rotateX = (coords) => coords.map(([x, y, z]) => [-y, x, z]);
  const rotateY = (coords) => coords.map(([x, y, z]) => [z, y, -x]);
  const rotateZ = (coords) => coords.map(([x, y, z]) => [x, -z, y]);

  const flipX = (coords) => coords.map(([x, y, z]) => [-x, y, z]);
  const flipY = (coords) => coords.map(([x, y, z]) => [x, -y, z]);
  const flipZ = (coords) => coords.map(([x, y, z]) => [x, y, -z]);

  for (let fx = 0; fx < 2; fx++) {
    for (let fy = 0; fy < 2; fy++) {
      for (let fz = 0; fz < 2; fz++) {
        for (let rx = 0; rx < 4; rx++) {
          for (let ry = 0; ry < 4; ry++) {
            for (let rz = 0; rz < 4; rz++) {
              orientations.add(JSON.stringify(current));
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

  return Array.from(orientations).map((str) =>
    JSON.parse(str)
  );
};

/**
 * Finds anchor points for a piece.
 */
export const findAnchorPoints = (startCoords) => {
  const normalize = (coords) => {
    const minLayer = Math.min(...coords.map(([l]) => l));
    const minRow = Math.min(...coords.map(([, r]) => r));
    const minCol = Math.min(...coords.map(([, , c]) => c));
    return coords.map(([l, r, c]) => [l - minLayer, r - minRow, c - minCol]);
  };

  const points = [];
  const coords = normalize(startCoords);
  coords.forEach(([x, y, z]) => {
    points.push(coords.map(([cx, cy, cz]) => [cx - x, cy - y, cz - z]));
  });
  return points;
};

/**
 * Checks if a piece can be placed at a specific position.
 */
export const canPlacePiece = (board, coords, startLayer, startRow, startCol) =>
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
 */
export const placePiece = (board, piece, coords, startLayer, startRow, startCol) => {
  const newBoard = board.map((layer) => layer.map((row) => [...row]));
  coords.forEach(([l, r, c]) => {
    newBoard[startLayer + l][startRow + r][startCol + c] = piece.symbol;
  });
  return newBoard;
};
