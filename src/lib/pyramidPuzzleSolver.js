import {
generateAllOrientations, }from "./utils";

import pieces3D from "./pieces3D";
/**
 * Recursive pyramid puzzle solver.
 *
 * @param {Array<Array<Array<string>>>} board The current pyramid board state.
 * @param {Array<Object>} unusedPieces Array of pieces yet to be placed.
 * @param {Function} onSolution Callback function to handle a solution.
 */
function pyramidPuzzleSolver(board, unusedPieces, onSolution) {
  console.log("Starting pyramidPuzzleSolver...");
  console.log("Current board state:");
  console.table(board);
  console.log(
    `Unused pieces: ${unusedPieces.length}`,
    unusedPieces.map((p) => p.symbol)
  );

  if (unusedPieces.length === 0) {
    console.log("Solution found! Final board:");
    console.table(board);
    onSolution(board);
    return;
  }

  const piece = unusedPieces[0];
  const orientations = generateAllOrientations(piece.coords);

  console.log(`Generating orientations for piece ${piece.symbol}`);
  console.log(`Generated ${orientations.length} unique orientations`);
  console.log("Sample orientation:", orientations[0]);

  for (let layer = 0; layer < board.length; layer++) {
    for (let row = 0; row < board[layer].length; row++) {
      for (let col = 0; col < board[layer][row].length; col++) {
        for (const orientation of orientations) {
          if (canPlacePiece(board, orientation, layer, row, col)) {
            console.log(
              `Attempting to place piece ${piece.symbol} at (${layer}, ${row}, ${col})`
            );
            const newBoard = placePiece(
              board,
              orientation,
              layer,
              row,
              col,
              piece.symbol
            );

            console.log(
              `Recursing with remaining pieces:`,
              unusedPieces.slice(1).map((p) => p.symbol)
            );
            pyramidPuzzleSolver(newBoard, unusedPieces.slice(1), onSolution);
            console.log(
              `Backtracking after attempting piece ${piece.symbol} at (${layer}, ${row}, ${col})`
            );
          }
        }
      }
    }
  }
}

/**
 * Checks if a piece can be placed on the board at the given position.
 *
 * @param {Array<Array<Array<string>>>} board The current board state.
 * @param {Array<Array<number>>} pieceCoords The 3D coordinates of the piece in its orientation.
 * @param {number} layer The pyramid layer to place the piece.
 * @param {number} row The row in the layer.
 * @param {number} col The column in the layer.
 * @returns {boolean} True if the piece can be placed, false otherwise.
 */

function canPlacePiece(board, pieceCoords, layer, row, col) {
  console.log(`Checking placement for piece at (${layer}, ${row}, ${col})`);
  for (const [x, y, z] of pieceCoords) {
    const targetLayer = layer + y;
    const targetRow = row + z;
    const targetCol = col + x;

    if (
      targetLayer < 0 ||
      targetLayer >= board.length ||
      targetRow < 0 ||
      targetRow >= board[targetLayer].length ||
      targetCol < 0 ||
      targetCol >= board[targetLayer][targetRow].length
    ) {
      console.log(
        `Out of bounds: (${targetLayer}, ${targetRow}, ${targetCol})`
      );
      return false;
    }

    if (board[targetLayer][targetRow][targetCol] !== "") {
      console.log(
        `Cell already occupied: (${targetLayer}, ${targetRow}, ${targetCol})`
      );
      return false;
    }
  }
  return true;
}

/**
 * Places a piece on the board at the given position.
 *
 * @param {Array<Array<Array<string>>>} board The current board state.
 * @param {Array<Array<number>>} pieceCoords The 3D coordinates of the piece in its orientation.
 * @param {number} layer The pyramid layer to place the piece.
 * @param {number} row The row in the layer.
 * @param {number} col The column in the layer.
 * @param {string} symbol The symbol of the piece.
 * @returns {Array<Array<Array<string>>>} A new board state with the piece placed.
 */
function placePiece(board, pieceCoords, layer, row, col, symbol) {
  console.log(
    `Placing piece ${symbol} at (${layer}, ${row}, ${col}) with coords:`,
    pieceCoords
  );

  const newBoard = board.map((layer) => layer.map((row) => [...row]));

  for (const [x, y, z] of pieceCoords) {
    const targetLayer = layer + y;
    const targetRow = row + z;
    const targetCol = col + x;
    newBoard[targetLayer][targetRow][targetCol] = symbol;
  }

  console.log("New board state after placement:");
  console.table(newBoard);
  return newBoard;
}

export default pyramidPuzzleSolver;
