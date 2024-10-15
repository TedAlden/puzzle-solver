/**
 * Checks if all queens on the board are safe.
 * @param {number[][]} board The chess board
 * @returns {boolean} Is the board valid
 */
function isValid(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 1) {
        // Temporarily remove queen to not interfere with its own safety check
        board[i][j] = 0;
        if (!isSafe(board, i, j)) {
          return false;
        }
        board[i][j] = 1;
      }
    }
  }
  return true;
}

/**
 * Checks if a given queen is safe from attack from all other queens on the
 * board.
 * @param {number[][]} board The chess board
 * @param {number} row The row of the queen to be checked
 * @param {number} col The column of the queen to be checked
 * @returns {boolean} Is the queen safe from attack
 */
function isSafe(board, row, col) {
  let n = board.length;
  // Checking vertically
  for (let i = 0; i < n; i++) {
    if (board[i][col] === 1) {
      return false;
    }
  }
  // Checking horizontally
  for (let i = 0; i < n; i++) {
    if (board[row][i] === 1) {
      return false;
    }
  }
  let steps;
  // Top left diagonal
  steps = Math.min(row, col)
  for (let i = 1; i <= steps; i++) {
    if (board[row - i][col - i] === 1) {
      return false
    }
  }
  // Bottom left diagonal
  steps = Math.min(n - row - 1, col)
  for (let i = 1; i <= steps; i++) {
    if (board[row + i][col - i] === 1) {
      return false
    }
  }
  // Bottom right diagonal
  steps = Math.min(n - row - 1, n - col - 1)
  for (let i = 1; i <= steps; i++) {
    if (board[row + i][col + i] === 1) {
      return false
    }
  }
  // Top right diagonal
  steps = Math.min(row, n - col - 1)
  for (let i = 1; i <= steps; i++) {
    if (board[row - i][col + i] === 1) {
      return false
    }
  }
  return true;
}

/**
 * Attempt to solve the N-Queens problem on a given chess board.
 * @param {number[][]} board The chess board to solve
 * @returns {boolean} Is the board N-Queens solvable
 */
function solveNQueens(board) {
  // Solve board recursively column by column
  function solveRecursive(board, col) {
    // Board has been solved if all columns have been solved
    if (col >= board[0].length) {
      return true;
    }
    for (let i = 0; i < board[0].length; i++) {
      // If queen already placed in this column, skip to the next
      if (board[i][col] === 1) {
        return solveRecursive(board, col + 1);
      }
    }
    for (let i = 0; i < board[0].length; i++) {
      if (isSafe(board, i, col)) {
        // Attempt to place a queen in this cell and solve
        board[i][col] = 1;
        if (solveRecursive(board, col + 1)) {
          return true;
        }
        // Otherwise remove queen and backtrack
        board[i][col] = 0;
      }
    }
    return false;
  }
  // Check if board is valid before attempting to solve
  if (!isValid(board)) {
    return false;
  }
  return solveRecursive(board, 0);
}

module.exports = {
  isValid,
  isSafe,
  solveNQueens
}
