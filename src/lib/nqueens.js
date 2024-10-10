export default function solveNQueens(board) {
  function isSafe(board, row, col) {
    let i, j;
    for (i = 0; i < col; i++){
      if (board[row][i] === 1){
        return false;
      }
    }
    for (i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) {
        return false;
      }
    }
    for (i = row, j = col; j >= 0 && i < row.length; i++, j--) {
      if (board[i][j] === 1) {
        return false;
      }
    }
    return true;
  }
  function solveRecursive(board, col) {
    if (col >= board[0].length) {
      return true;
    }
    for (let i = 0; i < board[0].length; i++) {
      if (board[i][col] === 1) {
        return solveRecursive(board, col + 1);
      }
    }
    for (let i = 0; i < board[0].length; i++) {
      if (isSafe(board, i, col)) {
        board[i][col] = 1;
        if (solveRecursive(board, col + 1)) {
          return true;
        }
        board[i][col] = 0;
      }
    }
    return false;
  }
  return solveRecursive(board, 0);
}
