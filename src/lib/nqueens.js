function isValid(board) {
  for (let i = 0; i < board.length; i++){
    for (let j = 0; j < board[i].length; j++){
      if (board[i][j] == 1) {
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

function isSafe(board, row, col) {
  let n = board.length;
  // checking vertically
  for (let i = 0; i < n; i++) {
    if(board[i][col]===1){
        return false;
      }     
  }
  // checking horizontally
  for (let i = 0; i < n; i++) {
      if(board[row][i]===1){
          return false;
      }     
  }
  let steps;
  // top left diagonal
  steps=Math.min(row,col)
  for(let i=1;i<=steps;i++){
    if(board[row-i][col-i]===1){
      return false
    }
  }
  // bottom left diagonal
  steps=Math.min(n-row-1,col)
  for(let i=1;i<=steps;i++){
    if(board[row+i][col-i]===1){
      return false
    }
  }
  // bottom right diagonal
  steps=Math.min(n-row-1,n-col-1)
  for(let i=1;i<=steps;i++){
    if(board[row+i][col+i]===1){
      return false
    }
  }
  // top right diagonal
  steps=Math.min(row,n-col-1)
  for(let i=1;i<=steps;i++){
    if(board[row-i][col+i]===1){
      return false
    }
  }
  return true;
}

function solveNQueens(board) {
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
